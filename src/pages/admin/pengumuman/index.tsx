import PengumumanPageView from "@/components/view/admin/Pengumuman";
import pengumumanServices from "@/pages/api/services/pengumuman";
import { Pengumuman } from "@/type/Pengumuman.type";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const PengumumanPage = ({ setToaster }: any) => {
  const session: any = useSession();
  const [data, setData] = React.useState<Pengumuman[]>([]);
  const [loadingFetch, setLoadingFetch] = useState(true);

  const getDataPengumuman = async () => {
    try {
      const payload = {
        inst: session.data?.user?.instansiId,
      };
      const token = session.data?.accessToken;
      const req = await pengumumanServices.getAllData(payload, token);
      if (req.status !== 200 || req.data.status_code !== 200) {
        console.error("Gagal mengambil data jadwal akademik");
        return;
      }
      console.log(req.data.data);
      setData(req.data.data);
    } catch (error) {
      console.error("Get data jadwal akademik error:", error);
    }
  };

  useEffect(() => {
    if (!session?.data?.accessToken) return;

    const loadData = async () => {
      setLoadingFetch(true);
      await getDataPengumuman(); // tunggu selesai dulu

      setLoadingFetch(false);
    };

    if (session.status === "authenticated") {
      loadData();
    }
  }, [session.status]);
  return (
    <PengumumanPageView
      setToaster={setToaster}
      session={session}
      data={data}
      setData={setData}
      loadingFetch={loadingFetch}
      setLoadingFetch={setLoadingFetch}
    />
  );
};

export default PengumumanPage;
