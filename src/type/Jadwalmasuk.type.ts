export type JadwalMasuk = {
  id: number;
  tahunajaran_id: number;
  ta: string;
  hari: string;
  guru_id: number;
  guru_name: string;
  start_time: string;
  end_time: string;
  toleransi_time: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  institution_id: number;
};

export const JadwalMasukDefault = {
  id: 0,
  tahunajaran_id: 0,
  ta: "",
  hari: "",
  guru_id: 0,
  guru_name: "",
  start_time: "",
  end_time: "",
  toleransi_time: 0,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: new Date(),
  institution_id: 0,
};
