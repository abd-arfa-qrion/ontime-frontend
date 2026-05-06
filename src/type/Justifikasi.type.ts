export type Justifikasi = {
  id: number;
  nama_siswa: string;
  kelas_id: number;
  nama_kelas: string;
  tgl: Date;
  status_awal: string;
  status_akhir: string;
};

export const JustifikasiDefault = {
  id: 0,
  nama_siswa: "",
  kelas_id: 0,
  nama_kelas: "",
  tgl: new Date(),
  status_awal: "",
  status_akhir: "",
};
