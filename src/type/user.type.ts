export type User = {
  id: number;
  nama: string;
  username: string;
  email: string;
  phone: string;
  password?: string;
  roleId: string;
  instansiId: number;
  karyawanId: number;
  status: string;
  timeSession: number;
  createdAt: number;
  updatedAt: number;
};
