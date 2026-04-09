export type Instansi = {
  id: string;
  kodeInstansi: string;
  perusahaanId: number;
  name: string;
  alamat: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  perusahaan: {
    id: number;
    kodePer: string;
    name: string;
    alamat: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
  };
};
