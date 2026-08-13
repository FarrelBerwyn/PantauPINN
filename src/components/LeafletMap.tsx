import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { DamageReport, DamageType, ReportSeverity, RoadSegment, UserRole } from '../types';
import { UserAccount } from '../data/userAccounts';
import { ALL_BINA_MARGA_WIM_STATIONS } from '../data/indonesianRoads';
import {
  Filter,
  Search,
  Sparkles,
  BarChart2,
  AlertTriangle,
  Truck,
  MapPin,
  ShieldAlert,
  Camera,
  PlusCircle,
  Send,
  ThumbsUp,
  X,
  Info,
  ChevronDown
} from 'lucide-react';

interface LeafletMapProps {
  roadSegments: RoadSegment[];
  selectedSegment: RoadSegment | null;
  onSelectSegment: (segment: RoadSegment) => void;
  onLaunchSimulation: (segment: RoadSegment) => void;
  activeRole: UserRole;
  onNavigateToDashboard: () => void;
  communityReports?: DamageReport[];
  onAddReport?: (newReport: DamageReport) => void;
  onUpvoteReport?: (reportId: string) => void;
  currentAccount?: UserAccount;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  roadSegments,
  selectedSegment,
  onSelectSegment,
  onLaunchSimulation,
  activeRole,
  onNavigateToDashboard,
  communityReports = [],
  onAddReport,
  onUpvoteReport,
  currentAccount
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Filters State
  const [provinceFilter, setProvinceFilter] = useState<string>('ALL');
  const [conditionFilter, setConditionFilter] = useState<string>('ALL');
  const [showWimOnly, setShowWimOnly] = useState<boolean>(false);
  const [showCommunityReports, setShowCommunityReports] = useState<boolean>(true);
  const [showAllCommunityReports, setShowAllCommunityReports] = useState<boolean>(false);
  const [wimStatusFilter, setWimStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Report Modal Form State
  const [isReportFormOpen, setIsReportFormOpen] = useState<boolean>(false);
  const [formSegmentId, setFormSegmentId] = useState<string>(roadSegments[0]?.id || '');
  const [formDamageType, setFormDamageType] = useState<DamageType>('POTHOLE');
  const [formSeverity, setFormSeverity] = useState<ReportSeverity>('SEVERE');
  const [formEstimatedDepth, setFormEstimatedDepth] = useState<number>(12);
  const [formEstimatedArea, setFormEstimatedArea] = useState<number>(4.5);
  const [formDescription, setFormDescription] = useState<string>('');
  const [formPhotoIndex, setFormPhotoIndex] = useState<number>(0);

  // Selected Segment for Form WIM Correlation
  const activeFormSegment = roadSegments.find((s) => s.id === formSegmentId) || roadSegments[0] || selectedSegment;

  const matchedWimStation =
    ALL_BINA_MARGA_WIM_STATIONS.find(
      (wim) =>
        (activeFormSegment?.corridor &&
          wim.corridor.toLowerCase().includes(activeFormSegment.corridor.toLowerCase().split(' ')[0])) ||
        wim.province === activeFormSegment?.province
    ) || ALL_BINA_MARGA_WIM_STATIONS[0];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDescription.trim()) {
      alert('Mohon masukkan deskripsi kerusakan jalan!');
      return;
    }

    const damageLabels: Record<DamageType, string> = {
      POTHOLE: 'Lubang Dalam (Pothole)',
      ALLIGATOR_CRACK: 'Retak Buaya (Alligator Cracking)',
      RUTTING: 'Ambles & Deformasi Alur (Rutting)',
      CORRUGATION: 'Kerusakan Gelombang (Corrugation)',
      SUBSIDENCE: 'Penurunan Pondasi (Subsidence)'
    };

    const photoPresets = [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&q=80&w=600'
    ];

