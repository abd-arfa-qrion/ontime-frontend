export type RekapAbsensiSiswa = {
  bulan: string;
  jumlah: number;
  siswaHadir: number;
  siswaTidakHadir: number;
};

export const RekapAbsensiSiswaDefault = {
  bulan: "",
  jumlah: 0,
  siswaHadir: 0,
  siswaTidakHadir: 0,
};

export type ResumeSiswa = {
  studen_id: number;
  student_name: string;
  student_nis: string;
  class_id: number;
  status_hadir: string;
};

export const ResumeSiswaDefault = {
  student_id: 0,
  student_name: "",
  student_nis: "",
  class_id: 0,
  status_hadir: "",
};

export type Resume7Hari = {
  hari: string;
  tanggal: string;
  hadir: number;
  tidak_hadir: number;
};

export const Resume7HariDefault = {
  hari: "",
  tanggal: "",
  hadir: 0,
  tidak_hadir: 0,
};

export type Resume7HariTidakhadir = {
  keterangan: string;
  total: number;
  porsentase: number;
};

export const Resume7HariTidakhadirDefault = {
  keterangan: "",
  total: 0,
  porsentase: 0,
};

export type Resume7HariPerbulan = {
  bulan: string;
  total_siswa: number;
  hadir: number;
  persen_kehadiran: number;
  persen_tidak_hadir: number;
};

export const Resume7HariPerbulanDefault = {
  bulan: "",
  total_siswa: 0,
  hadir: 0,
  persen_kehadiran: 0,
  persen_tidak_hadir: 0,
};
