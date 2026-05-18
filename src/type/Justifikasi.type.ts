export type Justifikasi = {
  id: number;
  student_name: string;
  class_id: number;
  class_name: string;
  waktu_absensi: Date;
  status_hadir: string;
  status_akhir: string;
  target: string;
};

export const JustifikasiDefault = {
  id: 0,
  student_name: "",
  class_id: 0,
  class_name: "",
  waktu_absensi: new Date(),
  status_hadir: "",
  status_akhir: "",
  target: "",
};
export type JustifikasiGuru = {
  teacher_id: number;
  teacher_name: string;
  teacher_nip: string;
  mapel_id: number;
  mapel_name: string;
  class_id: number;
  class_name: string;
  waktu_absensi: Date;
  status_hadir: string;
  status_akhir: string;
  target: string;
};

export const JustifikasiGuruDefault = {
  teacher_id: 0,
  teacher_name: "",
  teacher_nip: "",
  mapel_id: 0,
  mapel_name: "",
  class_id: 0,
  class_name: "",
  waktu_absensi: new Date(),
  status_hadir: "",
  status_akhir: "",
  target: "",
};
