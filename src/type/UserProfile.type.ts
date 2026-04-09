export type UserProfile = {
  id: string;
  nama: string;
  email: string;
  username: string;
  phone: string;
  role_id: string;
  instansi_id: string;
  karyawan_id: string;
  // per_id: number,
  created_at: number;
  updated_at: number;
  status: string;
};
export const UserProfileDefault = {
  id: "",
  nama: "",
  email: "",
  username: "",
  phone: "",
  role_id: "",
  instansi_id: "",
  karyawan_id: "",
  // per_id: 0,
  created_at: 0,
  updated_at: 0,
  status: "",
};
