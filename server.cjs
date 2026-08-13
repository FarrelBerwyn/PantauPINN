var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");

// src/data/indonesianRoads.ts
var INDONESIAN_ROAD_SEGMENTS = [
  {
    id: "JLN-BINTARO-01",
    name: "Jl. Bintaro Utama 3 & Sektor 7 (Tangerang Selatan)",
    corridor: "Koridor Penghubung Bintaro Jaya - Jakarta Selatan",
    province: "Banten",
    kmPost: "KM 07+200",
    coordinates: [-6.2731, 106.7265],
    polyline: [
      [-6.265, 106.715],
      [-6.27, 106.721],
      [-6.2731, 106.7265],
      [-6.278, 106.732],
      [-6.282, 106.738]
    ],
    lengthKm: 8.5,
    currentPci: 42,
    conditionCategory: "LIGHT_DAMAGE",
    defaultCbrPercent: 4.8,
    defaultAsphaltThicknessCm: 14,
    defaultAxleLoadTon: 18.5,
    dailyTrafficVolumeLhr: 45200,
    heavyVehiclePercent: 28,
    hasWimStation: true,
    wimStationName: "Stasiun WIM Bintaro Utama Sektor 7",
    lastSurveyDate: "2026-08-10",
    activeOdolAlert: "RED",
    activeWimStatus: {
      lastOverloadWeightTon: 18.5,
      lastTruckPlate: "B 9182 NFD",
      timestamp: "5 min ago"
    },
    wimDetails: {
      stationId: "WIM-BINTARO-07",
      stationName: "Stasiun WIM Bintaro Utama Sektor 7",
      corridor: "Koridor Penghubung Bintaro Jaya - Jakarta Selatan",
      province: "Banten",
      coordinates: [-6.2731, 106.7265],
      licensePlate: "B 9182 NFD",
      vehicleClass: "Golongan 6A - Truk Material Beton 3 Sumbu",
      grossWeightTon: 34.5,
      maxAxleLoadTon: 18.5,
      legalLimitTon: 10,
      overloadPercent: 85,
      speedKmh: 45,
      fwdDeflectionMicron: 680,
      pinnDamageImpactIndex: 78,
      overlayRecommendationCm: 7.5,
      lastSyncTime: "5 menit lalu",
      alertSeverity: "RED"
    }
  },
  {
    id: "JLN-JAKARTA-02",
    name: "Jl. TB Simatupang - Fatmawati/Cilandak (Jakarta Selatan)",
    corridor: "Arteri Lingkar Luar Jakarta (TB Simatupang)",
    province: "DKI Jakarta",
    kmPost: "KM 12+400",
    coordinates: [-6.2915, 106.8234],
    polyline: [
      [-6.285, 106.81],
      [-6.289, 106.817],
      [-6.2915, 106.8234],
      [-6.295, 106.83],
      [-6.299, 106.838]
    ],
    lengthKm: 12,
    currentPci: 35,
    conditionCategory: "HEAVY_DAMAGE",
    defaultCbrPercent: 5,
    defaultAsphaltThicknessCm: 16,
    defaultAxleLoadTon: 21.2,
    dailyTrafficVolumeLhr: 78500,
    heavyVehiclePercent: 32,
    hasWimStation: true,
    wimStationName: "Stasiun WIM TB Simatupang Jakarta",
    lastSurveyDate: "2026-08-11",
    activeOdolAlert: "RED",
    activeWimStatus: {
      lastOverloadWeightTon: 21.2,
      lastTruckPlate: "B 9701 UYT",
      timestamp: "8 min ago"
    },
    wimDetails: {
      stationId: "WIM-JAKSEL-SIMATUPANG",
      stationName: "Stasiun WIM TB Simatupang Jakarta",
      corridor: "Arteri Lingkar Luar Jakarta (TB Simatupang)",
      province: "DKI Jakarta",
      coordinates: [-6.2915, 106.8234],
      licensePlate: "B 9701 UYT",
      vehicleClass: "Golongan 7B - Truk Kontainer 4 Sumbu",
      grossWeightTon: 42.8,
      maxAxleLoadTon: 21.2,
      legalLimitTon: 10,
      overloadPercent: 112,
      speedKmh: 52,
      fwdDeflectionMicron: 790,
      pinnDamageImpactIndex: 84,
      overlayRecommendationCm: 9,
      lastSyncTime: "8 menit lalu",
      alertSeverity: "RED"
    }
  },
  {
    id: "PANTURA-KM62",
    name: "Pantura KM 62+500 - Subang/Karawang",
    corridor: "Jalur Pantura Jawa (Arteri Primer)",
    province: "Jawa Barat",
    kmPost: "KM 62+500",
    coordinates: [-6.3262, 107.4475],
    polyline: [
      [-6.31, 107.38],
      [-6.32, 107.41],
      [-6.3262, 107.4475],
      [-6.335, 107.49],
      [-6.345, 107.54]
    ],
    lengthKm: 18.5,
    currentPci: 48,
    conditionCategory: "LIGHT_DAMAGE",
    defaultCbrPercent: 4.5,
    defaultAsphaltThicknessCm: 12,
    defaultAxleLoadTon: 18.5,
    dailyTrafficVolumeLhr: 38500,
    heavyVehiclePercent: 42,
    hasWimStation: true,
    wimStationName: "Pos WIM Jembatan Timbang Balonggandu",
    lastSurveyDate: "2026-07-15",
    activeOdolAlert: "RED",
    activeWimStatus: {
      lastOverloadWeightTon: 23.8,
      lastTruckPlate: "B 9482 UT",
      timestamp: "12 min ago"
    },
    wimDetails: {
      stationId: "WIM-JBR-01",
      stationName: "Pos WIM Jembatan Timbang Balonggandu",
      corridor: "Jalur Pantura Jawa (Arteri Primer)",
      province: "Jawa Barat",
      coordinates: [-6.3262, 107.4475],
      licensePlate: "B 9482 UT",
      vehicleClass: "Golongan 7B - Truk Gandengan 5 Sumbu",
      grossWeightTon: 48.2,
      maxAxleLoadTon: 23.8,
      legalLimitTon: 10,
      overloadPercent: 138,
      speedKmh: 58,
      fwdDeflectionMicron: 740,
      pinnDamageImpactIndex: 88,
      overlayRecommendationCm: 8.5,
      lastSyncTime: "12 menit lalu",
      alertSeverity: "RED"
    }
  },
  {
    id: "TRANS-JAVA-KM208",
    name: "Trans Java KM 208 - Palimanan",
    corridor: "Tol / Arteri Trans Jawa",
    province: "Jawa Barat",
    kmPost: "KM 208+000",
    coordinates: [-6.7135, 108.4328],
    polyline: [
      [-6.69, 108.38],
      [-6.705, 108.405],
      [-6.7135, 108.4328],
      [-6.725, 108.46],
      [-6.74, 108.5]
    ],
    lengthKm: 24,
    currentPci: 76,
    conditionCategory: "GOOD",
    defaultCbrPercent: 6,
    defaultAsphaltThicknessCm: 16,
    defaultAxleLoadTon: 14,
    dailyTrafficVolumeLhr: 52e3,
    heavyVehiclePercent: 35,
    hasWimStation: true,
    wimStationName: "Pos WIM Gerbang Tol Palimanan",
    lastSurveyDate: "2026-08-01",
    activeOdolAlert: "YELLOW",
    activeWimStatus: {
      lastOverloadWeightTon: 17.2,
      lastTruckPlate: "E 8831 AA",
      timestamp: "45 min ago"
    },
    wimDetails: {
      stationId: "WIM-JWA-02",
      stationName: "Pos WIM Gerbang Tol Palimanan",
      corridor: "Tol / Arteri Trans Jawa",
      province: "Jawa Barat",
      coordinates: [-6.7135, 108.4328],
      licensePlate: "E 8831 AA",
      vehicleClass: "Golongan 6B - Truk Tronton 3 Sumbu",
      grossWeightTon: 32.5,
      maxAxleLoadTon: 17.2,
      legalLimitTon: 10,
      overloadPercent: 72,
      speedKmh: 72,
      fwdDeflectionMicron: 420,
      pinnDamageImpactIndex: 45,
      overlayRecommendationCm: 4,
      lastSyncTime: "45 menit lalu",
      alertSeverity: "YELLOW"
    }
  },
  {
    id: "TRANS-SUMATRA-LINTAS-TIMUR",
    name: "Trans Sumatra Lintas Timur KM 114 - Betung",
    corridor: "Jalur Lintas Timur Sumatera",
    province: "Sumatera Selatan",
    kmPost: "KM 114+200",
    coordinates: [-2.7562, 104.2281],
    polyline: [
      [-2.72, 104.18],
      [-2.74, 104.205],
      [-2.7562, 104.2281],
      [-2.78, 104.26],
      [-2.81, 104.3]
    ],
    lengthKm: 32.4,
    currentPci: 38,
    conditionCategory: "HEAVY_DAMAGE",
    defaultCbrPercent: 3.2,
    defaultAsphaltThicknessCm: 10,
    defaultAxleLoadTon: 21,
    dailyTrafficVolumeLhr: 28400,
    heavyVehiclePercent: 54,
    hasWimStation: true,
    wimStationName: "Pos WIM BPTD Betung",
    lastSurveyDate: "2026-06-20",
    activeOdolAlert: "RED",
    activeWimStatus: {
      lastOverloadWeightTon: 24.6,
      lastTruckPlate: "BG 8291 RK",
      timestamp: "5 min ago"
    },
    wimDetails: {
      stationId: "WIM-SUM-02",
      stationName: "Pos WIM BPTD Betung",
      corridor: "Jalur Lintas Timur Sumatera",
      province: "Sumatera Selatan",
      coordinates: [-2.7562, 104.2281],
      licensePlate: "BG 8291 RK",
      vehicleClass: "Golongan 7C - Truk Container 6 Sumbu",
      grossWeightTon: 54,
      maxAxleLoadTon: 24.6,
      legalLimitTon: 10,
      overloadPercent: 146,
      speedKmh: 42,
      fwdDeflectionMicron: 810,
      pinnDamageImpactIndex: 94,
      overlayRecommendationCm: 10,
      lastSyncTime: "5 menit lalu",
      alertSeverity: "RED"
    }
  },
  {
    id: "TRANS-KALIMANTAN-PALANGKARAYA",
    name: "Trans Kalimantan KM 45 - Sampit",
    corridor: "Jalur Lintas Kalimantan Tengah",
    province: "Kalimantan Tengah",
    kmPost: "KM 45+100",
    coordinates: [-2.21, 113.91],
    polyline: [
      [-2.18, 113.86],
      [-2.195, 113.885],
      [-2.21, 113.91],
      [-2.23, 113.94],
      [-2.25, 113.98]
    ],
    lengthKm: 41,
    currentPci: 32,
    conditionCategory: "HEAVY_DAMAGE",
    defaultCbrPercent: 3.5,
    defaultAsphaltThicknessCm: 9,
    defaultAxleLoadTon: 22.5,
    dailyTrafficVolumeLhr: 16200,
    heavyVehiclePercent: 61,
    hasWimStation: true,
    wimStationName: "Pos Penimbangan Sampit",
    lastSurveyDate: "2026-07-02",
    activeOdolAlert: "RED",
    activeWimStatus: {
      lastOverloadWeightTon: 25,
      lastTruckPlate: "KH 8102 FA",
      timestamp: "1 hour ago"
    },
    wimDetails: {
      stationId: "WIM-KAL-01",
      stationName: "Pos Penimbangan Sampit",
      corridor: "Jalur Lintas Kalimantan Tengah",
      province: "Kalimantan Tengah",
      coordinates: [-2.21, 113.91],
      licensePlate: "KH 8102 FA",
      vehicleClass: "Golongan 7B - Truk Sawit/CPO ODOL",
      grossWeightTon: 51.5,
      maxAxleLoadTon: 25,
      legalLimitTon: 10,
      overloadPercent: 150,
      speedKmh: 40,
      fwdDeflectionMicron: 890,
      pinnDamageImpactIndex: 96,
      overlayRecommendationCm: 11,
      lastSyncTime: "1 jam lalu",
      alertSeverity: "RED"
    }
  },
  {
    id: "TRANS-PAPUA-WAMENA",
    name: "Trans Papua KM 88 - Jayawijaya",
    corridor: "Jalur Pegunungan Papua",
    province: "Papua Pegunungan",
    kmPost: "KM 88+000",
    coordinates: [-4.0935, 138.9482],
    polyline: [
      [-4.06, 138.91],
      [-4.08, 138.93],
      [-4.0935, 138.9482],
      [-4.115, 138.97],
      [-4.135, 139]
    ],
    lengthKm: 27.8,
    currentPci: 29,
    conditionCategory: "HEAVY_DAMAGE",
    defaultCbrPercent: 3,
    defaultAsphaltThicknessCm: 8,
    defaultAxleLoadTon: 16,
    dailyTrafficVolumeLhr: 8900,
    heavyVehiclePercent: 48,
    hasWimStation: false,
    lastSurveyDate: "2026-05-18",
    activeOdolAlert: "YELLOW"
  },
  {
    id: "BALI-DENPASAR-GILIMANUK",
    name: "Jalan Nasional Denpasar - Gilimanuk KM 42",
    corridor: "Arteri Lintas Bali West",
    province: "Bali",
    kmPost: "KM 42+300",
    coordinates: [-8.4981, 114.9521],
    polyline: [
      [-8.47, 114.92],
      [-8.485, 114.938],
      [-8.4981, 114.9521],
      [-8.51, 114.97],
      [-8.53, 114.99]
    ],
    lengthKm: 21.2,
    currentPci: 68,
    conditionCategory: "MODERATE",
    defaultCbrPercent: 5.5,
    defaultAsphaltThicknessCm: 14,
    defaultAxleLoadTon: 13.5,
    dailyTrafficVolumeLhr: 31e3,
    heavyVehiclePercent: 28,
    hasWimStation: true,
    wimStationName: "Pos Penimbangan Cekik Gilimanuk",
    lastSurveyDate: "2026-07-28",
    activeOdolAlert: "GREEN",
    activeWimStatus: {
      lastOverloadWeightTon: 11.8,
      lastTruckPlate: "DK 9012 B",
      timestamp: "2 hours ago"
    },
    wimDetails: {
      stationId: "WIM-BAL-01",
      stationName: "Pos Penimbangan Cekik Gilimanuk",
      corridor: "Arteri Lintas Bali West",
      province: "Bali",
      coordinates: [-8.4981, 114.9521],
      licensePlate: "DK 9012 B",
      vehicleClass: "Golongan 5B - Truk Engkel 2 Sumbu",
      grossWeightTon: 18.2,
      maxAxleLoadTon: 11.8,
      legalLimitTon: 10,
      overloadPercent: 18,
      overloadCategory: "LIGHT",
      speedKmh: 65,
      fwdDeflectionMicron: 310,
      pinnDamageImpactIndex: 22,
      overlayRecommendationCm: 2,
      lastSyncTime: "2 jam lalu",
      alertSeverity: "GREEN"
    }
  }
];

