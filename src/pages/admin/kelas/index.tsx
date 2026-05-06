import KelasPageView from "@/components/view/admin/Kelas";
import kelasServices from "@/pages/api/services/kelas";
import { MonitoringKelas } from "@/type/Kelas.type";
import { formatTglUtkBankendRequest } from "@/utils/formatdate";
import { getTahunAjaranWithSemester } from "@/utils/tasemester";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const AdminKelasPage = ({ setToaster }: any) => {
  const session: any = useSession();
  const [dataMonkel, setDataMonkel] = useState<MonitoringKelas[]>([]);
  const [loadingFetch, setLoadingFetch] = useState(true);

  const tasem = getTahunAjaranWithSemester();
  const date = new Date();
  const getDataMonkel = async () => {
    try {
      const payload = {
        inst: session.data?.user?.instansiId,
        tahunajaran: tasem.ta,
        tgl: formatTglUtkBankendRequest(date),
      };
      console.log("date req Monitoring kelas:", date);
      console.log("payload data req Monitoring kelas:", payload);
      const token = session.data?.accessToken;
      const req = await kelasServices.getDataMonitoringKelas(payload, token);
      if (req.status !== 200 || req.data.status_code !== 200) {
        console.error(
          "Gagal mengambil data monitoring kelas",
          req.data.message,
        );
        return;
      }
      console.log("data response result:", req.data.data);
      setDataMonkel(req.data.data);
    } catch (error) {
      console.error("Get data jadwal umum error:", error);
    }
  };
  useEffect(() => {
    if (!session?.data?.accessToken) return;
    const loadData = async () => {
      setLoadingFetch(true);
      await getDataMonkel(); // tunggu selesai dulu
      setLoadingFetch(false);
    };

    if (session.status === "authenticated") {
      loadData();
    }
  }, [session.status]);
  return (
    <KelasPageView
      data={dataMonkel}
      setToaster={setToaster}
      session={session}
      loadingFetch={loadingFetch}
    />
  );
};

export default AdminKelasPage;
