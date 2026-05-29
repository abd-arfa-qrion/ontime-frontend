import AdminDashboardView from "@/components/view/admin/Dashboard";
import {
  Resume7Hari,
  Resume7HariPerbulan,
  Resume7HariTidakhadir,
  ResumeSiswa,
} from "@/type/Dashboard.type";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import dashboardServices from "../api/services/dashboard";
import { getTahunAjaranWithSemester } from "@/utils/tasemester";

const AdminPage = ({ setToaster }: any) => {
  const session: any = useSession();
  const [countSiswa, setCountSiswa] = useState(0);
  const [dataResume, setDataResume] = useState<ResumeSiswa[]>();
  const [dataResume7Hari, setDataResume7Hari] = useState<Resume7Hari[]>();
  const [dataResume7HariPerbulan, setDataResume7HariPerbulan] =
    useState<Resume7HariPerbulan[]>();
  const [dataResume7HariTidakhadir, setDataResume7HariTidakhadir] =
    useState<Resume7HariTidakhadir[]>();
  const [loadingFetch, setLoadingFetch] = useState(true);

  const [filterTA, setFilterTA] = useState(() => {
    return getTahunAjaranWithSemester().ta;
  });

  const getRekapAbsensi = async () => {
    try {
      const payload = {
        inst: session.data?.user?.instansiId,
      };
      const token = session.data?.accessToken;
      const req = await dashboardServices.getRekapAbsensi(payload, token);
      if (req.status !== 200 || req.data.status_code !== 200) {
        console.error("Gagal mengambil data resume absensi");
        return;
      }
      console.log("ini data resume absensi", req.data.data);
      setCountSiswa(req.data.data.countSiswa);
      setDataResume(req.data.data.dataResumeAbsensi);
    } catch (error) {
      console.error("Get data resume absensi error:", error);
      setToaster({
        variant: "error",
        message: "Gagal mengambil data resume absensi" + error,
      });
    }
  };
  const getResumeAbsen7Hari = async () => {
    try {
      const payload = {
        inst: session.data?.user?.instansiId,
      };
      const token = session.data?.accessToken;
      const req = await dashboardServices.getResume7Hari(payload, token);
      if (req.status !== 200 || req.data.status_code !== 200) {
        console.error("Gagal mengambil data resume absensi");
        return;
      }
      console.log("ini data resume absensi 7 Hari", req.data.data);

      setDataResume7Hari(req.data.data);
    } catch (error) {
      console.error("Get data resume absensi error:", error);
      setToaster({
        variant: "error",
        message: "Gagal mengambil data resume absensi" + error,
      });
    }
  };
  const getResumeAbsen7HariPerbulan = async () => {
    try {
      const payload = {
        inst: session.data?.user?.instansiId,
        tahunajaran: filterTA,
      };
      const token = session.data?.accessToken;
      const req = await dashboardServices.getResume7HariPerbulan(
        payload,
        token,
      );
      if (req.status !== 200 || req.data.status_code !== 200) {
        console.error("Gagal mengambil data resume absensi 7Hari Perbulan");
        return;
      }
      console.log("ini data resume absensi 7 Hari Perbulan", req.data.data);

      setDataResume7HariPerbulan(req.data.data);
    } catch (error) {
      console.error("Get data resume absensi error:", error);
      setToaster({
        variant: "error",
        message: "Gagal mengambil data resume absensi" + error,
      });
    }
  };
  const getResumeAbsen7HariTidakhadir = async () => {
    try {
      const payload = {
        inst: session.data?.user?.instansiId,
      };
      const token = session.data?.accessToken;
      const req = await dashboardServices.getResume7HariTidakhadir(
        payload,
        token,
      );
      if (req.status !== 200 || req.data.status_code !== 200) {
        console.error("Gagal mengambil data resume absensi tidak hadir");
        return;
      }
      console.log("ini data resume absensi 7 Hari tidak hadir", req.data.data);

      setDataResume7HariTidakhadir(req.data.data);
    } catch (error) {
      console.error("Get data resume absensi tidak hadir error:", error);
      setToaster({
        variant: "error",
        message: "Gagal mengambil data resume absensi tidak hadir" + error,
      });
    }
  };
  useEffect(() => {
    if (!session?.data?.accessToken) return;
    const loadData = async () => {
      setLoadingFetch(true);
      await getRekapAbsensi(); // tunggu selesai dulu
      await Promise.all([
        getResumeAbsen7Hari(),
        getResumeAbsen7HariTidakhadir(),
        getResumeAbsen7HariPerbulan(),
      ]); // setelah itu baru jalankan paralel

      setLoadingFetch(false);
    };

    if (session.status === "authenticated") {
      loadData();
    }
  }, [session.status]);
  return (
    <AdminDashboardView
      session={session}
      setToaster={setToaster}
      countSiswa={countSiswa}
      dataResume={dataResume ?? []}
      dataResume7Hari={dataResume7Hari ?? []}
      data={dataResume7HariPerbulan ?? []}
      dataResume7HariTidakhadir={dataResume7HariTidakhadir ?? []}
      loadingFetch={loadingFetch}
      filterTA={filterTA}
      setFilterTA={setFilterTA}
    />
  );
};

export default AdminPage;
