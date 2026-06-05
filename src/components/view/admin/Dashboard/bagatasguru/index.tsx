import CardsSkeleton from "@/components/ui/skeleton/card";
import { ResumeGuru, ResumeSiswa } from "@/type/Dashboard.type";
import { Card } from "@mui/material";

type Proptype = {
  countGuru: number;
  dataResume: ResumeGuru[];
  loadingFetch: boolean;
};
const DashboardAtasGuru = (prop: Proptype) => {
  const { countGuru, dataResume, loadingFetch } = prop;
  const guruHadir = dataResume.filter(
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
          <Card className="p-3 w-full rounded-lg">
            <div className="header flex justify-left gap-4 items-center mb-4">
              <i className="bx bx-group text-blue-700 text-xl bg-gradient-to-b from-blue-300 to-blue-100 rounded-md px-3 py-1"></i>
              <p>Total Guru</p>
            </div>
            <div className="content text-sm">
              <p className="text-3xl font-semibold">{countGuru} Guru</p>
            </div>
            <div className="flex gap-2 items-center">
              <i className="bx bx-chart text-blue-500 text-sm"></i>
              <p className="text-xs text-gray-400 font-thin">
                Terdaftar pada tahun ajaran ini
              </p>
            </div>
          </Card>
          <Card className="p-3 w-full rounded-lg">
            <div className="header flex justify-left gap-4 items-center mb-4">
              <i className="bx bx-list-check text-green-700 text-xl bg-gradient-to-b from-green-300 to-green-100 rounded-md px-3 py-1"></i>
              <p>Total Guru Hadir</p>
            </div>
            <div className="content text-sm">
              <p className="text-3xl font-semibold">{guruHadir} Guru</p>
            </div>
            <div className="flex gap-2 items-center">
              <i className="bx bx-check-circle text-green-500 text-sm"></i>
              <p className="text-xs text-gray-400 font-thin">
                Guru hadir hari ini
              </p>
            </div>
          </Card>
          <Card className="p-3 w-full rounded-lg">
            <div className="header flex justify-left gap-4 items-center mb-4">
              <i className="bx bx-sad text-red-400 text-xl bg-gradient-to-b from-red-300 to-red-100 rounded-md px-3 py-1"></i>
              <p>Total Guru Tidak Hadir</p>
            </div>
            <div className="content text-sm">
              <p className="text-3xl font-semibold">{siswaTdkHadir} Guru</p>
            </div>
            <div className="flex gap-2 items-center">
              <i className="bx bx-note text-red-500 text-sm"></i>
              <p className="text-xs text-gray-400 font-thin">
                Guru tidak hadir hari ini
              </p>
            </div>
          </Card>
          <Card className="p-3 w-full rounded-lg">
            <div className="header flex justify-left gap-4 items-center mb-4">
              <i className="bx bx-info-circle text-yellow-700 text-xl bg-gradient-to-b from-yellow-300 to-yellow-100 rounded-md px-3 py-1"></i>
              <p>Perlu Justifikasi</p>
            </div>
            <div className="content text-sm">
              <p className="text-3xl font-semibold">{siswaJustifikasi} Guru</p>
            </div>
            <div className="flex gap-2 items-center">
              <i className="bx bx-info-square text-yellow-500 text-sm"></i>
              <p className="text-xs text-gray-400 font-thin">
                Perlu verifikasi data guru
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

export default DashboardAtasGuru;
