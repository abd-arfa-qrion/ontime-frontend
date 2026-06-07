import { Label } from "recharts";
export type Kaldik = {
  id: number;
  tahunajaran_id: number;
  ta: string;
  keterangan: string;
  code: string;
  tgl_awal: Date;
  tgl_akhir: Date;
  start_time: string;
  end_time: string;
  label: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  institution_id: number;
};

export const KaldikDefault = {
  id: 0,
  tahunajaran_id: 0,
  ta: "",
  keterangan: "",
  code: "",
  tgl_awal: new Date(),
  tgl_akhir: new Date(),
  start_time: "",
  end_time: "",
  label: "",
  created_at: "",
  updated_at: "",
  deleted_at: "",
  institution_id: 0,
};

export type CalendarEvent = {
  id: number;
  keterangan: string;
  code: string;
  tgl_awal: string;
  tgl_akhir: string;
  label: string;
};
export const CalendarEventDefault = {
  id: 0,
  keterangan: "",
  code: "",
  tgl_awal: "",
  tgl_akhir: "",
  label: "",
};
