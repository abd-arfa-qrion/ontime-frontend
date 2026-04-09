export type Guru = {
  id: number;
  nip: string;
  name: string;
  gender: string;
  isTeacher: boolean;
  plsceOfBirth: string;
  dateOfBirth: Date;
  religion: string;
  phone: string;
  fullAddress: string;
  district: string;
  city: string;
  province: string;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  institutionId: number;
  yayasanId: number;
  positionId: number;
  userId: number;
};

export const GuruDefault = {
  id: 0,
  nip: "",
  name: "",
  gender: "",
  isTeacher: false,
  plsceOfBirth: "",
  dateOfBirth: new Date(),
  religion: "",
  phone: "",
  fullAddress: "",
  district: "",
  city: "",
  province: "",
  uuid: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date(),
  institutionId: 0,
  yayasanId: 0,
  positionId: 0,
  userId: 0,
};
