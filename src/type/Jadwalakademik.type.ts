export type JadwalAkademik = {
  id: number;
  tahunajaran_id: number;
  ta: string;
  semester_id: number;
  semester_name: string;
  hari: string;
  kelas_id: number;
  kelas_name: string;
  mapel_id: number;
  mapel_name: string;
  guru_id: number;
  guru_name: string;
  start_time: string;
  end_time: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  institution_id: number;
};

export const JadwalAkademikDefault = {
  id: 0,
  tahunajaran_id: 0,
  ta: "",
  semester_id: 0,
  semester_name: "",
  hari: "",
  kelas_id: 0,
  kelas_name: "",
  mapel_id: 0,
  mapel_name: "",
  guru_id: 0,
  guru_name: "",
  start_time: "",
  end_time: "",
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: new Date(),
  institution_id: 0,
};
