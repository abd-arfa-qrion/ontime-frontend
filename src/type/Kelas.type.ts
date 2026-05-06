export type Kelas = {
  id: number;
  code: string;
  name: string;
  level: number;
  createdAt: Date;
  updatedAt: Date;
  statusId: string;
  institutionId: number;
  yayasanId: number;
};

export const KelasDefault = {
  id: 0,
  code: "",
  name: "",
  level: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  statusId: "",
  institutionId: 0,
  yayasanId: 0,
};

export type MonitoringKelas = {
  id: number;
  tahunajaran_id: number;
  tahunajaran: string;
  semester_id: number;
  semester_name: string;
  absensi_name: string;
  type: string;
  hari: string;
  kelas_id: number;
  kelas_name: string;
  mapel_id: number;
  mapel_name: string;
  guru_id: number;
  guru_name: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  institution_id: number;
};

export const MonitoringKelasDefault = {
  id: 0,
  tahunajaran_id: 0,
  tahunajaran: "",
  semester_id: 0,
  semester_name: "",
  absensi_name: "",
  type: "",
  hari: "",
  kelas_id: 0,
  kelas_name: "",
  mapel_id: 0,
  mapel_name: "",
  guru_id: 0,
  guru_name: "",
  start_time: "",
  end_time: "",
  created_at: "",
  updated_at: "",
  deleted_at: "",
  institution_id: 0,
};
