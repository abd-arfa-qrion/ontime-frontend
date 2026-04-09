export type Pengumuman = {
  id: number;
  tahunajaran_id: number;
  ta: string;
  title: string;
  content: string;
  start_date: Date;
  end_date: Date;
  status_publish: string;
  target: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  institution_id: number;
  yayasan_id: number;
  position_id: number;
  user_id: number;
  user_name: string;
};

export const PengumumanDefault = {
  id: 0,
  tahunajaran_id: 0,
  ta: "",
  title: "",
  content: "",
  start_date: new Date(),
  end_date: new Date(),
  status_publish: "",
  target: "",
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: new Date(),
  institution_id: 0,
  yayasan_id: 0,
  position_id: 0,
  user_id: 0,
  user_name: "",
};