    const newReport: DamageReport = {
      id: `REP-${Date.now().toString().slice(-6)}`,
      reporterName: currentAccount?.name || 'Masyarakat Pelapor',
      reporterRole:
        activeRole === 'PUBLIC_REPORTER'
          ? 'Pelapor Terverifikasi'
          : activeRole === 'PUBLIC_VIEWER'
          ? 'Pengamat Komunitas'
          : 'Petugas Lapangan',
      reporterAvatar:
        currentAccount?.avatarUrl ||
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      timestamp: new Date().toLocaleString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      segmentId: activeFormSegment.id,
      segmentName: activeFormSegment.name,
      corridor: activeFormSegment.corridor,
      province: activeFormSegment.province,
      coordinates: activeFormSegment.coordinates,
      damageType: formDamageType,
      damageTypeLabel: damageLabels[formDamageType],
      severity: formSeverity,
      estimatedDepthCm: Number(formEstimatedDepth),
      estimatedAreaM2: Number(formEstimatedArea),
      photoUrl: photoPresets[formPhotoIndex] || photoPresets[0],
      description: formDescription,
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
        correlatedOverloadTrucksCount: Math.floor(110 + Math.random() * 110),
        estimatedPinnContributionPercent: Math.floor(75 + Math.random() * 20),
        causeAnalysisSummary: `Korelasi PINN & WIM Otomatis: Laporan kerusakan di ${activeFormSegment.name} dikorelasikan dengan lintasan truk ${matchedWimStation.vehicleClass} (${matchedWimStation.licensePlate}) berbeban ${matchedWimStation.maxAxleLoadTon} Ton (+${matchedWimStation.overloadPercent}% Overload) dari Stasiun WIM ${matchedWimStation.stationName}.`
      }
    };

    if (onAddReport) {
      onAddReport(newReport);
    }

    setIsReportFormOpen(false);
    setFormDescription('');
  };

  // Filtered Segments
  const filteredSegments = roadSegments.filter((seg) => {
    const matchProvince = provinceFilter === 'ALL' || seg.province === provinceFilter;
    const matchCondition =
      conditionFilter === 'ALL' || seg.conditionCategory === conditionFilter;
    const matchWim = !showWimOnly || seg.hasWimStation;
    const matchSearch =
      searchQuery === '' ||
      seg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seg.corridor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seg.province.toLowerCase().includes(searchQuery.toLowerCase());
    return matchProvince && matchCondition && matchWim && matchSearch;
  });

  // Filtered WIM Stations
  const filteredWimStations = ALL_BINA_MARGA_WIM_STATIONS.filter((wim) => {
    if (!showWimOnly) return false;

    const matchProvince = provinceFilter === 'ALL' || wim.province === provinceFilter;
    const matchSearch =
      searchQuery === '' ||
      wim.stationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wim.corridor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wim.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wim.stationId.toLowerCase().includes(searchQuery.toLowerCase());

    let matchStatus = true;
    if (wimStatusFilter === 'EXTREME') {
      matchStatus = wim.overloadCategory === 'EXTREME' || wim.overloadPercent > 100;
    } else if (wimStatusFilter === 'HEAVY') {
      matchStatus = wim.overloadCategory === 'HEAVY' || (wim.overloadPercent > 50 && wim.overloadPercent <= 100);
    } else if (wimStatusFilter === 'MODERATE') {
      matchStatus = wim.overloadCategory === 'MODERATE' || (wim.overloadPercent > 20 && wim.overloadPercent <= 50);
    } else if (wimStatusFilter === 'LIGHT') {
      matchStatus = wim.overloadCategory === 'LIGHT' || (wim.overloadPercent > 0 && wim.overloadPercent <= 20);
    } else if (wimStatusFilter === 'NONE') {
      matchStatus = wim.overloadCategory === 'NONE' || wim.overloadPercent === 0;
    }

    return matchProvince && matchSearch && matchStatus;
  });

  // Calculate Map Summary Metrics
  const totalLengthKm = roadSegments.reduce((sum, s) => sum + (s.lengthKm || 0), 0) || 1;
  const damagedKm = roadSegments
    .filter((s) => s.conditionCategory === 'LIGHT_DAMAGE' || s.conditionCategory === 'HEAVY_DAMAGE')
    .reduce((sum, s) => sum + (s.lengthKm || 0), 0);
  const damagedPercent = ((damagedKm / totalLengthKm) * 100).toFixed(1);
  const activeRedAlertsCount = roadSegments.filter((s) => s.activeOdolAlert === 'RED').length;
  const avgPci = roadSegments.length
    ? Math.round(roadSegments.reduce((sum, s) => sum + (s.currentPci || 0), 0) / roadSegments.length)
    : 0;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [-2.5, 118.0],
        zoom: 5,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // CartoDB Dark Matter / Positron tiles
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19
        }
      ).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Render Polylines and Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    filteredSegments.forEach((segment) => {
      const color =
        segment.conditionCategory === 'GOOD'
          ? '#10b981'
          : segment.conditionCategory === 'MODERATE'
          ? '#f59e0b'
          : segment.conditionCategory === 'LIGHT_DAMAGE'
          ? '#f97316'
          : '#ef4444';

      // Calculate PCI impact radius in meters (Inversely proportional to PCI: lower PCI = larger damage radius zone)
      const pciDamageLevel = Math.max(10, 100 - segment.currentPci);
      const pciRadiusMeters =
        segment.conditionCategory === 'HEAVY_DAMAGE'
          ? Math.round(pciDamageLevel * 60) // e.g. PCI 28 -> 4,320m
          : segment.conditionCategory === 'LIGHT_DAMAGE'
          ? Math.round(pciDamageLevel * 50) // e.g. PCI 42 -> 2,900m
          : segment.conditionCategory === 'MODERATE'
          ? Math.round(pciDamageLevel * 40) // e.g. PCI 62 -> 1,520m
          : Math.round(pciDamageLevel * 30); // e.g. PCI 88 -> 360m

      const pulseDurationSec =
        segment.conditionCategory === 'HEAVY_DAMAGE'
          ? '1.2s'
          : segment.conditionCategory === 'LIGHT_DAMAGE'
          ? '1.8s'
          : segment.conditionCategory === 'MODERATE'
          ? '2.5s'
          : '3.8s';

      // 1. Render animated Leaflet geodesic circle (real geographic radius in meters)
      const pciCircle = L.circle(segment.coordinates, {
        radius: pciRadiusMeters,
        color: color,
        fillColor: color,
        fillOpacity: selectedSegment?.id === segment.id ? 0.28 : 0.14,
        weight: selectedSegment?.id === segment.id ? 2.5 : 1.5,
        className: 'leaflet-pci-animated-circle'
      }).addTo(layerGroup);

      pciCircle.bindTooltip(
        `<b>${segment.name}</b><br/>PCI: <strong>${segment.currentPci}</strong> (${segment.conditionCategory})<br/>Radius Dampak Kerusakan: <strong>${(pciRadiusMeters / 1000).toFixed(1)} km</strong>`,
        { direction: 'top', opacity: 0.9 }
      );

      pciCircle.on('click', () => {
        onSelectSegment(segment);
      });

      const polyline = L.polyline(segment.polyline, {
        color,
        weight: selectedSegment?.id === segment.id ? 8 : 5,
        opacity: selectedSegment?.id === segment.id ? 1.0 : 0.85
      }).addTo(layerGroup);

      polyline.on('click', () => {
        onSelectSegment(segment);
      });

      // 2. Render marker with animated pulsing CSS radar waves
      const customIconHtml = `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
          <!-- Pulsing Radar Wave 1 -->
          <div class="pci-pulse-wave" style="
            width: 38px;
            height: 38px;
            border: 2px solid ${color};
            background-color: ${color}20;
            --pulse-duration: ${pulseDurationSec};
          "></div>
          
          <!-- Pulsing Radar Wave 2 (Delayed) -->
          <div class="pci-pulse-wave pci-pulse-wave-delayed" style="
            width: 38px;
            height: 38px;
            border: 2px solid ${color};
            background-color: ${color}15;
            --pulse-duration: ${pulseDurationSec};
          "></div>

          <!-- Central PCI Badge -->
          <div style="
            position: relative;
            z-index: 10;
            background-color: ${color};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 2.5px solid #ffffff;
            box-shadow: 0 4px 14px rgba(0,0,0,0.5), 0 0 10px ${color}aa;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 800;
            font-size: 11px;
            font-family: monospace;
          ">
            ${segment.currentPci}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: customIconHtml,
        className: 'custom-leaflet-marker',
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const marker = L.marker(segment.coordinates, { icon: customIcon }).addTo(layerGroup);

      // If segment has WIM station, render dedicated WIM Sensor Station Marker
      if (segment.hasWimStation && segment.wimDetails) {
        const wim = segment.wimDetails;
        const wimAlertColor =
          wim.alertSeverity === 'RED'
            ? '#ef4444'
            : wim.alertSeverity === 'YELLOW'
            ? '#f59e0b'
            : '#10b981';

        const wimIconHtml = `
          <div style="
            position: relative;
            background-color: #0f172a;
            border: 2px solid ${wimAlertColor};
            border-radius: 12px;
            padding: 3px 6px;
            box-shadow: 0 4px 14px rgba(0,0,0,0.6), 0 0 10px ${wimAlertColor}80;
            display: flex;
            align-items: center;
            gap: 4px;
            color: white;
            font-size: 10px;
            font-weight: 800;
            white-space: nowrap;
            cursor: pointer;
          ">
            <span style="
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background-color: ${wimAlertColor};
              display: inline-block;
              box-shadow: 0 0 8px ${wimAlertColor};
            "></span>
            <span>⚖️ WIM: ${wim.stationId}</span>
          </div>
        `;

        const wimIcon = L.divIcon({
          html: wimIconHtml,
          className: 'custom-wim-leaflet-marker',
          iconSize: [110, 24],
          iconAnchor: [55, 12]
        });

        const wimMarker = L.marker(wim.coordinates, { icon: wimIcon }).addTo(layerGroup);

        const wimPopupHtml = `
          <div style="font-family: system-ui, -apple-system, sans-serif; padding: 6px; width: 280px; color: #0f172a;">
            <!-- Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; border-b: 1px solid #e2e8f0; padding-bottom: 6px;">
              <div style="display: flex; align-items: center; gap: 4px;">
                <span style="background-color: #3b82f615; color: #1d4ed8; font-weight: 800; font-size: 10px; padding: 2px 6px; border-radius: 6px; font-family: monospace;">
                  ${wim.stationId}
                </span>
                <span style="font-size: 10px; font-weight: 700; color: #64748b;">STASIUN SENSOR WIM</span>
              </div>
              <span style="background-color: ${wimAlertColor}20; color: ${wimAlertColor}; border: 1px solid ${wimAlertColor}50; font-size: 9.5px; font-weight: 800; padding: 2px 8px; border-radius: 12px;">
                ${wim.alertSeverity === 'RED' ? '🔴 RED ALERT (ODOL)' : wim.alertSeverity === 'YELLOW' ? '🟡 WARNING' : '🟢 NORMAL PASS'}
              </span>
            </div>

            <!-- Station Title & Location -->
            <h4 style="font-size: 13px; font-weight: 800; color: #0f172a; margin: 0 0 2px 0;">${wim.stationName}</h4>
            <p style="font-size: 10.5px; color: #475569; margin: 0 0 8px 0; font-family: monospace;">
              📍 GPS: <strong style="color: #0284c7;">${wim.coordinates[0].toFixed(4)}, ${wim.coordinates[1].toFixed(4)}</strong> (${wim.province})
            </p>

            <!-- ANPR & Vehicle Load Telemetry -->
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px; font-size: 11px; margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px;">
                <span style="color: #64748b;">Truk / ANPR:</span>
                <span style="font-weight: 800; color: #0f172a; font-family: monospace;">${wim.licensePlate} (${wim.speedKmh} km/h)</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: #64748b;">Golongan:</span>
                <span style="font-weight: 700; color: #334155; font-size: 10px;">${wim.vehicleClass}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: #64748b;">Beban Sumbu Maks:</span>
                <span style="font-weight: 800; color: ${wim.maxAxleLoadTon > 10 ? '#dc2626' : '#16a34a'};">
                  ${wim.maxAxleLoadTon} Ton ${wim.maxAxleLoadTon > 10 ? `(+${wim.overloadPercent}% ODOL)` : ''}
                </span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748b;">Gross Weight:</span>
                <span style="font-weight: 700; color: #1e293b;">${wim.grossWeightTon} Ton (MST ${wim.legalLimitTon} Ton)</span>
              </div>
            </div>

            <!-- PINN Engineering Impact Correlation -->
            <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 8px; font-size: 10.5px; color: #1e40af; margin-bottom: 8px;">
              <div style="font-weight: 800; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between;">
                <span>🧠 KORELASI PINN FISIKA PERKERASAN</span>
                <span style="font-size: 9px; background-color: #2563eb; color: white; padding: 1px 5px; border-radius: 8px;">FWD Validated</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span>Defleksi Permukaan FWD:</span>
                <strong>${wim.fwdDeflectionMicron} µm</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span>Indeks Induksi Kerusakan:</span>
                <strong style="color: #b91c1c;">${wim.pinnDamageImpactIndex} / 100</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Rekomendasi Overlay AC-WC:</span>
                <strong>${wim.overlayRecommendationCm} cm</strong>
              </div>
            </div>

            <div style="display: flex; gap: 4px;">
              <button id="btn-wim-sim-${segment.id}" style="
                flex: 1;
                background: linear-gradient(135deg, #4f46e5, #0284c7);
                color: white;
                border: none;
                border-radius: 8px;
                padding: 7px 10px;
                font-size: 10.5px;
                font-weight: 700;
                cursor: pointer;
                box-shadow: 0 4px 10px rgba(2, 132, 199, 0.3);
              ">
                ⚡ Jalankan Simulasi PINN
              </button>
            </div>
          </div>
        `;

        wimMarker.bindPopup(wimPopupHtml);

        wimMarker.on('popupopen', () => {
          onSelectSegment(segment);
          const btnWimSim = document.getElementById(`btn-wim-sim-${segment.id}`);
          if (btnWimSim) {
            btnWimSim.onclick = () => onLaunchSimulation(segment);
          }
        });
      }

      const popupHtml = `
        <div style="font-family: system-ui, -apple-system, sans-serif; padding: 6px; min-width: 260px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">${segment.corridor}</span>
            <span style="background-color: ${color}20; color: ${color}; border: 1px solid ${color}40; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 12px;">
              PCI: ${segment.currentPci} (${segment.conditionCategory})
            </span>
          </div>
          <h4 style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 0 0 2px 0;">${segment.name}</h4>
          <p style="font-size: 10.5px; color: #475569; margin: 0 0 8px 0; font-family: monospace;">
            📍 Koordinat GPS: <strong style="color: #2563eb;">${segment.coordinates[0].toFixed(4)}, ${segment.coordinates[1].toFixed(4)}</strong> | ${segment.kmPost}
          </p>
          
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 8px; font-size: 11px; margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span style="color: #64748b;">Subgrade CBR:</span>
              <span style="font-weight: 700; color: #1e293b;">${segment.defaultCbrPercent}%</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span style="color: #64748b;">LHR Traffic:</span>
              <span style="font-weight: 700; color: #1e293b;">${segment.dailyTrafficVolumeLhr.toLocaleString('id-ID')} Kend/Hari</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">Beban Sumbu Rata-rata:</span>
              <span style="font-weight: 700; color: ${segment.defaultAxleLoadTon > 18 ? '#dc2626' : '#2563eb'};">
                ${segment.defaultAxleLoadTon} Ton ${segment.defaultAxleLoadTon > 10 ? '(ODOL)' : ''}
              </span>
            </div>
          </div>

          ${
            segment.hasWimStation && segment.wimDetails
              ? `<div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 6px 8px; font-size: 10.5px; color: #991b1b; margin-bottom: 8px;">
                  <div style="display: flex; items-center; justify-content: space-between; margin-bottom: 2px;">
                    <span style="font-weight: 800;">⚖️ ${segment.wimDetails.stationName}</span>
                    <span style="background-color: #ef4444; color: white; padding: 1px 5px; border-radius: 8px; font-weight: bold; font-size: 8.5px;">WIM ACTIVE</span>
                  </div>
                  <div style="font-size: 9.5px; color: #7f1d1d; font-family: monospace;">
                    📍 Sensor Lat/Lng: ${segment.wimDetails.coordinates[0].toFixed(4)}, ${segment.wimDetails.coordinates[1].toFixed(4)}
                  </div>
                  <div style="font-size: 9.5px; color: #991b1b; font-weight: bold; margin-top: 2px;">
                    Truk Terakhir: ${segment.wimDetails.licensePlate} (${segment.wimDetails.maxAxleLoadTon} Ton - ODOL +${segment.wimDetails.overloadPercent}%)
                  </div>
                </div>`
              : ''
          }

          <div style="display: flex; gap: 4px;">
            <button id="btn-sim-${segment.id}" style="
              flex: 1;
              background: linear-gradient(135deg, #6366f1, #4f46e5);
              color: white;
              border: none;
              border-radius: 10px;
              padding: 8px 10px;
              font-size: 11px;
              font-weight: 700;
              cursor: pointer;
              box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
            ">
              ⚡ Simulasi PINN
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        onSelectSegment(segment);
        const btnSim = document.getElementById(`btn-sim-${segment.id}`);
        if (btnSim) {
          btnSim.onclick = () => onLaunchSimulation(segment);
        }
      });
    });

    // Render Bina Marga National WIM Station Pin Points when showWimOnly is enabled
    if (showWimOnly) {
      filteredWimStations.forEach((wim) => {
        const pinColor =
          wim.overloadCategory === 'EXTREME' || wim.overloadPercent > 100
            ? '#ef4444' // Red
            : wim.overloadCategory === 'HEAVY' || wim.overloadPercent > 50
            ? '#a855f7' // Purple
            : wim.overloadCategory === 'MODERATE' || wim.overloadPercent > 20
            ? '#f97316' // Orange
            : wim.overloadCategory === 'LIGHT' || wim.overloadPercent > 0
            ? '#eab308' // Yellow
            : '#10b981'; // Green

        const pinCategoryText =
          wim.overloadCategory === 'EXTREME' || wim.overloadPercent > 100
            ? 'Overload Ekstrim (>100%)'
            : wim.overloadCategory === 'HEAVY' || wim.overloadPercent > 50
            ? 'Overload Berat (>50%)'
            : wim.overloadCategory === 'MODERATE' || wim.overloadPercent > 20
            ? 'Overload Sedang (20-50%)'
            : wim.overloadCategory === 'LIGHT' || wim.overloadPercent > 0
            ? 'Overload Ringan (5-20%)'
            : 'Tidak Overload';

        // Pin marker HTML (custom SVG pin matching Bina Marga Dashboard style)
        const wimPinHtml = `
          <div style="position: relative; width: 30px; height: 38px; cursor: pointer; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));">
            <svg viewBox="0 0 384 512" width="30" height="38" fill="${pinColor}" xmlns="http://www.w3.org/2000/svg">
              <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
            </svg>
            <div style="
              position: absolute;
              top: 5px;
              left: 50%;
              transform: translateX(-50%);
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background-color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              box-shadow: inset 0 1px 2px rgba(0,0,0,0.3);
            ">
              ⚖️
            </div>
          </div>
        `;

        const wimPinIcon = L.divIcon({
          html: wimPinHtml,
          className: 'bina-marga-wim-pin-marker',
          iconSize: [30, 38],
          iconAnchor: [15, 38]
        });

        const wimPinMarker = L.marker(wim.coordinates, { icon: wimPinIcon }).addTo(layerGroup);

        const wimPopupContent = `
          <div style="font-family: system-ui, -apple-system, sans-serif; padding: 6px; width: 285px; color: #0f172a;">
            <!-- Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
              <div style="display: flex; align-items: center; gap: 4px;">
                <span style="background-color: #3b82f615; color: #1d4ed8; font-weight: 800; font-size: 10px; padding: 2px 6px; border-radius: 6px; font-family: monospace;">
                  ${wim.stationId}
                </span>
                <span style="font-size: 10px; font-weight: 700; color: #64748b;">STASIUN WIM BINA MARGA</span>
              </div>
              <span style="background-color: ${pinColor}20; color: ${pinColor}; border: 1px solid ${pinColor}50; font-size: 9.5px; font-weight: 800; padding: 2px 8px; border-radius: 12px;">
                ${pinCategoryText}
              </span>
            </div>

            <!-- Station Name & Corridor -->
            <h4 style="font-size: 13px; font-weight: 800; color: #0f172a; margin: 0 0 2px 0;">${wim.stationName}</h4>
            <p style="font-size: 10px; color: #64748b; font-weight: 600; margin: 0 0 4px 0;">${wim.corridor}</p>
            <p style="font-size: 10.5px; color: #475569; margin: 0 0 8px 0; font-family: monospace;">
              📍 GPS: <strong style="color: #0284c7;">${wim.coordinates[0].toFixed(4)}, ${wim.coordinates[1].toFixed(4)}</strong> (${wim.province})
            </p>

            <!-- Telemetry -->
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px; font-size: 11px; margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px;">
                <span style="color: #64748b;">Truk / ANPR:</span>
                <span style="font-weight: 800; color: #0f172a; font-family: monospace;">${wim.licensePlate} (${wim.speedKmh} km/h)</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: #64748b;">Kelas Kendaraan:</span>
                <span style="font-weight: 700; color: #334155; font-size: 10px;">${wim.vehicleClass}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: #64748b;">Beban Sumbu Maks:</span>
                <span style="font-weight: 800; color: ${wim.maxAxleLoadTon > 10 ? '#dc2626' : '#16a34a'};">
                  ${wim.maxAxleLoadTon} Ton ${wim.overloadPercent > 0 ? `(+${wim.overloadPercent}%)` : ''}
                </span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748b;">Gross Weight:</span>
                <span style="font-weight: 700; color: #1e293b;">${wim.grossWeightTon} Ton (MST ${wim.legalLimitTon} Ton)</span>
              </div>
            </div>

            <!-- PINN Physics Impact -->
            <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 8px; font-size: 10.5px; color: #1e40af;">
              <div style="font-weight: 800; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between;">
                <span>🧠 KORELASI PINN FISIKA PERKERASAN</span>
                <span style="font-size: 9px; background-color: #2563eb; color: white; padding: 1px 5px; border-radius: 8px;">FWD Validated</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span>Defleksi Permukaan FWD:</span>
                <strong>${wim.fwdDeflectionMicron} µm</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span>Indeks Kerusakan Struktural:</span>
                <strong style="color: #b91c1c;">${wim.pinnDamageImpactIndex} / 100</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Rekomendasi Tebal Overlay:</span>
                <strong>${wim.overlayRecommendationCm} cm</strong>
              </div>
            </div>
          </div>
        `;

        wimPinMarker.bindPopup(wimPopupContent);
      });
    }

    // Render Community Damage Report Markers & Pulsing Radius Circles when showCommunityReports is enabled
    if (showCommunityReports && communityReports && communityReports.length > 0) {
      communityReports.forEach((report) => {
        // Dynamic pulse radius & color based on damage severity
        const reportRadiusMeters =
          report.severity === 'CRITICAL'
            ? 3800
            : report.severity === 'SEVERE'
            ? 2400
            : report.severity === 'MODERATE'
            ? 1300
            : 700;

        const reportColor =
          report.severity === 'CRITICAL'
            ? '#ef4444'
            : report.severity === 'SEVERE'
            ? '#f97316'
            : report.severity === 'MODERATE'
            ? '#f59e0b'
            : '#3b82f6';

        const reportPulseDuration =
          report.severity === 'CRITICAL'
            ? '0.8s'
            : report.severity === 'SEVERE'
            ? '1.3s'
            : report.severity === 'MODERATE'
            ? '2.1s'
            : '3.4s';

        // 1. Geodesic animated Leaflet circle for Community Damage Report
        const reportCircle = L.circle(report.coordinates, {
          radius: reportRadiusMeters,
          color: reportColor,
          fillColor: reportColor,
          fillOpacity: 0.18,
          weight: 2,
          className: 'leaflet-pci-animated-circle'
        }).addTo(layerGroup);

        reportCircle.bindTooltip(
          `<b>Laporan Warga (${report.damageTypeLabel})</b><br/>Tingkat Kerusakan: <strong style="color: ${reportColor};">${report.severity}</strong><br/>Radius Denyut Dampak: <strong>${(reportRadiusMeters / 1000).toFixed(1)} km</strong>`,
          { direction: 'top', opacity: 0.9 }
        );

        // 2. Animated pulse marker HTML
        const pinHtml = `
          <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <!-- Pulsing Radar Wave 1 -->
            <div class="pci-pulse-wave" style="
              width: 36px;
              height: 36px;
              border: 2px solid ${reportColor};
              background-color: ${reportColor}25;
              --pulse-duration: ${reportPulseDuration};
            "></div>

            <!-- Pulsing Radar Wave 2 (Delayed) -->
            <div class="pci-pulse-wave pci-pulse-wave-delayed" style="
              width: 36px;
              height: 36px;
              border: 2px solid ${reportColor};
              background-color: ${reportColor}15;
              --pulse-duration: ${reportPulseDuration};
            "></div>

            <!-- Marker Pin -->
            <div style="position: relative; z-index: 10; filter: drop-shadow(0 4px 10px ${reportColor}90);">
              <svg viewBox="0 0 384 512" width="30" height="36" fill="${reportColor}" xmlns="http://www.w3.org/2000/svg">
                <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
              </svg>
              <div style="
                position: absolute;
                top: 4px;
                left: 50%;
                transform: translateX(-50%);
                width: 17px;
                height: 17px;
                border-radius: 50%;
                background-color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 9.5px;
                box-shadow: inset 0 1px 2px rgba(0,0,0,0.4);
              ">
                📸
              </div>
            </div>
          </div>
        `;

        const reportIcon = L.divIcon({
          html: pinHtml,
          className: 'community-report-pin-marker',
          iconSize: [44, 44],
          iconAnchor: [22, 38]
        });

        const reportMarker = L.marker(report.coordinates, { icon: reportIcon }).addTo(layerGroup);

        const reportPopupContent = `
          <div style="font-family: system-ui, -apple-system, sans-serif; padding: 6px; width: 280px; color: #0f172a;">
            <!-- Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
              <span style="background-color: ${reportColor}20; color: ${reportColor}; font-weight: 800; font-size: 10px; padding: 2px 8px; border-radius: 12px; border: 1px solid ${reportColor}50;">
                📢 LAPORAN WARGA (${report.severity})
              </span>
              <span style="font-size: 10px; font-weight: 700; color: #64748b;">👍 ${report.upvotesCount} Dukungan</span>
            </div>

            <!-- Photo & Title -->
            <img src="${report.photoUrl}" alt="${report.damageTypeLabel}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />
            <h4 style="font-size: 12.5px; font-weight: 800; color: #0f172a; margin: 0 0 2px 0;">${report.segmentName}</h4>
            <p style="font-size: 10.5px; color: ${reportColor}; font-weight: 700; margin: 0 0 6px 0;">${report.damageTypeLabel} (${report.severity})</p>
            <p style="font-size: 11px; color: #334155; margin: 0 0 8px 0; font-style: italic;">"${report.description}"</p>

            <!-- WIM Vehicle Overload Correlation -->
            ${
              report.wimCorrelation
                ? `
              <div style="background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px; font-size: 10px; color: #1e293b;">
                <strong style="color: #0284c7;">🚛 Korelasi WIM: ${report.wimCorrelation.recentTruckPlate}</strong> (${report.wimCorrelation.maxAxleLoadTon} Ton)
                <div style="color: #475569; margin-top: 2px;">Overload: <strong style="color: #dc2626;">+${report.wimCorrelation.overloadPercent}%</strong> (Pemicu Utama PINN)</div>
              </div>
            `
                : ''
            }
          </div>
        `;

        reportMarker.bindPopup(reportPopupContent);
      });
    }
  }, [filteredSegments, filteredWimStations, communityReports, selectedSegment, showWimOnly, showCommunityReports]);

  // Center on selected segment
  useEffect(() => {
    if (selectedSegment && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(selectedSegment.coordinates, 9, {
        duration: 1.2
      });
    }
  }, [selectedSegment]);

  // Check if current logged-in role is a regular user account (Public Reporter / Viewer)
  const isRegularUser = activeRole === 'PUBLIC_REPORTER' || activeRole === 'PUBLIC_VIEWER';

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] min-h-[550px] bg-slate-950 overflow-hidden flex flex-col">
      {/* Main Leaflet Canvas Container (Full Bleed Background) */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Role Context Lens Header Bar (Floating Top) - ONLY for Official Roles */}
      {!isRegularUser && (
        <div className="relative z-10 m-4 mb-0">
          <div className="bg-slate-900/85 border border-white/15 rounded-2xl p-3 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xl">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-cyan-300 border border-indigo-500/30">
                {activeRole === 'FIELD_ENGINEER' && <BarChart2 className="w-5 h-5 text-amber-400" />}
                {activeRole === 'OPERATIONS_MANAGER' && <Truck className="w-5 h-5 text-rose-400" />}
                {activeRole === 'POLICY_MAKER' && <AlertTriangle className="w-5 h-5 text-indigo-400" />}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Lensa Peta Geospasial Aktif:
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border font-mono ${
                    activeRole === 'FIELD_ENGINEER'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : activeRole === 'OPERATIONS_MANAGER'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  }`}>
                    {activeRole.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs font-bold text-white">
                  {activeRole === 'FIELD_ENGINEER' && 'Pemetaan Kondisi Struktural Perkerasan, Defleksi FWD & Titik Kritis Regangan Asphalt'}
                  {activeRole === 'OPERATIONS_MANAGER' && 'Pemetaan Real-Time Stasiun WIM 24/7, Alert Truk Violasi ODOL & Pos Penindakan'}
                  {activeRole === 'POLICY_MAKER' && 'Pemetaan Koridor Logistik Strategis Nasional, Disparitas PCI & Alokasi Anggaran APBN'}
                </p>
              </div>
            </div>

            <button
              onClick={onNavigateToDashboard}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl border border-white/20 shadow-lg shadow-indigo-600/30 transition-all self-end sm:self-auto shrink-0 flex items-center space-x-1"
            >
              <span>Buka Dashboard Role ({activeRole.split('_')[0]})</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            </button>
          </div>
        </div>
      )}

      {/* LEFT SIDE VERTICAL CARD: Fitur Pelaporan Kerusakan Jalan (Masyarakat) - ONLY for Regular User accounts */}
      {isRegularUser && (
        <div className="absolute top-4 left-4 z-20 w-72 sm:w-80 md:w-84 max-h-[calc(100vh-14.5rem)] flex flex-col pointer-events-auto bg-slate-900/90 backdrop-blur-xl border border-cyan-500/40 rounded-2xl p-2.5 sm:p-3 shadow-2xl space-y-2 text-slate-200 text-xs animate-in fade-in slide-in-from-left-4 duration-300">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-indigo-500/20 text-cyan-300 rounded-lg border border-indigo-500/30 shrink-0">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-1 flex-wrap">
                  <h3 className="text-[11.5px] font-extrabold text-white">
                    Pelaporan Kerusakan (Masyarakat)
                  </h3>
                  <span className="text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    WIM Linked
                  </span>
                </div>
                <p className="text-[9.5px] text-slate-400 mt-0.5 leading-tight">
                  Laporan foto & lokasi ter-korelasi sensor WIM & PINN.
                </p>
              </div>
            </div>
          </div>

          {/* Add New Report CTA */}
          <button
            onClick={() => setIsReportFormOpen(true)}
            className="w-full py-1.5 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[11px] flex items-center justify-center space-x-1.5 shadow-lg shadow-indigo-600/30 border border-white/20 transition-all shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5 text-cyan-200" />
            <span>+ Laporkan Kerusakan Baru</span>
          </button>

          {/* Vertical Scrollable Report List */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 max-h-[190px] sm:max-h-[220px] custom-scrollbar">
            {communityReports && communityReports.length > 0 ? (
              (showAllCommunityReports ? communityReports : communityReports.slice(0, 3)).map((rep) => (
                <div
                  key={rep.id}
                  className="bg-slate-950/70 border border-white/10 hover:border-indigo-500/40 rounded-xl p-2 space-y-1 transition-all"
                >
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <span className="font-bold text-white text-[11px] block truncate max-w-[160px]">
                        {rep.segmentName}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {rep.province} • {rep.damageTypeLabel}
                      </span>
                    </div>
                    <span className="text-[8.5px] bg-rose-500/20 text-rose-300 font-mono font-bold px-1.5 py-0.2 rounded border border-rose-500/30 shrink-0">
                      {rep.severity}
                    </span>
                  </div>

                  <p className="text-[9.5px] text-slate-300 line-clamp-1 italic bg-white/5 p-1 rounded-lg border border-white/5">
                    "{rep.description}"
                  </p>

                  <div className="flex items-center justify-between text-[9.5px] pt-0.5">
                    <span className="text-cyan-300 font-mono flex items-center gap-1 text-[9px]">
                      <Truck className="w-3 h-3 text-cyan-400" />
                      {rep.wimCorrelation ? `${rep.wimCorrelation.recentTruckPlate} (+${rep.wimCorrelation.overloadPercent}%)` : 'WIM Linked'}
                    </span>
                    <button
                      onClick={() => onUpvoteReport && onUpvoteReport(rep.id)}
                      className={`px-1.5 py-0.2 rounded font-mono font-bold text-[9px] transition-all ${
                        rep.userUpvoted
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      👍 {rep.upvotesCount}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[10px] text-slate-400 text-center py-3">Belum ada laporan dari masyarakat.</p>
            )}
          </div>

          {/* Footer Actions: Tampilkan Lainnya & Dashboard Button */}
          <div className="pt-1.5 border-t border-white/10 shrink-0 flex flex-col gap-1.5">
            {communityReports && communityReports.length > 3 && (
              <button
                onClick={() => setShowAllCommunityReports(!showAllCommunityReports)}
                className="w-full py-1 px-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-cyan-300 font-extrabold text-[10.5px] flex items-center justify-center space-x-1 border border-white/10 transition-all"
              >
                <span>
                  {showAllCommunityReports ? 'Sembunyikan' : `Tampilkan ${communityReports.length - 3} Laporan Lainnya`}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${showAllCommunityReports ? 'rotate-180' : ''}`} />
              </button>
            )}

            <button
              onClick={onNavigateToDashboard}
              className="w-full py-1.5 px-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-[10.5px] flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-600/30 border border-white/20 transition-all"
            >
              <BarChart2 className="w-3.5 h-3.5 text-cyan-300" />
              <span>Buka Dashboard Laporan Lengkap</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Floating Control Bar (Filters & Search) */}
      <div className={`absolute ${isRegularUser ? 'top-4 left-4 sm:left-[19.5rem] md:left-[22.5rem]' : 'top-20 left-4'} right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none transition-all duration-300`}>
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto bg-slate-900/85 backdrop-blur-xl border border-white/15 p-2 rounded-2xl shadow-2xl">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari ruas jalan / koridor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950/70 border border-white/10 text-slate-100 text-xs rounded-xl pl-9 pr-3 py-1.5 w-44 focus:outline-none focus:border-indigo-400 transition-all placeholder:text-slate-500"
            />
          </div>

          {/* Province Filter */}
          <div className="flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="bg-slate-950/70 border border-white/10 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-400"
            >
              <option value="ALL">Semua Provinsi</option>
              <option value="Jawa Barat">Jawa Barat</option>
              <option value="Sumatera Selatan">Sumatera Selatan</option>
              <option value="Kalimantan Tengah">Kalimantan Tengah</option>
              <option value="Papua Pegunungan">Papua Pegunungan</option>
              <option value="Bali">Bali</option>
            </select>
          </div>

          {/* Condition Category Filter */}
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="bg-slate-950/70 border border-white/10 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-400"
          >
            <option value="ALL">Semua Kondisi PCI</option>
            <option value="GOOD">Kondisi Mantap (PCI &gt; 70)</option>
            <option value="MODERATE">Sedang (PCI 50 - 70)</option>
            <option value="LIGHT_DAMAGE">Rusak Ringan (PCI 35 - 50)</option>
            <option value="HEAVY_DAMAGE">Rusak Berat (PCI &lt; 35)</option>
          </select>

          {/* WIM Only Toggle & Dropdown Filter */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setShowWimOnly(!showWimOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                showWimOnly
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 border border-white/20'
                  : 'bg-slate-950/70 text-slate-300 border border-white/10 hover:bg-slate-800'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-cyan-300" />
              <span>Ada Stasiun WIM</span>
              {showWimOnly && (
                <span className="ml-1 px-1.5 py-0.2 text-[9.5px] bg-white/25 text-white rounded-full font-mono font-bold">
                  {filteredWimStations.length} Pin
                </span>
              )}
            </button>

            {/* Community Reports Pin Toggle */}
            <button
              onClick={() => setShowCommunityReports(!showCommunityReports)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                showCommunityReports
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 border border-white/20'
                  : 'bg-slate-950/70 text-slate-300 border border-white/10 hover:bg-slate-800'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-rose-300" />
              <span>Laporan Warga</span>
              {showCommunityReports && (
                <span className="ml-1 px-1.5 py-0.2 text-[9.5px] bg-white/25 text-white rounded-full font-mono font-bold">
                  {communityReports.length} Pin
                </span>
              )}
            </button>

            {/* Dropdown WIM Overload Category Filter */}
            {showWimOnly && (
              <select
                value={wimStatusFilter}
                onChange={(e) => setWimStatusFilter(e.target.value)}
                className="bg-slate-950/90 border border-rose-500/60 text-rose-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-rose-400 font-semibold shadow-xl transition-all animate-in fade-in duration-200 cursor-pointer"
              >
                <option value="ALL">Semua Stasiun WIM (100%)</option>
                <option value="EXTREME">🔴 Overload Ekstrim (&gt;100%)</option>
                <option value="HEAVY">🟣 Overload Berat (50 - 100%)</option>
                <option value="MODERATE">🟠 Overload Sedang (20 - 50%)</option>
                <option value="LIGHT">🟡 Overload Ringan (5 - 20%)</option>
                <option value="NONE">🟢 Tidak Overload (Normal)</option>
              </select>
            )}
          </div>
        </div>

        {/* Floating Quick Action CTA - ONLY for Official Roles */}
        {!isRegularUser && selectedSegment && (
          <div className="pointer-events-auto bg-slate-900/85 backdrop-blur-xl border border-white/15 p-2.5 rounded-2xl shadow-2xl flex items-center space-x-3">
            <div>
              <p className="text-[10px] uppercase font-mono font-bold text-indigo-300">
                Ruas Terpilih
              </p>
              <p className="text-xs font-bold text-white max-w-[160px] truncate">
                {selectedSegment.name}
              </p>
            </div>
            <button
              onClick={() => onLaunchSimulation(selectedSegment)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-lg shadow-indigo-600/30 border border-white/20 flex items-center space-x-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
              <span>Jalankan PINN</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Floating Stats & Legend Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none space-y-3">
        {/* BOTTOM STATS & LEGEND COLUMN */}
        <div className="pointer-events-auto max-w-7xl mx-auto bg-slate-900/85 backdrop-blur-xl border border-white/15 rounded-2xl p-3 shadow-2xl grid grid-cols-2 md:grid-cols-5 gap-2.5 text-slate-200 text-xs">
          {/* Stat 1 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-mono text-slate-400 uppercase truncate">
                Total Jaringan
              </p>
              <p className="text-xs font-extrabold text-white font-mono">
                {totalLengthKm} <span className="text-[10px] font-normal text-slate-400">km</span>
              </p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-mono text-slate-400 uppercase truncate">
                Tidak Mantap (PUPR 2025)
              </p>
              <p className="text-xs font-extrabold text-rose-400 font-mono">
                {damagedPercent}% <span className="text-[10px] font-normal text-slate-400">({damagedKm} km)</span>
              </p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-mono text-slate-400 uppercase truncate">
                Alert Red ODOL WIM
              </p>
              <p className="text-xs font-extrabold text-amber-300 font-mono">
                {activeRedAlertsCount} Ruas Kritis
              </p>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-mono text-slate-400 uppercase truncate">
                Rata-rata PCI
              </p>
              <p className="text-xs font-extrabold text-emerald-400 font-mono">
                {avgPci} / 100
              </p>
            </div>
          </div>

          {/* Map PCI Legend & WIM Overload Legend */}
          <div className="col-span-2 md:col-span-5 bg-white/5 border border-white/10 rounded-xl p-2.5 flex flex-col gap-2 text-[10px]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
              <div className="flex items-center space-x-3 text-[9.5px]">
                <span className="font-bold text-slate-300 uppercase font-mono border-r border-white/10 pr-2">
                  Legenda PCI:
                </span>
                <span className="flex items-center text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1" /> Mantap (&gt;70)
                </span>
                <span className="flex items-center text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1" /> Sedang (50-70)
                </span>
                <span className="flex items-center text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 mr-1" /> Rusak Ringan
                </span>
                <span className="flex items-center text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-1" /> Rusak Berat (&lt;35)
                </span>
              </div>

              <div className="flex items-center space-x-1.5 text-[9px] text-cyan-300 font-mono bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>⚡ Animasi Radius: Radius & Radar Berbanding Terbalik Dengan Nilai PCI (Semakin Rusak = Radius Makin Luas & Frekuensi Radar Lebih Cepat)</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center space-x-3 text-[9.5px]">
              <span className="font-extrabold text-cyan-300 font-mono flex items-center gap-1 border-r border-white/10 pr-2">
                <Truck className="w-3 h-3 text-cyan-400" /> WIM BINA MARGA (PUPR):
              </span>
              <span className="flex items-center text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1 shadow-sm shadow-emerald-500/50" />
                Tidak Overload
              </span>
              <span className="flex items-center text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 mr-1 shadow-sm shadow-yellow-400/50" />
                Overload Ringan (5-20%)
              </span>
              <span className="flex items-center text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 mr-1 shadow-sm shadow-orange-500/50" />
                Overload Sedang (20-50%)
              </span>
              <span className="flex items-center text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 mr-1 shadow-sm shadow-purple-500/50" />
                Overload Berat (&gt;50%)
              </span>
              <span className="flex items-center text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-1 shadow-sm shadow-red-500/50" />
                Overload Ekstrim (&gt;100%)
              </span>
            </div>

            <div className="flex flex-wrap items-center space-x-3 text-[9.5px] border-t border-white/10 pt-1.5 mt-0.5">
              <span className="font-extrabold text-rose-400 font-mono flex items-center gap-1 border-r border-white/10 pr-2">
                <Camera className="w-3 h-3 text-rose-400" /> LAPORAN WARGA (RADIUS DENYUT):
              </span>
              <span className="flex items-center text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-1 shadow-sm shadow-rose-500/50" />
                CRITICAL (3.8km, Denyut 0.8s)
              </span>
              <span className="flex items-center text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 mr-1 shadow-sm shadow-orange-500/50" />
                SEVERE (2.4km, Denyut 1.3s)
              </span>
              <span className="flex items-center text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mr-1 shadow-sm shadow-amber-400/50" />
                MODERATE (1.3km, Denyut 2.1s)
              </span>
              <span className="flex items-center text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1 shadow-sm shadow-blue-500/50" />
                LIGHT (0.7km, Denyut 3.4s)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* REPORT FORM MODAL INSIDE LEAFLETMAP */}
      {isReportFormOpen && (
        <div className="fixed inset-0 z-[1300] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 pointer-events-auto">
          <div className="bg-slate-900/95 border border-white/20 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-slate-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-indigo-500/20 text-cyan-300 rounded-2xl border border-indigo-500/30">
                  <Camera className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Formulir Pelaporan Kerusakan Jalan Komunitas
                  </h3>
                  <p className="text-xs text-slate-300">
                    Otomatis terhubung dengan stasiun WIM & simulasi regangan asphalt PINN
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsReportFormOpen(false)}
                className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Form Select Segment */}
              <div className="space-y-1">
                <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase">
                  1. Lokasi Ruas Jalan
                </label>
                <select
                  value={formSegmentId}
                  onChange={(e) => setFormSegmentId(e.target.value)}
                  className="w-full bg-slate-950/80 border border-white/15 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-400 font-semibold"
                >
                  {roadSegments.map((seg) => (
                    <option key={seg.id} value={seg.id}>
                      {seg.name} ({seg.province})
                    </option>
                  ))}
                </select>
              </div>

              {/* Damage Type & Severity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase">
                    2. Jenis Kerusakan Jalan
                  </label>
                  <select
                    value={formDamageType}
                    onChange={(e) => setFormDamageType(e.target.value as DamageType)}
                    className="w-full bg-slate-950/80 border border-white/15 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-400 font-semibold"
                  >
                    <option value="POTHOLE">Lubang Dalam (Pothole)</option>
                    <option value="RUTTING">Ambles & Deformasi Alur (Rutting)</option>
                    <option value="ALLIGATOR_CRACK">Retak Buaya (Alligator Cracking)</option>
                    <option value="CORRUGATION">Kerusakan Gelombang (Corrugation)</option>
                    <option value="SUBSIDENCE">Penurunan Pondasi (Subsidence)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase">
                    3. Tingkat Keparahan
                  </label>
                  <select
                    value={formSeverity}
                    onChange={(e) => setFormSeverity(e.target.value as ReportSeverity)}
                    className="w-full bg-slate-950/80 border border-white/15 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-400 font-semibold"
                  >
                    <option value="MODERATE">🟡 Sedang (Menghambat Laju)</option>
                    <option value="SEVERE">🟠 Parah (Berisiko Kecelakaan)</option>
                    <option value="CRITICAL">🔴 Sangat Kritis (Bahaya Tinggi Truk Overload)</option>
                  </select>
                </div>
              </div>

              {/* Estimated Depth & Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase">
                    4. Estimasi Kedalaman (cm)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formEstimatedDepth}
                    onChange={(e) => setFormEstimatedDepth(Number(e.target.value))}
                    className="w-full bg-slate-950/80 border border-white/15 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-400 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase">
                    5. Estimasi Luas Kerusakan (m²)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="100"
                    value={formEstimatedArea}
                    onChange={(e) => setFormEstimatedArea(Number(e.target.value))}
                    className="w-full bg-slate-950/80 border border-white/15 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-400 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Sample Photo Preset Selector */}
              <div className="space-y-1">
                <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase">
                  6. Foto Lampiran Lapangan
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=600',
                      label: 'Lubang Pothole'
                    },
                    {
                      url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&q=80&w=600',
                      label: 'Ambles & Rutting'
                    },
                    {
                      url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&q=80&w=600',
                      label: 'Retak Buaya'
                    }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormPhotoIndex(idx)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all h-20 ${
                        formPhotoIndex === idx
                          ? 'border-cyan-400 ring-2 ring-cyan-400/50'
                          : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[9px] text-white py-0.5 text-center font-bold">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase">
                  7. Deskripsi & Detail Kejadian
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Contoh: Lubang cukup dalam di lajur kiri. Sangat membahayakan pengendara motor & sering dilewati truk tronton berat."
                  className="w-full bg-slate-950/80 border border-white/15 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-400 placeholder:text-slate-500"
                />
              </div>

              {/* Auto WIM Correlation Box */}
              <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-2xl p-3 space-y-1">
                <div className="flex items-center space-x-2 text-cyan-300 font-extrabold text-[11px]">
                  <Truck className="w-4 h-4 text-cyan-400" />
                  <span>Korelasi Otomatis Sensor WIM Bina Marga:</span>
                </div>
                <p className="text-[10px] text-slate-300">
                  Stasiun WIM Terdekat: <strong className="text-white">{matchedWimStation.stationName}</strong> | Truk Terakhir:{' '}
                  <strong className="text-rose-300">{matchedWimStation.licensePlate} ({matchedWimStation.vehicleClass})</strong> | Overload:{' '}
                  <span className="text-amber-300 font-mono font-bold">+{matchedWimStation.overloadPercent}% ({matchedWimStation.maxAxleLoadTon} Ton)</span>
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsReportFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/30 border border-white/20 transition-all"
                >
                  <Send className="w-4 h-4 text-cyan-200" />
                  <span>Kirim Laporan Kerusakan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
