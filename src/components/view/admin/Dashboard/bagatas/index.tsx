import CardsSkeleton from "@/components/ui/skeleton/card";
import { ResumeSiswa } from "@/type/Dashboard.type";
import { Card } from "@mui/material";

type Proptype = {
  countSiswa: number;
  dataResume: ResumeSiswa[];
  loadingFetch: boolean;
};
const DashboardAtas = (prop: Proptype) => {
  const { countSiswa, dataResume, loadingFetch } = prop;
  const siswaHadir = dataResume.filter(
    (item) => item.status_hadir === "hadir",
  ).length;
  const siswaTdkHadir = dataResume.filter(
    (item) =>
      item.status_hadir !== "hadir" && item.status_hadir !== "belum absen",
  ).length;
  const siswaJustifikasi = dataResume.filter(
    (item) => item.status_hadir === "alpa",
  ).length;
  return (
    <div>
      {!loadingFetch ? (
        <div className="flex gap-5 flex-wrap grid grid-cols-4">
          <Card className="p-3 w-full rounded-lg shadow-none">
            <div className="header flex justify-left gap-4 items-center mb-4">
              <i className="bx bx-group text-blue-700 text-xl bg-gradient-to-b from-blue-300 to-blue-100 rounded-md px-3 py-1"></i>
              <p>Total Siswa Aktif</p>
            </div>
            <div className="content text-sm">
              <p className="text-3xl font-semibold">{countSiswa} Siswa</p>
            </div>
            <div className="flex gap-2 items-center">
              <i className="bx bx-chart text-blue-500 text-sm"></i>
              <p className="text-xs text-gray-400 font-thin">
                Terdaftar pada tahun ajaran ini
              </p>
            </div>
          </Card>
          <Card className="p-3 w-full rounded-lg shadow-none">
            <div className="header flex justify-left gap-4 items-center mb-4">
              <i className="bx bx-list-check text-green-700 text-xl bg-gradient-to-b from-green-300 to-green-100 rounded-md px-3 py-1"></i>
              <p>Total Siswa Hadir</p>
            </div>
            <div className="content text-sm">
              <p className="text-3xl font-semibold">{siswaHadir} Siswa</p>
            </div>
            <div className="flex gap-2 items-center">
              <i className="bx bx-check-circle text-green-500 text-sm"></i>
              <p className="text-xs text-gray-400 font-thin">
                Siswa hadir hari ini
              </p>
            </div>
          </Card>
          <Card className="p-3 w-full rounded-lg shadow-none">
            <div className="header flex justify-left gap-4 items-center mb-4">
              <i className="bx bx-sad text-red-400 text-xl bg-gradient-to-b from-red-300 to-red-100 rounded-md px-3 py-1"></i>
              <p>Total Siswa Tidak Hadir</p>
            </div>
            <div className="content text-sm">
              <p className="text-3xl font-semibold">{siswaTdkHadir} Siswa</p>
            </div>
            <div className="flex gap-2 items-center">
              <i className="bx bx-note text-red-500 text-sm"></i>
              <p className="text-xs text-gray-400 font-thin">
                Siswa tidak hadir hari ini
              </p>
            </div>
          </Card>
          <Card className="p-3 w-full rounded-lg shadow-none">
            <div className="header flex justify-left gap-4 items-center mb-4">
              <i className="bx bx-info-circle text-yellow-700 text-xl bg-gradient-to-b from-yellow-300 to-yellow-100 rounded-md px-3 py-1"></i>
              <p>Perlu Justifikasi</p>
            </div>
            <div className="content text-sm">
              <p className="text-3xl font-semibold">{siswaJustifikasi} Siswa</p>
            </div>
            <div className="flex gap-2 items-center">
              <i className="bx bx-info-square text-yellow-500 text-sm"></i>
              <p className="text-xs text-gray-400 font-thin">
                Perlu verifikasi data siswa
              </p>
            </div>
          </Card>
        </div>
      ) : (
        <CardsSkeleton columns={4} rows={1} />
      )}
    </div>
  );
};

export default DashboardAtas;
