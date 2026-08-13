import React, { useState } from 'react';
import {
  X,
  MapPin,
  ExternalLink,
  ThumbsUp,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Truck,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  Clock
} from 'lucide-react';
import { DamageReport } from '../types';

interface ReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: DamageReport | null;
  onUpvote?: (reportId: string) => void;
  onFocusMap?: (report: DamageReport) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  isOpen,
  onClose,
  report,
  onUpvote,
  onFocusMap
}) => {
  const [activePhotoView, setActivePhotoView] = useState<'BEFORE' | 'AFTER' | 'SIDE_BY_SIDE'>('SIDE_BY_SIDE');

  if (!isOpen || !report) return null;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${report.coordinates[0]},${report.coordinates[1]}`;

  const severityColors = {
    CRITICAL: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    SEVERE: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    MODERATE: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    LIGHT: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
  };

  const statusLabels = {
    PENDING: 'Menunggu Verifikasi Teknisi',
    VERIFIED_BY_ENGINEER: 'Terverifikasi Teknisi PUPR',
    SCHEDULED_FOR_REPAIR: 'Dijadwalkan Penanganan',
    REPAIRED: 'Selesai Diperbaiki PUPR'
  };

  const statusBadges = {
    PENDING: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    VERIFIED_BY_ENGINEER: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    SCHEDULED_FOR_REPAIR: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    REPAIRED: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  };

  // Fallback repair details if not populated
  const afterPhotoPreset =
    report.repairDetails?.afterPhotoUrl ||
    'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&q=80&w=800';

  const repairDate = report.repairDetails?.repairDate || '13 Agustus 2026 (Penanganan PUPR)';
  const repairMethod =
    report.repairDetails?.repairMethod ||
    'Penambalan Lubang Cold-Mix / Hot-Mix + Overlay AC-WC 8.5 cm & Penataan Drainase';
  const pciImprovement =
    report.repairDetails?.repairedPciImprovement || 'PCI 28 → PCI 92 (Kondisi Sangat Mantap)';
  const agencyInCharge =
    report.repairDetails?.agencyInCharge || 'Balai Besar Pelaksanaan Jalan Nasional (BBPJN / Dinas PUPR)';
  const engineerNote =
    report.repairDetails?.engineerNote ||
    'Telah diverifikasi dan ditindaklanjuti oleh tim pemeliharaan jalan berdasarkan korelasi telemetri WIM & PINN.';

  return (
    <div className="fixed inset-0 z-[1400] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200 pointer-events-auto overflow-y-auto">
      <div className="bg-slate-900/95 border border-white/20 rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl space-y-4 text-slate-100 max-h-[92vh] overflow-y-auto my-auto relative font-sans">
        {/* Floating Top Bar / Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-3 gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-cyan-300 border border-indigo-500/30 shrink-0">
              <Camera className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {report.id}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${severityColors[report.severity]}`}>
                  {report.severity}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${statusBadges[report.status]}`}>
                  {statusLabels[report.status]}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-white mt-1">
                {report.segmentName}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all shrink-0 border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reporter Metadata & Timestamp */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/70 border border-white/10 p-2.5 rounded-2xl text-xs">
          <div className="flex items-center space-x-2.5">
            <img
              src={report.reporterAvatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'}
              alt={report.reporterName}
              className="w-7 h-7 rounded-full object-cover border border-cyan-400/50"
            />
            <div>
              <p className="font-bold text-white text-[11.5px]">{report.reporterName}</p>
              <p className="text-[9.5px] text-slate-400 font-mono">{report.reporterRole}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-[10px] text-slate-300 font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              {report.timestamp}
            </span>
            <span className="flex items-center gap-1 bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
              <ThumbsUp className="w-3 h-3 text-cyan-400" />
              {report.upvotesCount} Dukungan Warga
            </span>
          </div>
        </div>

        {/* BEFORE & AFTER PHOTO COMPARISON SECTION */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              Komparasi Foto Kerusakan (Sebelum vs. Sesudah Perbaikan)
            </h3>

            {/* View Mode Switcher Buttons */}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-white/10 text-[10px] font-mono font-bold">
              <button
                onClick={() => setActivePhotoView('SIDE_BY_SIDE')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activePhotoView === 'SIDE_BY_SIDE'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Side-by-Side (2 Kolom)
              </button>
              <button
                onClick={() => setActivePhotoView('BEFORE')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activePhotoView === 'BEFORE'
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🔴 Sebelum
              </button>
              <button
                onClick={() => setActivePhotoView('AFTER')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activePhotoView === 'AFTER'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🟢 Sesudah
              </button>
            </div>
          </div>

          {/* Photos Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* BEFORE PHOTO */}
            {(activePhotoView === 'SIDE_BY_SIDE' || activePhotoView === 'BEFORE') && (
              <div className={`relative bg-slate-950 rounded-2xl overflow-hidden border border-rose-500/40 shadow-lg ${activePhotoView === 'BEFORE' ? 'md:col-span-2' : ''}`}>
                <div className="absolute top-2 left-2 z-10 bg-rose-950/90 border border-rose-500/60 text-rose-200 text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>🔴 SEBELUM (Laporan Awal Warga)</span>
                </div>
                <img
                  src={report.photoUrl}
                  alt="Kondisi Sebelum Perbaikan"
                  className="w-full h-44 sm:h-52 object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="p-2.5 bg-slate-950/90 border-t border-rose-500/30 text-[10.5px] space-y-1">
                  <p className="font-bold text-rose-300 flex items-center justify-between">
                    <span>{report.damageTypeLabel}</span>
                    <span className="font-mono text-[10px]">Kedalaman: {report.estimatedDepthCm} cm</span>
                  </p>
                  <p className="text-slate-300 italic text-[10px] line-clamp-2">
                    "{report.description}"
                  </p>
                </div>
              </div>
            )}

            {/* AFTER PHOTO */}
            {(activePhotoView === 'SIDE_BY_SIDE' || activePhotoView === 'AFTER') && (
              <div className={`relative bg-slate-950 rounded-2xl overflow-hidden border border-emerald-500/40 shadow-lg ${activePhotoView === 'AFTER' ? 'md:col-span-2' : ''}`}>
                <div className="absolute top-2 left-2 z-10 bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>🟢 SESUDAH (Hasil Penanganan PUPR)</span>
                </div>
                <img
                  src={afterPhotoPreset}
                  alt="Kondisi Sesudah Perbaikan"
                  className="w-full h-44 sm:h-52 object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="p-2.5 bg-slate-950/90 border-t border-emerald-500/30 text-[10.5px] space-y-1">
                  <p className="font-bold text-emerald-300 flex items-center justify-between">
                    <span>{pciImprovement}</span>
                    <span className="font-mono text-[10px] text-emerald-400">{repairDate}</span>
                  </p>
                  <p className="text-slate-300 text-[10px] line-clamp-2">
                    <strong className="text-cyan-300">Metode:</strong> {repairMethod}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* REPAIR & ENGINEERING SUMMARY BOX */}
        <div className="bg-slate-950/80 border border-indigo-500/30 p-3 rounded-2xl space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
            <span className="font-bold text-cyan-300 font-mono text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Detail Penanganan Infrastruktur Jalan
            </span>
            <span className="text-[9.5px] font-mono text-slate-400">{agencyInCharge}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <p className="text-[9.5px] text-slate-400 uppercase font-mono font-bold">Metode Perbaikan</p>
              <p className="font-semibold text-white mt-0.5">{repairMethod}</p>
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <p className="text-[9.5px] text-slate-400 uppercase font-mono font-bold">Peningkatan Kondisi PCI</p>
              <p className="font-semibold text-emerald-400 mt-0.5">{pciImprovement}</p>
            </div>
          </div>

          <p className="text-[10.5px] text-slate-300 bg-indigo-950/40 p-2 rounded-xl border border-indigo-500/20 italic">
            <strong className="text-indigo-300">Catatan Engineer PUPR:</strong> "{engineerNote}"
          </p>
        </div>

        {/* WIM VEHICLE OVERLOAD & PINN CORRELATION BOX */}
        {report.wimCorrelation && (
          <div className="bg-slate-950/90 border border-rose-500/40 p-3 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
              <span className="font-extrabold text-rose-300 font-mono text-[11px] flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-rose-400" />
                Korelasi Telemetri Sensor WIM & Kalkulasi PINN
              </span>
              <span className="text-[9.5px] font-mono bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30">
                {report.wimCorrelation.recentTruckPlate} (+{report.wimCorrelation.overloadPercent}% Overload)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px] font-mono">
              <div className="bg-white/5 p-2 rounded-xl">
                <p className="text-[9px] text-slate-400 uppercase">Stasiun WIM</p>
                <p className="font-bold text-white truncate">{report.wimCorrelation.stationId}</p>
              </div>
              <div className="bg-white/5 p-2 rounded-xl">
                <p className="text-[9px] text-slate-400 uppercase">Tipe Truk</p>
                <p className="font-bold text-cyan-300 truncate">{report.wimCorrelation.recentTruckClass.split('-')[0]}</p>
              </div>
              <div className="bg-white/5 p-2 rounded-xl">
                <p className="text-[9px] text-slate-400 uppercase">Beban Sumbu</p>
                <p className="font-bold text-rose-400">{report.wimCorrelation.maxAxleLoadTon} Ton</p>
              </div>
              <div className="bg-white/5 p-2 rounded-xl">
                <p className="text-[9px] text-slate-400 uppercase">Perkontribusi PINN</p>
                <p className="font-bold text-amber-300">{report.wimCorrelation.estimatedPinnContributionPercent}%</p>
              </div>
            </div>

            <p className="text-[10px] text-slate-300 bg-slate-900 p-2 rounded-xl border border-white/5 leading-relaxed font-mono">
              {report.wimCorrelation.causeAnalysisSummary}
            </p>
          </div>
        )}

        {/* GPS COORDINATES & GOOGLE MAPS DIRECT LINK */}
        <div className="bg-slate-950/90 border border-cyan-500/40 p-3 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
              <MapPin className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-mono font-bold">
                Lokasi & Titik Koordinat Presisi GPS
              </p>
              <p className="text-xs font-bold text-white font-mono mt-0.5">
                📍 Lat: <span className="text-cyan-300">{report.coordinates[0].toFixed(5)}</span> | Lng: <span className="text-cyan-300">{report.coordinates[1].toFixed(5)}</span>
              </p>
              <p className="text-[10.5px] text-slate-400">{report.corridor} ({report.province})</p>
            </div>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-600/30 border border-white/20 transition-all shrink-0"
          >
            <span>Buka di Google Maps</span>
            <ExternalLink className="w-4 h-4 text-cyan-200" />
          </a>
        </div>

        {/* ACTION FOOTER */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs">
          <button
            onClick={() => onUpvote && onUpvote(report.id)}
            className={`w-full sm:w-auto px-4 py-2 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-2 border transition-all ${
              report.userUpvoted
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/10'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{report.userUpvoted ? 'Dukungan Berhasil (Upvoted)' : `Dukung Laporan Ini (${report.upvotesCount})`}</span>
          </button>

          {onFocusMap && (
            <button
              onClick={() => {
                onFocusMap(report);
                onClose();
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 border border-white/20 shadow-md shadow-indigo-600/30 transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Fokus Titik di Peta Geospasial</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
