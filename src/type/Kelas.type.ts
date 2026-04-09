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
