export type PiketGuru = {
  id: number;
  tahunajaran_id: number;
  ta: string;
  hari: string;
  guru_id: number;
  guru_name: string;
  guru_nip: string;
  createdAt: Date;
  updatedAt: Date;
  institutionId: number;
};

export const PiketGuruDefault = {
  id: 0,
  tahunajaran_id: 0,
  ta: "",
  hari: "",
  guru_id: 0,
  guru_name: "",
  guru_nip: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  institutionId: 0,
};
