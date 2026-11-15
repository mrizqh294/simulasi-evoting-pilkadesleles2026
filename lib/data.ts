export type Candidate = { id: number; name: string; photoUrl?: string };

// Foto diambil dari public/kandidat/1.jpg ... 5.jpg. Jika file belum ada, otomatis tampil siluet placeholder.
// Ingin nama file/ekstensi lain (png, webp)? Ubah photoUrl di sini.
export const CANDIDATES: Candidate[] = [
  { id: 1, name: "SARYUM S.PD, MM", photoUrl: "/kandidat/1.png" },
  { id: 2, name: "RIYAN KEMAL, S.T", photoUrl: "/kandidat/2.png" },
  { id: 3, name: "A ADITYA J.P, S.AN", photoUrl: "/kandidat/3.jpg" },
  { id: 4, name: "ADE RIA, S.PD", photoUrl: "/kandidat/4.jpg" },
  { id: 5, name: "ANGGA DESTIANO, S.PD", photoUrl: "/kandidat/5.png" },
];

export const SUBTITLE = [
  "PEMILIHAN KEPALA DESA LELES",
  "KECAMATAN SAGALAHERANG KABUPATEN SUBANG",
  "TAHUN 2026",
];

export const LOGO_URL = "/logo.png";

export const VALID_NIKS: string[] = [
  "3215010101900001", "3215010202910002", "3215010303920003", "3215010404930004", "3215010505940005",
  "3215010606950006", "3215010707960007", "3215010808970008", "3215010909980009", "3215011010990010",
];
