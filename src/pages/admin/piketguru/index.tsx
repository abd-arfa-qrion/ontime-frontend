import PiketGuruPageView from "@/components/view/admin/Piketguru";
import piketGuruServices from "@/pages/api/services/piketguru";
import { PiketGuru } from "@/type/Piketguru.type";
import { getTahunAjaranWithSemester } from "@/utils/tasemester";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const PiketGuruPage = ({ setToaster }: any) => {
  const session: any = useSession();

  const [dataPiketGuru, setDataPiketGuru] = useState<PiketGuru[]>([]);
  const [loadingFetch, setLoadingFetch] = useState(true);

  const tasem = getTahunAjaranWithSemester();

  const getDataPiket = async () => {
    try {
      const payload = {
        inst: session.data?.user?.instansiId,
        tahunajaran: tasem.ta,
      };
      const token = session.data?.accessToken;
      const req = await piketGuruServices.getAllData(payload, token);
      if (req.status !== 200 || req.data.status_code !== 200) {
        console.error("Gagal mengambil data jadwal akademik");
        return;
      }
      console.log(req.data.data);
      setDataPiketGuru(req.data.data);
    } catch (error) {
      console.error("Get data jadwal akademik error:", error);
    }
  };

  useEffect(() => {
    if (!session?.data?.accessToken) return;

    const loadData = async () => {
      setLoadingFetch(true);
      await getDataPiket(); // tunggu selesai dulu

      setLoadingFetch(false);
    };

    if (session.status === "authenticated") {
      loadData();
    }
  }, [session.status]);
  return (
    <PiketGuruPageView
      setToaster={setToaster}
      session={session}
      dataPiketGuru={dataPiketGuru}
      loadingFetch={loadingFetch}
      setLoadingFetch={setLoadingFetch}
    />
  );
};

export default PiketGuruPage;
