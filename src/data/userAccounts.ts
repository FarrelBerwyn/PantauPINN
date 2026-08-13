import { UserRole } from '../types';

export interface UserAccount {
  id: string;
  name: string;
  title: string;
  role: UserRole;
  agency: string;
  agencyCode: string;
  email: string;
  nip: string;
  clearanceLevel: string;
  avatarUrl: string;
  allowedScopes: string[];
  restrictedScopes: string[];
}

export const USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'USR-001',
    name: 'Ir. Ahmad Subagyo, M.T.',
    title: 'Senior Pavement Civil Engineer',
    role: 'FIELD_ENGINEER',
    agency: 'Balai Besar Pelaksanaan Jalan Nasional (BBPJN DKI-Jabar)',
    agencyCode: 'BBPJN-PU',
    email: 'ahmad.subagyo@pu.go.id',
    nip: '19820415 200801 1 003',
    clearanceLevel: 'Level 3 - Spesialis Keteknikan Jalan',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    allowedScopes: [
      'Visualisasi Tensor Regangan Asphalt (εt & εv)',
      'Profil Basin Lendutan FWD (Falling Weight Deflectometer)',
      'Simulator Parameter Elastisitas Burmister (E1, Es)',
      'Kalkulator Tebal Lapisan Tambah (Overlay AC-WC)',
      'Diagnostik Loss Objective Function PINN (LPDE & LData)',
      'Data Publik: Peta Jalan & PCI Rata-rata'
    ],
    restrictedScopes: [
      'Streaming Kamera ANPR CCTV Plat Nomor (Khusus Kemenhub)',
      'Sistem Penilangan & Denda WIM (Khusus Operasional WIM)',
      'Proyeksi Alokasi Anggaran APBN 5 Tahun (Khusus Bappenas/PU)'
    ]
  },
  {
    id: 'USR-002',
    name: 'Drs. Hendra Gunawan, S.Si.',
    title: 'Kepala Bidang Operasional & Penindakan WIM',
    role: 'OPERATIONS_MANAGER',
    agency: 'Balai Pengelola Transportasi Darat (BPTD Wilayah VIII)',
    agencyCode: 'BPTD-HUB',
    email: 'hendra.gunawan@dephub.go.id',
    nip: '19791102 200502 1 001',
    clearanceLevel: 'Level 2 - Penyidik & Pengawas Operasional WIM',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    allowedScopes: [
      'Telemetry Real-Time Sensor Weigh-In-Motion (WIM) 24/7',
      'Peringatan Dini Alert Violasi Truk ODOL (>20 Ton)',
      'Kamera ANPR CCTV Plat Nomor & Tonase Beban As',
      'Tombol Penindakan: Transfer Muatan & Pengalihan Rute',
      'Rekapitulasi Sanksi Administratif & Denda Tilang',
      'Data Publik: Peta Jalan & PCI Rata-rata'
    ],
    restrictedScopes: [
      'Perhitungan Modulus Elastisitas Burmister (Khusus Field Eng.)',
      'Perumusan Kebijakan Pagu Anggaran APBN (Khusus Eksekutif)'
    ]
  },
  {
    id: 'USR-003',
    name: 'Dr. Ir. Retno Wulandari, M.Sc.',
    title: 'Direktur Ketahanan Perkerasan Jalan & Anggaran',
    role: 'POLICY_MAKER',
    agency: 'Direktorat Jenderal Bina Marga & Bappenas RI',
    agencyCode: 'DITJEN-BM',
    email: 'retno.wulandari@bappenas.go.id',
    nip: '19750318 199903 2 002',
    clearanceLevel: 'Level 1 - Otoritas Eksekutif & Pengambil Kebijakan APBN',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    allowedScopes: [
      'Proyeksi Anggaran Pemeliharaan Jalan 5 Tahun (Rp Miliar)',
      'Matriks Disparitas PCI Antar-Provinsi & Koridor Logistik',
      'Analisis Cost-Benefit & Penghematan Fiskal Zero ODOL 2027',
      'Laporan Naratif Eksekutif Otomatis Gemini GenAI',
      'Export Laporan Resmi Kebijakan Format PDF',
      'Data Publik: Peta Jalan & PCI Rata-rata'
    ],
    restrictedScopes: [
      'Kalibrasi Sensor FWD Lapangan (Khusus Field Eng.)',
      'Manual Override Sensor WIM Individual (Khusus Ops Manager)'
    ]
  },
  {
    id: 'USR-004',
    name: 'Budi Santoso, S.T.',
    title: 'Masyarakat Pelapor Kerusakan Jalan',
    role: 'PUBLIC_REPORTER',
    agency: 'Komunitas Pengguna Jalan & Angkutan Logistik',
    agencyCode: 'WARGA-LOGISTIK',
    email: 'budi.santoso@penggunajalan.or.id',
    nip: 'Pelapor Terverifikasi #4829',
    clearanceLevel: 'Level 4 - Pelapor Komunitas & Korelasi WIM',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    allowedScopes: [
      'Form Input Laporan Kerusakan Jalan (Foto, Kedalaman, Luas)',
      'Otomasisasi Analisis Korelasi Beban Truk ODOL WIM',
      'Akses Feed Laporan Komunitas & Peta Geospasial',
      'Dukungan (Upvote) & Monitoring Status Perbaikan Jalan',
      'Data Publik: Peta Jalan & PCI Rata-rata'
    ],
    restrictedScopes: [
      'Manual Calibration Sensor FWD (Khusus Field Engineer)',
      'Otorisasi Penindakan & Penilangan WIM (Khusus Operations Manager)',
      'Formulasi Pagu Anggaran APBN 5 Tahun (Khusus Policy Maker)'
    ]
  },
  {
    id: 'USR-005',
    name: 'Siti Aminah, S.E.',
    title: 'Pengamat Infrastruktur / Inspector Komunitas',
    role: 'PUBLIC_VIEWER',
    agency: 'Masyarakat Pengamat Trans-Jawa & Bappeda Komunitas',
    agencyCode: 'WARGA-INSPEKTOR',
    email: 'siti.aminah@pengamatjalan.id',
    nip: 'Pengamat Terdaftar #1024',
    clearanceLevel: 'Level 5 - Pengamat / Input Publik (Dapat Disesuaikan)',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    allowedScopes: [
      'Pengawasan Laporan Kerusakan Jalan & Analisis WIM',
      'Mode Tampilan Read-Only / Mode Input Aktif (Dapat Diubah)',
      'Visualisasi Peta Geospasial Laporan Komunitas',
      'Pencarian & Filtering Laporan Per Provinsi',
      'Data Publik: Peta Jalan & PCI Rata-rata'
    ],
    restrictedScopes: [
      'Kalibrasi Tensor PINN (Khusus Engineer)',
      'Penindakan Tilang Truk WIM (Khusus Kemenhub)'
    ]
  }
];