// src/utils/pinnEngine.ts
function runPinnSimulation(params, roadSegment) {
  const {
    axleLoadTon,
    rainIntensityMmHr,
    floodDurationHours,
    surfaceTemperatureC,
    subgradeCbrPercent,
    asphaltThicknessCm,
    asphaltModulusMpa,
    targetDevice,
    precisionMode
  } = params;
  const waterDecayFactor = Math.max(
    0.4,
    1 - rainIntensityMmHr * 4e-3 - floodDurationHours * 0.015
  );
  const effectiveCbr = subgradeCbrPercent * waterDecayFactor;
  const subgradeModulusMpa = 10 * effectiveCbr;
  const tempSofteningFactor = Math.max(
    0.5,
    1 - (surfaceTemperatureC - 25) * 0.012
  );
  const effectiveAsphaltModulusMpa = asphaltModulusMpa * tempSofteningFactor;
  const odolLoadFactor = Math.pow(axleLoadTon / 10, 4);
  const tensileStrainEt = Math.round(
    axleLoadTon * 120 / (Math.pow(asphaltThicknessCm, 1.75) * Math.pow(effectiveAsphaltModulusMpa / 2e3, 0.4))
  );
  const compressiveStrainEv = Math.round(
    axleLoadTon * 210 / (Math.pow(asphaltThicknessCm + 15, 1.4) * Math.pow(subgradeModulusMpa / 40, 0.75))
  );
  const maxDeflectionMicron = Math.round(
    axleLoadTon * 45 / (Math.pow(subgradeModulusMpa / 40, 0.6) * Math.pow(asphaltThicknessCm / 10, 0.5))
  );
  const stressTopMpa = Number((0.65 * (axleLoadTon / 10)).toFixed(2));
  const stressBottomMpa = Number((0.12 * (axleLoadTon / 10)).toFixed(2));
  const deflectionBasin = [0, 200, 400, 600, 900, 1200, 1500].map(
    (dist) => ({
      distanceMm: dist,
      deflectionMicron: Math.round(maxDeflectionMicron * Math.exp(-18e-4 * dist))
    })
  );
  const annualPciDrop = Math.min(
    35,
    Number((2.5 * odolLoadFactor * (1 / waterDecayFactor)).toFixed(1))
  );
  const predictedPci = Math.max(
    10,
    Math.round(roadSegment.currentPci - annualPciDrop * 0.8)
  );
  const pciDropPoints = Math.round(roadSegment.currentPci - predictedPci);
  const remainingYears = Math.max(
    0.3,
    Number((predictedPci / (annualPciDrop * 1.2)).toFixed(1))
  );
  const potholeHorizonDays = Math.max(
    3,
    Math.round(1800 / (odolLoadFactor * (1 / waterDecayFactor)))
  );
  const overlayThicknessCm = predictedPci < 70 ? Number(Math.max(4, (75 - predictedPci) * 0.22).toFixed(1)) : 0;
  const overlayType = overlayThicknessCm > 8 ? "AC-BC (Binder Course) + AC-WC (Wearing Course) Poly-Modified Asphalt" : overlayThicknessCm > 0 ? "AC-WC (Asphalt Concrete Wearing Course) Overlay" : "Routine Preventive Surface Seal / Crack Sealing";
  const fieldNotes = tensileStrainEt > 250 ? `KRITIS: Regangan tarik dasar aspal (${tensileStrainEt} \xB5\u03B5) melebihi batas ijin Bina Marga (200 \xB5\u03B5). Risiko retak lelah (fatigue cracking) sangat tinggi.` : tensileStrainEt > 180 ? `WASPADA: Regangan tarik dasar aspal (${tensileStrainEt} \xB5\u03B5) mendekati ambang lelah. Disarankan perkuatan struktur.` : `STABIL: Regangan tarik (${tensileStrainEt} \xB5\u03B5) dan tekan subgrade (${compressiveStrainEv} \xB5\u03B5) berada dalam batas elastis aman.`;
  let alertStatus = "GREEN";
  if (axleLoadTon > 18 || rainIntensityMmHr > 50 || predictedPci < 40) {
    alertStatus = "RED";
  } else if (axleLoadTon > 14 || rainIntensityMmHr > 25 || predictedPci < 60) {
    alertStatus = "YELLOW";
  }
  const maxAllowedDynamicTonnageTon = Number(
    Math.max(
      10,
      18 - rainIntensityMmHr * 0.08 - floodDurationHours * 0.2
    ).toFixed(1)
  );
  let wimActionRequired = "ALLOW";
  if (alertStatus === "RED") {
    wimActionRequired = axleLoadTon > 20 ? "TRANSFER_CARGO_AND_PENALIZE" : "REROUTE_MANDATORY";
  } else if (alertStatus === "YELLOW") {
    wimActionRequired = "INSPECT_AND_WEIGH";
  }
  const speedRestrictionKmh = alertStatus === "RED" ? 30 : alertStatus === "YELLOW" ? 50 : 70;
  const suggestedDetourCorridor = roadSegment.province === "Jawa Barat" ? "Tol Trans Jawa Koridor Alternatif Cipularang - Cikopo" : roadSegment.province === "Sumatera Selatan" ? "Jalur Alternatif Arteri Lintas Tengah" : "Jalur Lingkar Luar Khusus Kendaraan Berat";
  const operationalAlertSummary = alertStatus === "RED" ? `PERINGATAN BAHAYA ODOL: Beban sumbu ${axleLoadTon} Ton + hujan ${rainIntensityMmHr} mm/jam mempercepat kerusakan ${odolLoadFactor.toFixed(1)}x lipat. Wajib penindakan di WIM!` : alertStatus === "YELLOW" ? `MODERAT: Beban sumbu ${axleLoadTon} Ton melebihi batas standar (10 Ton). Tingkatkan pengawasan WIM.` : `OPERASIONAL AMAN: Beban sumbu dan kondisi cuaca berada dalam toleransi jalan.`;
  const baseYear = 2026;
  const pci5YearProjection = Array.from({ length: 6 }, (_, i) => {
    const yr = baseYear + i;
    const pciNoAct = Math.max(10, Math.round(predictedPci - i * annualPciDrop));
    const pciWithPreventive = Math.min(
      95,
      Math.round(predictedPci + i * 2.5 - (i > 0 ? 0 : 5))
    );
    return {
      year: yr,
      pciNoAction: pciNoAct,
      pciPreventiveAction: pciWithPreventive
    };
  });
  const estimatedEconomicLossRupiahBillions = Number(
    (0.85 * odolLoadFactor * (roadSegment.lengthKm / 10)).toFixed(1)
  );
  const preventiveCostSavingsRupiahBillions = Number(
    (estimatedEconomicLossRupiahBillions * 0.72).toFixed(1)
  );
  const zeroOdolTargetImpactPercent = Math.min(
    95,
    Math.round((1 - 1 / odolLoadFactor) * 100)
  );
  const executiveBrief = `Analisis PAVEMENT-PINN menunjukkan bahwa dengan menegakkan Zero ODOL 2027 dan melakukan preservasi preventif pada ${roadSegment.name}, pemerintah berpotensi menghemat anggaran pemeliharaan sebesar Rp ${preventiveCostSavingsRupiahBillions} Miliar dan memperpanjang umur layan jalan hingga ${remainingYears + 3.5} tahun.`;
  const deviceBaseLatency = targetDevice === "NPU" ? 6.5 : targetDevice === "iGPU" ? 12.8 : targetDevice === "MULTI" ? 8.1 : targetDevice === "AUTO" ? 7.2 : 24.5;
  const precisionMultiplier = precisionMode === "INT8_NNCF" ? 0.8 : precisionMode === "FP16" ? 1 : 1.4;
  const inferenceLatencyMs = Number(
    (deviceBaseLatency * precisionMultiplier + (Math.random() * 0.8 - 0.4)).toFixed(1)
  );
  const telemetry = {
    deviceUsed: targetDevice,
    precisionUsed: precisionMode,
    inferenceLatencyMs,
    powerConsumptionWatts: targetDevice === "NPU" ? 4.2 : targetDevice === "iGPU" ? 12.5 : targetDevice === "MULTI" ? 14.8 : targetDevice === "AUTO" ? 8.5 : 28,
    cpuUtilizationPercent: targetDevice === "CPU" ? 68 : targetDevice === "AUTO" ? 22 : 14,
    npuUtilizationPercent: targetDevice === "NPU" ? 82 : targetDevice === "MULTI" ? 65 : targetDevice === "AUTO" ? 74 : 0,
    throughputSps: Math.round(1e3 / inferenceLatencyMs),
    physicsLossValue: Number((18e-4 + Math.random() * 6e-4).toFixed(5)),
    dataLossValue: Number((11e-4 + Math.random() * 4e-4).toFixed(5))
  };
  const tensors = {
    tensileStrainEt,
    compressiveStrainEv,
    surfaceDeflectionMaxMicron: maxDeflectionMicron,
    stressTopMpa,
    stressBottomMpa
  };
  const roleOutputs = {
    fieldEngineer: {
      recommendedOverlayThicknessCm: overlayThicknessCm,
      recommendedOverlayType: overlayType,
      potholeHorizonDays,
      deflectionBasin,
      structuralPriorityRank: predictedPci < 40 ? 1 : predictedPci < 60 ? 2 : 3,
      engineeringNotes: fieldNotes
    },
    operationsManager: {
      alertStatus,
      maxAllowedDynamicTonnageTon,
      wimActionRequired,
      speedRestrictionKmh,
      suggestedDetourCorridor,
      operationalAlertSummary
    },
    policyMaker: {
      pci5YearProjection,
      estimatedEconomicLossRupiahBillions,
      preventiveCostSavingsRupiahBillions,
      zeroOdolTargetImpactPercent,
      executiveBrief
    }
  };
  const aiNarrative = {
    fieldEngineerNarrative: `[ANALISIS REKAYASA STRUKTURAL BBPJN]
Simulasi PINN mendeteksi tegangan tarik dasar aspal $\\epsilon_t$ sebesar ${tensileStrainEt} \xB5\u03B5 dan regangan tekan tanah dasar $\\epsilon_v$ sebesar ${compressiveStrainEv} \xB5\u03B5 pada CBR ${effectiveCbr.toFixed(1)}%. Laju deteriorasi eksponensial akibat Hukum Pangkat Empat (${odolLoadFactor.toFixed(1)}x) memproyeksikan pembentukan retak lelah dalam ${potholeHorizonDays} hari. Rekomendasi perbaikan: Tebal overlay ${overlayThicknessCm} cm (${overlayType}).`,
    operationsNarrative: `[SINYAL OPERASIONAL WIM KEMENHUB / BPTD]
STATUS: ${alertStatus}. Kendaraan ODOL dengan beban sumbu ${axleLoadTon} Ton melintas pada kondisi curah hujan ${rainIntensityMmHr} mm/jam. Batas aman tonase dinamis saat ini adalah ${maxAllowedDynamicTonnageTon} Ton. Tindakan langsung: ${wimActionRequired} dan berlakukan pembatasan kecepatan ${speedRestrictionKmh} km/jam.`,
    policyMakerNarrative: `[RINGKASAN EKSEKUTIF KEBIJAKAN PRESERVASI]
Inisiasi kebijakan Zero ODOL pada ruas ${roadSegment.name} akan mencegah potensi kerugian ekonomi sebesar Rp ${estimatedEconomicLossRupiahBillions} Miliar. Tanpa intervensi, PCI diproyeksikan turun dari ${roadSegment.currentPci} menjadi ${pci5YearProjection[5].pciNoAction} dalam 5 tahun. Penghematan netto pemeliharaan preventif diperkirakan mencapai Rp ${preventiveCostSavingsRupiahBillions} Miliar.`
  };
  return {
    id: `SIM-${Date.now()}`,
    timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    params,
    roadSegment,
    predictedPci,
    pciDropPoints,
    pavementLifeRemainingYears: remainingYears,
    tensors,
    roleOutputs,
    telemetry,
    aiNarrative
  };
}

