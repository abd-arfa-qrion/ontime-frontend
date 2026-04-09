export type TargetAbsensi = {
  id: number;
  name: string;
};

export type MethodeAbsensi = {
  id: number;
  name: string;
};

export type JadwalUmum = {
  id: number;
  tahunajaran_id: number;
  absensi_name: string;

  tgl_mulai: string;
  tgl_selesai: string;

  start_time: string;
  end_time: string;

  methodes_absensi: MethodeAbsensi[];
  targets_absensi: TargetAbsensi[];

  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  institution_id: number;
};

export const JadwalUmumDefault: JadwalUmum = {
  id: 0,
  tahunajaran_id: 0,
  absensi_name: "",

  tgl_mulai: "",
  tgl_selesai: "",

  start_time: "",
  end_time: "",

  methodes_absensi: [],
  targets_absensi: [],

  created_at: "",
  updated_at: "",
  deleted_at: null,

  institution_id: 0,
};
