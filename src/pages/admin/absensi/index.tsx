import AbsensiPageView from "@/components/view/admin/Absensi";
import jadwalAkademikServices from "@/pages/api/services/jadwalakademik";
import jadwalMasukServices from "@/pages/api/services/jadwalmasuk";
import jadwalUmumServices from "@/pages/api/services/jadwalumum";
import { JadwalAkademik } from "@/type/Jadwalakademik.type";
import { JadwalMasuk } from "@/type/Jadwalmasuk.type";
import { JadwalUmum } from "@/type/Jadwalumum.type";
import { getTahunAjaranWithSemester } from "@/utils/tasemester";
import { error } from "console";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const AdminAbsenPage = ({ setToaster }: any) => {
  const session: any = useSession();
  const [dataJdwlAkdmk, setDataJdwlAkdmk] = useState<JadwalAkademik[]>([]);
  const [dataJdwlUmum, setDataJdwlUmum] = useState<JadwalUmum[]>([]);
  const [dataJdwlMasuk, setDataJdwlMasuk] = useState<JadwalMasuk[]>([]);
  const [loadingFetch, setLoadingFetch] = useState(true);

  const tasem = getTahunAjaranWithSemester();

  const getDataJadwalAkademik = async () => {
    try {
      const payload = {
        inst: session.data?.user?.instansiId,
        tahunajaran: tasem.ta,
      };
      const token = session.data?.accessToken;
      const req = await jadwalAkademikServices.getAllData(payload, token);
      if (req.status !== 200 || req.data.status_code !== 200) {
        console.error("Gagal mengambil data jadwal akademik", req.data.message);
        return;
      }
      setDataJdwlAkdmk(req.data.data);
    } catch (error) {
      console.error("Get data jadwal akademik error:", error);
    }
  };
  const getDataJadwalUmum = async () => {
    try {
      const payload = {
        inst: session.data?.user?.instansiId,
        tahunajaran: tasem.ta,
      };
      const token = session.data?.accessToken;
      const req = await jadwalUmumServices.getAllData(payload, token);
      if (req.status !== 200 || req.data.status_code !== 200) {
        console.error("Gagal mengambil data jadwal umum");
        return;
      }
      setDataJdwlUmum(req.data.data);
    } catch (error) {
      console.error("Get data jadwal umum error:", error);
    }
  };

  const getDataJadwalMasuk = async () => {
    const data = {
      inst: session.data?.user?.instansiId,
      tahunajaran: tasem.ta,
    };
    try {
      const reqData = await jadwalMasukServices.getAllData(
        data,
        session.data?.accessToken,
      );
      if (reqData.status !== 200 || reqData.data.status_code !== 200) {
        console.log("Get data jadwal masuk error:", reqData.data.message);
        return;
      }
      setDataJdwlMasuk(reqData.data.data);
    } catch (error) {
      console.log("Get data jadwal masuk error:", error);
    }
  };

  useEffect(() => {
    if (!session?.data?.accessToken) return;

    const loadData = async () => {
      setLoadingFetch(true);
      await getDataJadwalUmum(); // tunggu selesai dulu
      await Promise.all([getDataJadwalAkademik(), getDataJadwalMasuk()]); // setelah itu baru jalankan paralel
      setLoadingFetch(false);
    };

    if (session.status === "authenticated") {
      loadData();
    }
  }, [session.status]);

  return (
    <AbsensiPageView
      setToaster={setToaster}
      session={session}
      dataJdwlAkdmk={dataJdwlAkdmk}
      setDataJdwlAkdmk={setDataJdwlAkdmk}
      dataJdwlUmum={dataJdwlUmum}
      setDataJdwlUmum={setDataJdwlUmum}
      dataJdwlMasuk={dataJdwlMasuk}
      setDataJdwlMasuk={setDataJdwlMasuk}
      loadingFetch={loadingFetch}
      setLoadingFetch={setLoadingFetch}
    />
  );
};

export default AdminAbsenPage;
