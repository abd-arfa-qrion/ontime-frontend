import AdminDashboardView from "@/components/view/admin/Dashboard";
import {
  Resume7Hari,
  Resume7HariGuru,
  Resume7HariPerbulan,
  Resume7HariPerbulanGuru,
  Resume7HariTidakhadir,
  Resume7HariTidakhadirGuru,
  ResumeGuru,
  ResumeSiswa,
} from "@/type/Dashboard.type";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import dashboardServices from "../api/services/dashboard";
import { getTahunAjaranWithSemester } from "@/utils/tasemester";
import { useTahunAjaranStore } from "@/store/tahunAjaranStore";

const AdminPage = ({ setToaster }: any) => {
  const session: any = useSession();
  // data siswa
  const [countSiswa, setCountSiswa] = useState(0);
  const [dataResume, setDataResume] = useState<ResumeSiswa[]>();
  const [dataResume7Hari, setDataResume7Hari] = useState<Resume7Hari[]>();
  const [dataResume7HariPerbulan, setDataResume7HariPerbulan] =
    useState<Resume7HariPerbulan[]>();
  const [dataResume7HariTidakhadir, setDataResume7HariTidakhadir] =
    useState<Resume7HariTidakhadir[]>();

  //data guru
  const [countGuru, setCountGuru] = useState(0);
  const [dataResumeGuru, setDataResumeGuru] = useState<ResumeGuru[]>();
  const [dataResume7HariGuru, setDataResume7HariGuru] =
    useState<Resume7HariGuru[]>();
  const [dataResume7HariPerbulanGuru, setDataResume7HariPerbulanGuru] =
    useState<Resume7HariPerbulanGuru[]>();
  const [dataResume7HariTidakhadirGuru, setDataResume7HariTidakhadirGuru] =
    useState<Resume7HariTidakhadirGuru[]>();
  const [loadingFetch, setLoadingFetch] = useState(true);

  const activeTahunAjaran = useTahunAjaranStore(
    (state) => state.activeTahunAjaran,
  );
  const [filterTA, setFilterTA] = useState("");
  useEffect(() => {
    if (activeTahunAjaran) {
      setFilterTA(activeTahunAjaran.name);
    }
  }, [activeTahunAjaran]);

  useEffect(() => {
    if (!session?.data?.accessToken) return;
    if (!filterTA) return;

    const loadData = async () => {
      setLoadingFetch(true);
      await getResumeAbsen7HariPerbulan(); // tunggu selesai dulu
      await Promise.all([getResumeAbsen7HariPerbulanGuru()]); // setelah itu baru jalankan paralel
      setLoadingFetch(false);
    };

    if (session.status === "authenticated") {
      loadData();
    }
  }, [session.status, filterTA]);

  // get data siswa
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
  // end get data siswa

  // data guru
  const getRekapAbsensiGuru = async () => {
    try {
      const payload = {
        inst: session.data?.user?.instansiId,
      };
      const token = session.data?.accessToken;
      const req = await dashboardServices.getRekapAbsensiGuru(payload, token);
      if (req.status !== 200 || req.data.status_code !== 200) {
        console.error("Gagal mengambil data resume absensi Guru");
        return;
      }
      console.log("ini data resume absensi Guru", req.data.data);
      setCountGuru(req.data.data.countGuru);
      setDataResumeGuru(req.data.data.dataResumeAbsensi);
    } catch (error) {
      console.error("Get data resume absensi Guru error:", error);
      setToaster({
        variant: "error",
        message: "Gagal mengambil data resume absensi Guru" + error,
      });
    }
  };
  const getResumeAbsen7HariGuru = async () => {
    try {
      const payload = {
        inst: session.data?.user?.instansiId,
      };
      const token = session.data?.accessToken;
      const req = await dashboardServices.getResume7HariGuru(payload, token);
      if (req.status !== 200 || req.data.status_code !== 200) {
        console.error("Gagal mengambil data resume absensi Guru");
        return;
      }
      console.log("ini data resume absensi 7 Hari Guru", req.data.data);

      setDataResume7HariGuru(req.data.data);
    } catch (error) {
      console.error("Get data resume absensi 7 Hari Guru error:", error);
      setToaster({
        variant: "error",
        message: "Gagal mengambil data resume absensi 7 Hari Guru" + error,
      });
    }
  };
  const getResumeAbsen7HariPerbulanGuru = async () => {
    try {
      const payload = {
        inst: session.data?.user?.instansiId,
        tahunajaran: filterTA,
      };
      const token = session.data?.accessToken;
      const req = await dashboardServices.getResume7HariPerbulanGuru(
        payload,
        token,
      );
      if (req.status !== 200 || req.data.status_code !== 200) {
        console.error(
          "Gagal mengambil data resume absensi 7Hari Perbulan Guru",
        );
        return;
      }
      console.log(
        "ini data resume absensi 7 Hari Perbulan Guru",
        req.data.data,
      );

      setDataResume7HariPerbulanGuru(req.data.data);
    } catch (error) {
      console.error(
        "Get data resume absensi 7Hari Perbulan Guru error:",
        error,
      );
      setToaster({
        variant: "error",
        message:
          "Gagal mengambil data resume absensi 7Hari Perbulan Guru" + error,
      });
    }
  };
  const getResumeAbsen7HariTidakhadirGuru = async () => {
    try {
      const payload = {
        inst: session.data?.user?.instansiId,
      };
      const token = session.data?.accessToken;
      const req = await dashboardServices.getResume7HariTidakhadirGuru(
        payload,
        token,
      );
      if (req.status !== 200 || req.data.status_code !== 200) {
        console.error("Gagal mengambil data resume absensi tidak hadir Guru");
        return;
      }
      console.log(
        "ini data resume absensi 7 Hari tidak hadir Guru",
        req.data.data,
      );

      setDataResume7HariTidakhadirGuru(req.data.data);
    } catch (error) {
      console.error("Get data resume absensi tidak hadir Guru error:", error);
      setToaster({
        variant: "error",
        message: "Gagal mengambil data resume absensi Gurutidak hadir" + error,
      });
    }
  };
  // end data guru
  useEffect(() => {
    if (!session?.data?.accessToken) return;
    const loadData = async () => {
      setLoadingFetch(true);
      await getRekapAbsensi(); // tunggu selesai dulu
      await Promise.all([
        getResumeAbsen7Hari(),
        getResumeAbsen7HariTidakhadir(),
        getResumeAbsen7HariPerbulan(),
        getRekapAbsensiGuru(),
        getResumeAbsen7HariGuru(),
        getResumeAbsen7HariTidakhadirGuru(),
        getResumeAbsen7HariPerbulanGuru(),
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
      countGuru={countGuru}
      dataResume={dataResume ?? []}
      dataResumeGuru={dataResumeGuru ?? []}
      dataResume7Hari={dataResume7Hari ?? []}
      dataResume7HariGuru={dataResume7HariGuru ?? []}
      data={dataResume7HariPerbulan ?? []}
      dataGuru={dataResume7HariPerbulanGuru ?? []}
      dataResume7HariTidakhadir={dataResume7HariTidakhadir ?? []}
      dataResume7HariTidakhadirGuru={dataResume7HariTidakhadirGuru ?? []}
      loadingFetch={loadingFetch}
      filterTA={filterTA}
      setFilterTA={setFilterTA}
    />
  );
};

export default AdminPage;