// server.ts
var aiClient = null;
function getGeminiClient() {
  if (!aiClient && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") {
    try {
      aiClient = new import_genai.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.warn("Failed to initialize Gemini AI client:", err);
    }
  }
  return aiClient;
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", appName: "PAVEMENT-PINN", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.get("/api/roads", (_req, res) => {
    res.json(INDONESIAN_ROAD_SEGMENTS);
  });
  app.post("/api/simulate", (req, res) => {
    try {
      const params = req.body.params;
      const segmentId = params.segmentId || "PANTURA-KM62";
      const roadSegment = INDONESIAN_ROAD_SEGMENTS.find((r) => r.id === segmentId) || INDONESIAN_ROAD_SEGMENTS[0];
      const result = runPinnSimulation(params, roadSegment);
      res.json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message || "Simulation error" });
    }
  });
  app.get("/api/openvino/export-ir", (req, res) => {
    const device = req.query.device || "NPU";
    const precision = req.query.precision || "INT8_NNCF";
    const xmlContent = `<?xml version="1.0"?>
<net name="Pavement_PINN_Degradation_Model" version="11">
  <layers>
    <layer id="0" name="input_tensors" type="Parameter" version="opset1">
      <data element_type="f32" shape="1, 7"/>
      <output>
        <port id="0" precision="FP32" names="axle_load,rain_mm,flood_hrs,temp_c,cbr_pct,thickness_cm,modulus_mpa"/>
      </output>
    </layer>
    <layer id="1" name="pinn_dense_1" type="MatMul" version="opset1">
      <data transpose_a="false" transpose_b="false"/>
      <input><port id="0" precision="FP32"/></input>
      <output><port id="1" precision="FP32"/></output>
    </layer>
    <layer id="2" name="physics_pde_constraint" type="PhysicsPDEOp" version="custom">
      <data pde_equation="Burmister_Multilayer_Elasticity_4th_Power_ODOL"/>
    </layer>
    <layer id="3" name="output_tensors" type="Result" version="opset1">
      <data element_type="f32"/>
      <input><port id="0" precision="FP32" names="tensile_strain,compressive_strain,deflection,pci_drop"/></input>
    </layer>
  </layers>
  <edges>
    <edge from-layer="0" from-port="0" to-layer="1" to-port="0"/>
    <edge from-layer="1" from-port="1" to-layer="2" to-port="0"/>
    <edge from-layer="2" from-port="0" to-layer="3" to-port="0"/>
  </edges>
</net>`;
    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Content-Disposition", `attachment; filename="pavement_pinn_${device.toLowerCase()}_${precision.toLowerCase()}.xml"`);
    res.send(xmlContent);
  });
  app.get("/api/openvino/export-config", (req, res) => {
    const device = req.query.device || "NPU";
    const precision = req.query.precision || "INT8_NNCF";
    const streams = req.query.streams || "2";
    const configJson = {
      model_name: "Pavement_PINN_Burmister_PDE",
      openvino_version: "2024.5.0",
      target_device: device,
      precision_mode: precision,
      nncf_quantization: {
        enabled: precision === "INT8_NNCF",
        algorithm: "DefaultQuantization",
        preset: "PERFORMANCE",
        target_stat_precision: "INT8"
      },
      performance_config: {
        PERFORMANCE_HINT: "LATENCY",
        NUM_STREAMS: streams,
        INFERENCE_NUM_THREADS: 8,
        ENABLE_MMAP: true
      },
      deployment_code_sample: {
        cpp: `ov::Core core;
auto model = core.read_model("pavement_pinn_${device.toLowerCase()}_${precision.toLowerCase()}.xml");
auto compiled_model = core.compile_model(model, "${device}");
auto infer_request = compiled_model.create_infer_request();`,
        python: `import openvino as ov
core = ov.Core()
model = core.read_model("pavement_pinn_${device.toLowerCase()}_${precision.toLowerCase()}.xml")
compiled = core.compile_model(model, "${device}")
res = compiled({"input_tensors": [18.5, 45, 6, 42, 4.5, 12, 2400]})`
      }
    };
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="openvino_config_${device.toLowerCase()}.json"`);
    res.send(JSON.stringify(configJson, null, 2));
  });
  app.post("/api/generate-narrative", async (req, res) => {
    const { role, simulationData } = req.body;
    const ai = getGeminiClient();
    const getFallbackNarrative = () => {
      if (role === "FIELD_ENGINEER") {
        return simulationData?.aiNarrative?.fieldEngineerNarrative || `[ANALISIS REKAYASA STRUKTURAL BBPJN]
Simulasi PINN mendeteksi regangan tarik dasar aspal \u03B5t sebesar ${simulationData?.tensors?.tensileStrainEt || 180} \xB5\u03B5 dan regangan tekan tanah dasar \u03B5v sebesar ${simulationData?.tensors?.compressiveStrainEv || 320} \xB5\u03B5. Laju deteriorasi akibat beban ODOL memproyeksikan pembentukan retak lelah. Rekomendasi perbaikan: Tebal overlay ${simulationData?.roleOutputs?.fieldEngineer?.recommendedOverlayThicknessCm || 6} cm AC-WC.`;
      }
      if (role === "OPERATIONS_MANAGER") {
        return simulationData?.aiNarrative?.operationsNarrative || `[EVALUASI OPERASIONAL WIM & BPTD]
Beban sumbu kendaraan ${simulationData?.params?.axleLoadTon || 18} Ton terdeteksi melampaui ambang batas izin (10 Ton). Tingkat akselerasi kerusakan perkerasan jalan mencapai level kritis. Sinyal WIM mengaktifkan prosedur penindakan tilang otomatis ANPR dan instruksi pengalihan rute truk.`;
      }
      return simulationData?.aiNarrative?.policyMakerNarrative || `[RINGKASAN KEBIJAKAN PRESERVASI EKSEKUTIF]
Implementasi program preservasi jalan preventif dan penegakan Zero ODOL 2027 diproyeksikan memberikan efisiensi anggaran APBN sebesar Rp ${simulationData?.roleOutputs?.policyMaker?.preventiveCostSavingsRupiahBillions || 38.5} Miliar serta mempertahankan Indeks Kondisi Jalan (PCI) pada tingkat Mantap.`;
    };
    if (!ai) {
      return res.json({
        success: true,
        narrative: getFallbackNarrative(),
        source: "rule-engine-offline"
      });
    }
    try {
      const prompt = `Anda adalah Asisten Kecerdasan Buatan PAVEMENT-PINN (Physics-Informed Neural Network + Intel OpenVINO Edge AI) untuk pengelolaan infrastruktur jalan nasional Indonesia.

Berikan analisis dan rekomendasi yang sangat ringkas, profesional, dan dapat ditindaklanjuti (actionable) khusus untuk peran: ${role}.

Data Hasil Simulasi:
- Ruas Jalan: ${simulationData?.roadSegment?.name} (${simulationData?.roadSegment?.province})
- Beban Sumbu: ${simulationData?.params?.axleLoadTon} Ton (Batas ODOL: 10 Ton)
- Intensitas Hujan: ${simulationData?.params?.rainIntensityMmHr} mm/jam
- Subgrade CBR: ${simulationData?.params?.subgradeCbrPercent}%
- Prediksi PCI: ${simulationData?.predictedPci}/100
- Regangan Tarik dasar Aspal (\u03B5t): ${simulationData?.tensors?.tensileStrainEt} \xB5\u03B5
- Tegangan Tekan Subgrade (\u03B5v): ${simulationData?.tensors?.compressiveStrainEv} \xB5\u03B5
- Estimasi Hari Pembentukan Lubang: ${simulationData?.roleOutputs?.fieldEngineer?.potholeHorizonDays} hari
- Rekomendasi Overlay: ${simulationData?.roleOutputs?.fieldEngineer?.recommendedOverlayThicknessCm} cm
- Status Alert WIM: ${simulationData?.roleOutputs?.operationsManager?.alertStatus}
- Tindakan Penindakan WIM: ${simulationData?.roleOutputs?.operationsManager?.wimActionRequired}
- Potensi Penghematan Anggaran Preservasi: Rp ${simulationData?.roleOutputs?.policyMaker?.preventiveCostSavingsRupiahBillions} Miliar

Instruksi Format:
- Untuk FIELD_ENGINEER: Fokus pada kriteria rekayasa struktur, regangan kritis, dan spesifikasi tebal overlay.
- Untuk OPERATIONS_MANAGER: Fokus pada sinyal operasional WIM, keselamatan lalu lintas, dan penindakan ODOL.
- Untuk POLICY_MAKER: Fokus pada efisiensi anggaran APBN, dampak ekonomi, dan Zero ODOL 2027.
- Panjang jawaban 3-4 kalimat padat.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt
      });
      res.json({
        success: true,
        narrative: response.text || getFallbackNarrative(),
        source: "gemini-3.6-flash"
      });
    } catch (err) {
      console.warn("Gemini API call failed (using fallback narrative):", err?.message || err);
      res.json({
        success: true,
        narrative: getFallbackNarrative(),
        source: "rule-engine-fallback"
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PAVEMENT-PINN Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
