export type LaporanAbsensiUmum = {
  id: number;
  nip: string;
};

export const LaporanAbsensiUmumDefault = {
  id: 0,
  nip: "",
};

export type LapAbsensiMasukGuru = {
  id: string;
  guru_id: number;
  guru_name: string;
  guru_nip: string;
  tanggal: Date;
  checkin_time: Date;
  checkout_time: Date;
  status_hadir: string;
  keterangan: string;
};

export const LapAbsensiMasukGuruDefault = {
  id: "",
  guru_id: 0,
  guru_name: "",
  guru_nip: "",
  tanggal: new Date(),
  checkin_time: new Date(),
  checkout_time: new Date(),
  status_hadir: "",
  keterangan: "",
};

export type LaporanAbsensiAkademik = {
  id: number;
  nip: string;
};

export const LaporanAbsensiAkademikDefault = {
  id: 0,
  nip: "",
};
