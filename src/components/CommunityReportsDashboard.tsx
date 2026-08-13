import React, { useState } from 'react';
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  Send,
  Truck,
  ThumbsUp,
  MapPin,
  Layers,
  Sparkles,
  Info,
  Eye,
  PenTool,
  PlusCircle,
  Filter,
  Search,
  Activity,
  ShieldAlert,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import {
  DamageReport,
  DamageType,
  ReportSeverity,
  ReportStatus,
  RoadSegment,
  UserRole
} from '../types';
import { UserAccount } from '../data/userAccounts';
import { ALL_BINA_MARGA_WIM_STATIONS } from '../data/indonesianRoads';
import { ReportDetailModal } from './ReportDetailModal';

interface CommunityReportsDashboardProps {
  activeRole: UserRole;
  currentAccount: UserAccount;
  roadSegments: RoadSegment[];
  reports: DamageReport[];
  onAddReport: (newReport: DamageReport) => void;
  onUpvoteReport: (reportId: string) => void;
  onSelectSegmentForMap: (segmentId: string) => void;
  onRunSimulationForSegment: (segment: RoadSegment) => void;
}

export const CommunityReportsDashboard: React.FC<CommunityReportsDashboardProps> = ({
  activeRole,
  currentAccount,
  roadSegments,
  reports,
  onAddReport,
  onUpvoteReport,
  onSelectSegmentForMap,
  onRunSimulationForSegment
}) => {
  // Detail & Before/After Comparison Modal State
  const [selectedDetailReport, setSelectedDetailReport] = useState<DamageReport | null>(null);

  // Public Viewer Access Mode (Only applicable for PUBLIC_VIEWER)
  const [viewerInputMode, setViewerInputMode] = useState<'READ_ONLY' | 'INPUT_ENABLED'>('READ_ONLY');

  // Modal / Form state for creating report
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>(roadSegments[0].id);
  const [damageType, setDamageType] = useState<DamageType>('POTHOLE');
  const [severity, setSeverity] = useState<ReportSeverity>('SEVERE');
  const [estimatedDepthCm, setEstimatedDepthCm] = useState<number>(12);
  const [estimatedAreaM2, setEstimatedAreaM2] = useState<number>(4.5);
  const [description, setDescription] = useState<string>('');
  const [photoPresetIndex, setPhotoPresetIndex] = useState<number>(0);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [damageTypeFilter, setDamageTypeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sample photo presets for rapid community reporting
  const PHOTO_PRESETS = [
    {
      url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=600',
      label: 'Lubang Dalam (Pothole)'
    },
    {
      url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&q=80&w=600',
      label: 'Ambles & Rutting'
    },
    {
      url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&q=80&w=600',
      label: 'Retak Buaya Kritis'
    }
  ];

  // Selected segment object for WIM auto-correlation
  const currentSelectedSegment = roadSegments.find((s) => s.id === selectedSegmentId) || roadSegments[0];

  // Find associated WIM station for this segment
  const matchedWimStation =
    ALL_BINA_MARGA_WIM_STATIONS.find(
      (wim) =>
        wim.corridor.toLowerCase().includes(currentSelectedSegment.corridor.toLowerCase().split(' ')[0]) ||
        wim.province === currentSelectedSegment.province
    ) || ALL_BINA_MARGA_WIM_STATIONS[0];

  // Determine if current user can input reports right now
  const canInputReport =
    activeRole === 'PUBLIC_REPORTER' ||
    (activeRole === 'PUBLIC_VIEWER' && viewerInputMode === 'INPUT_ENABLED') ||
    activeRole === 'FIELD_ENGINEER' ||
    activeRole === 'OPERATIONS_MANAGER';

  // Handle Form Submission
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      alert('Mohon isi deskripsi catatan kerusakan jalan!');
      return;
    }

    const damageLabels: Record<DamageType, string> = {
      POTHOLE: 'Lubang Dalam (Pothole)',
      ALLIGATOR_CRACK: 'Retak Buaya (Alligator Cracking)',
      RUTTING: 'Ambles & Deformasi Alur (Rutting)',
      CORRUGATION: 'Kerusakan Gelombang (Corrugation)',
      SUBSIDENCE: 'Penurunan Pondasi (Subsidence)'
    };

    const newReport: DamageReport = {
      id: `REP-${Date.now().toString().slice(-6)}`,
      reporterName: currentAccount.name,
      reporterRole:
        activeRole === 'PUBLIC_REPORTER'
          ? 'Pelapor Masyarakat Terverifikasi'
          : activeRole === 'PUBLIC_VIEWER'
          ? 'Pengamat Komunitas'
          : 'Petugas Lapangan',
      reporterAvatar: currentAccount.avatarUrl,
      timestamp: new Date().toLocaleString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      segmentId: currentSelectedSegment.id,
      segmentName: currentSelectedSegment.name,
      corridor: currentSelectedSegment.corridor,
      province: currentSelectedSegment.province,
      coordinates: currentSelectedSegment.coordinates,
      damageType: damageType,
      damageTypeLabel: damageLabels[damageType],
      severity: severity,
      estimatedDepthCm: Number(estimatedDepthCm),
      estimatedAreaM2: Number(estimatedAreaM2),
      photoUrl: PHOTO_PRESETS[photoPresetIndex].url,
      description: description,
      status: 'PENDING',
      upvotesCount: 1,
      userUpvoted: true,
      wimCorrelation: {
        hasWimData: true,
        stationId: matchedWimStation.stationId,
        stationName: matchedWimStation.stationName,
        corridor: matchedWimStation.corridor,
        recentTruckPlate: matchedWimStation.licensePlate,
        recentTruckClass: matchedWimStation.vehicleClass,
        maxAxleLoadTon: matchedWimStation.maxAxleLoadTon,
        legalLimitTon: matchedWimStation.legalLimitTon,
        overloadPercent: matchedWimStation.overloadPercent,
        overloadCategory: matchedWimStation.overloadCategory || 'EXTREME',
        correlatedOverloadTrucksCount: Math.floor(110 + Math.random() * 120),
        estimatedPinnContributionPercent: Math.floor(72 + Math.random() * 20),
        causeAnalysisSummary: `Korelasi PINN & WIM Otomatis: Kerusakan di ${currentSelectedSegment.name} dipercepat hingga ${Math.floor(72 + Math.random() * 20)}% oleh beban terdeteksi kendaraan ${matchedWimStation.vehicleClass} (${matchedWimStation.licensePlate}) berbeban ${matchedWimStation.maxAxleLoadTon} Ton (+${matchedWimStation.overloadPercent}% Overload) dari Stasiun WIM ${matchedWimStation.stationName}.`
      }
    };

    onAddReport(newReport);
    setIsFormOpen(false);
    setDescription('');
  };

  // Filtered reports list
  const filteredReports = reports.filter((r) => {
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchType = damageTypeFilter === 'ALL' || r.damageType === damageTypeFilter;
    const matchSearch =
      searchQuery === '' ||
      r.segmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.corridor.toLowerCase().includes(searchQuery.toLowerCase());

    return matchStatus && matchType && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Public Role Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/40 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-3.5 bg-indigo-500/20 text-cyan-300 rounded-2xl border border-indigo-500/30 shrink-0">
              <Camera className="w-6 h-6 animate-pulse text-cyan-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                  Partisipasi Komunitas & Pelaporan Jalan
                </span>
                {activeRole === 'PUBLIC_REPORTER' && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Role 1: Pelapor Utama (Dapat Input & Lihat)
                  </span>
                )}
                {activeRole === 'PUBLIC_VIEWER' && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    Role 2: Pengamat Komunitas ({viewerInputMode === 'READ_ONLY' ? 'Hanya Lihat' : 'Mode Input Aktif'})
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white mt-1">
                Portal Pelaporan Kerusakan Jalan & Korelasi Kendaraan WIM
              </h2>
              <p className="text-xs text-slate-300 max-w-3xl">
                Setiap laporan masyarakat secara otomatis dihubungkan dengan sensor telemetri kendaraan berat **Weigh-In-Motion (WIM) Bina Marga** & kalkulasi fisika perkerasan **PINN** untuk mengetahui truk pemicu utama kerusakan.
              </p>
            </div>
          </div>

          {/* Role 2 Mode Switcher (If PUBLIC_VIEWER) */}
          {activeRole === 'PUBLIC_VIEWER' && (
            <div className="bg-slate-950/80 border border-amber-500/40 p-3 rounded-2xl flex flex-col gap-2 shrink-0">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-amber-300 border-b border-white/10 pb-1.5">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Setting Pengguna Kedua:
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setViewerInputMode('READ_ONLY')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center space-x-1.5 ${
                    viewerInputMode === 'READ_ONLY'
                      ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Hanya Lihat Laporan</span>
                </button>
                <button
                  onClick={() => setViewerInputMode('INPUT_ENABLED')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center space-x-1.5 ${
                    viewerInputMode === 'INPUT_ENABLED'
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Bisa Input Laporan</span>
                </button>
              </div>
            </div>
          )}

          {/* Action Button: Input New Damage Report */}
          <button
            onClick={() => {
              if (canInputReport) {
                setIsFormOpen(true);
              } else {
                alert(
                  'Anda berada dalam mode Read-Only (Hanya Lihat Laporan). Aktifkan "Bisa Input Laporan" pada tombol setting di atas untuk membuat laporan baru.'
                );
              }
            }}
            className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-xl shrink-0 ${
              canInputReport
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 border border-white/20'
                : 'bg-slate-800 text-slate-400 cursor-not-allowed border border-white/10'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-cyan-300" />
            <span>+ Laporkan Kerusakan Jalan Baru</span>
          </button>
        </div>

        {/* Quick Statistics Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/10 text-xs">
          <div className="bg-slate-950/60 p-2.5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Total Laporan Komunitas:</span>
            <p className="text-base font-extrabold text-white font-mono">{reports.length} Laporan</p>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Terverifikasi Engineer:</span>
            <p className="text-base font-extrabold text-emerald-400 font-mono">
              {reports.filter((r) => r.status === 'VERIFIED_BY_ENGINEER' || r.status === 'SCHEDULED_FOR_REPAIR').length} Laporan
            </p>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Kategori Kritis & Lubang:</span>
            <p className="text-base font-extrabold text-rose-400 font-mono">
              {reports.filter((r) => r.severity === 'CRITICAL' || r.damageType === 'POTHOLE').length} Laporan
            </p>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Korelasi WIM Overload:</span>
            <p className="text-base font-extrabold text-cyan-300 font-mono">82.4% Akibat ODOL</p>
          </div>
        </div>
      </div>

      {/* MODAL / FORM: Input Laporan Kerusakan Jalan */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[1200] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/95 border border-white/20 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-slate-100 max-h-[92vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-indigo-500/20 text-cyan-300 rounded-2xl border border-indigo-500/30">
                  <PlusCircle className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Formulir Pelaporan Kerusakan Jalan Komunitas
                  </h3>
                  <p className="text-xs text-slate-300">
                    Sistem akan otomatis menghubungkan lokasi laporan dengan telemetri WIM terdekat
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
              {/* 1. Select Road Segment Location */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  1. Pilih Lokasi Ruas Jalan Kerusakan:
                </label>
                <select
                  value={selectedSegmentId}
                  onChange={(e) => setSelectedSegmentId(e.target.value)}
                  className="w-full bg-slate-950 border border-white/15 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-400 font-semibold"
                >
                  {roadSegments.map((seg) => (
                    <option key={seg.id} value={seg.id}>
                      {seg.name} ({seg.province}) - PCI: {seg.currentPci}
                    </option>
                  ))}
                </select>
              </div>

              {/* Real-time WIM Auto-Correlation Live Preview Box */}
              <div className="bg-indigo-950/60 border border-indigo-500/40 rounded-2xl p-3.5 space-y-2 text-[11px]">
                <div className="flex items-center justify-between border-b border-indigo-500/30 pb-2">
                  <span className="font-bold font-mono text-cyan-300 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-cyan-400 animate-pulse" />
                    KORELASI OTOMATIS STASIUN WIM BINA MARGA TERDEKAT:
                  </span>
                  <span className="bg-rose-500/20 text-rose-300 text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                    OVERLOAD +{matchedWimStation.overloadPercent}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono text-slate-200">
                  <div>
                    <span className="text-slate-400">Stasiun WIM:</span> <strong>{matchedWimStation.stationName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Truk Terakhir:</span> <strong>{matchedWimStation.licensePlate}</strong> ({matchedWimStation.maxAxleLoadTon} Ton)
                  </div>
                </div>
                <p className="text-[10.5px] text-indigo-200 font-medium">
                  💡 <em>PINN Physics Engine: Laporan ini langsung dikorelasikan dengan lintasan {matchedWimStation.vehicleClass} yang memicu kelelahan lentur asphalt.</em>
                </p>
              </div>

              {/* 2. Damage Type & Severity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200">2. Jenis Kerusakan Jalan:</label>
                  <select
                    value={damageType}
                    onChange={(e) => setDamageType(e.target.value as DamageType)}
                    className="w-full bg-slate-950 border border-white/15 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400 font-medium"
                  >
                    <option value="POTHOLE">Lubang Dalam (Pothole)</option>
                    <option value="ALLIGATOR_CRACK">Retak Buaya (Alligator Cracking)</option>
                    <option value="RUTTING">Ambles & Deformasi Alur (Rutting)</option>
                    <option value="CORRUGATION">Kerusakan Gelombang (Corrugation)</option>
                    <option value="SUBSIDENCE">Penurunan Pondasi (Subsidence)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200">3. Tingkat Keparahan Bahaya:</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as ReportSeverity)}
                    className="w-full bg-slate-950 border border-white/15 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400 font-medium"
                  >
                    <option value="LIGHT">Ringan (Tidak Membahayakan)</option>
                    <option value="MODERATE">Sedang (Perlu Kehati-hatian)</option>
                    <option value="SEVERE">Parah (Risiko Banting Setir)</option>
                    <option value="CRITICAL">Sangat Kritis (Risiko Kecelakaan Tinggi)</option>
                  </select>
                </div>
              </div>

              {/* 3. Estimasi Kedalaman & Luas Area */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200">Estimasi Kedalaman (cm):</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={estimatedDepthCm}
                    onChange={(e) => setEstimatedDepthCm(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-white/15 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400 font-mono font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200">Estimasi Luas Area (m²):</label>
                  <input
                    type="number"
                    step={0.5}
                    min={0.5}
                    max={100}
                    value={estimatedAreaM2}
                    onChange={(e) => setEstimatedAreaM2(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-white/15 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400 font-mono font-bold"
                  />
                </div>
              </div>

              {/* 4. Photo Preset Selection */}
              <div className="space-y-2">
                <label className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  4. Foto Lampiran Lapangan (Preset Sampel):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PHOTO_PRESETS.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => setPhotoPresetIndex(idx)}
                      className={`cursor-pointer rounded-xl border p-1 transition-all ${
                        photoPresetIndex === idx
                          ? 'border-cyan-400 bg-cyan-950/40 ring-2 ring-cyan-400/50'
                          : 'border-white/10 bg-slate-950 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-16 object-cover rounded-lg mb-1" />
                      <p className="text-[9.5px] font-bold text-center text-slate-300 truncate">{preset.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Catatan Deskripsi */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-200">5. Deskripsi Detail Kerusakan & Dampak:</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan kondisi spesifik, posisi lajur jalan, dan potensi bahaya yang ditimbulkan bagi kendaraan..."
                  className="w-full bg-slate-950 border border-white/15 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-400 font-medium"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center space-x-1.5 shadow-lg shadow-indigo-600/30"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Laporan Komunitas</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FILTER BAR & SEARCH */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center space-x-1.5 text-slate-400 font-mono font-bold uppercase text-[10px]">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>Filter Status:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-white/15 text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-400 font-medium"
          >
            <option value="ALL">Semua Status Laporan</option>
            <option value="PENDING">🕒 Menunggu Verifikasi</option>
            <option value="VERIFIED_BY_ENGINEER">✅ Diverifikasi Engineer</option>
            <option value="SCHEDULED_FOR_REPAIR">🚧 Dijadwalkan Pemeliharaan</option>
            <option value="REPAIRED">🎉 Selesai Perbaikan</option>
          </select>

          <select
            value={damageTypeFilter}
            onChange={(e) => setDamageTypeFilter(e.target.value)}
            className="bg-slate-950 border border-white/15 text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-400 font-medium"
          >
            <option value="ALL">Semua Jenis Kerusakan</option>
            <option value="POTHOLE">Lubang Dalam (Pothole)</option>
            <option value="RUTTING">Ambles & Rutting</option>
            <option value="ALLIGATOR_CRACK">Retak Buaya</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ruas jalan atau deskripsi..."
            className="w-full bg-slate-950 border border-white/15 text-white text-xs rounded-xl pl-9 pr-3 py-1.5 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* COMMUNITY REPORTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            onClick={() => setSelectedDetailReport(report)}
            className="bg-slate-900/90 border border-white/10 hover:border-indigo-500/50 hover:bg-slate-900 rounded-3xl p-4 space-y-3 shadow-xl transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              {/* Reporter Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={
                      report.reporterAvatar ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
                    }
                    alt={report.reporterName}
                    className="w-8 h-8 rounded-xl object-cover border border-white/20"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {report.reporterName}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono">{report.reporterRole}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`text-[9.5px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    report.status === 'VERIFIED_BY_ENGINEER'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : report.status === 'SCHEDULED_FOR_REPAIR'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-slate-800 text-slate-300 border-white/10'
                  }`}
                >
                  {report.status === 'VERIFIED_BY_ENGINEER' && '✅ Diverifikasi'}
                  {report.status === 'SCHEDULED_FOR_REPAIR' && '🚧 Dijadwalkan'}
                  {report.status === 'PENDING' && '🕒 Menunggu'}
                </span>
              </div>

              {/* Photo & Severity Badge */}
              <div className="relative mt-3 rounded-2xl overflow-hidden border border-white/10 h-40">
                <img src={report.photoUrl} alt={report.damageTypeLabel} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-bold font-mono text-rose-400 border border-rose-500/30 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                  <span>{report.severity}</span>
                </div>
                <div className="absolute bottom-2 left-2 bg-slate-950/85 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-[10px] font-mono text-cyan-300 border border-white/10">
                  📍 {report.province}
                </div>
              </div>

              {/* Location & Title */}
              <div className="mt-3 space-y-1">
                <h3 className="text-xs font-extrabold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">{report.segmentName}</h3>
                <p className="text-[10.5px] text-slate-400 font-medium">{report.corridor}</p>
                <div className="inline-block bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 text-[10px] font-bold px-2 py-0.5 rounded-md font-mono">
                  {report.damageTypeLabel} &bull; Dalam: {report.estimatedDepthCm} cm &bull; Luas: {report.estimatedAreaM2} m²
                </div>
                <p className="text-xs text-slate-300 pt-1 line-clamp-2 italic">"{report.description}"</p>
              </div>

              {/* Dedicated WIM Vehicle Overload Correlation Box */}
              {report.wimCorrelation && (
                <div className="mt-3 bg-gradient-to-r from-indigo-950/70 to-slate-950 border border-indigo-500/30 rounded-2xl p-3 space-y-1.5 text-[10.5px]">
                  <div className="flex items-center justify-between font-mono font-bold text-cyan-300 border-b border-indigo-500/20 pb-1">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-cyan-400" /> KORELASI VEHICLE WIM:
                    </span>
                    <span className="text-rose-400 text-[9.5px]">
                      Pemicu: +{report.wimCorrelation.overloadPercent}% ODOL
                    </span>
                  </div>
                  <p className="text-slate-300 font-mono text-[10px]">
                    Truk Terdeteksi: <strong className="text-white">{report.wimCorrelation.recentTruckPlate}</strong> ({report.wimCorrelation.maxAxleLoadTon} Ton)
                  </p>
                  <p className="text-indigo-200 text-[10px] leading-tight">
                    {report.wimCorrelation.causeAnalysisSummary}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Card Controls & Upvote */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-3 text-xs gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpvoteReport(report.id);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center space-x-1 border ${
                  report.userUpvoted
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{report.upvotesCount}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDetailReport(report);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] font-mono transition-all flex items-center space-x-1 border border-white/20 shadow-md"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-200" />
                <span>Sebelum/Sesudah</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSegmentForMap(report.segmentId);
                }}
                className="text-xs font-bold text-indigo-400 hover:text-cyan-300 font-mono flex items-center space-x-1"
              >
                <span>Peta</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Report Detail & Before/After Comparison Modal */}
      <ReportDetailModal
        isOpen={!!selectedDetailReport}
        onClose={() => setSelectedDetailReport(null)}
        report={selectedDetailReport}
        onUpvote={onUpvoteReport}
        onFocusMap={(rep) => {
          setSelectedDetailReport(null);
          onSelectSegmentForMap(rep.segmentId);
        }}
      />
    </div>
  );
};
