import JustifikasiPageView from "@/components/view/admin/Justifikasi";
import justifikasiServices from "@/pages/api/services/justifikasi";
import { Justifikasi } from "@/type/Justifikasi.type";
import { getTahunAjaranWithSemester } from "@/utils/tasemester";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const JustifikasiPage = ({ setToaster }: any) => {
  const session: any = useSession();
  const [data, setData] = useState<Justifikasi[]>([]);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [filterTA, setFilterTA] = useState(() => {
    return getTahunAjaranWithSemester().ta;
  });

  const getDataJustifikasi = async () => {
    try {
      const payload = {
        inst: session.data?.user?.instansiId,
        tahunajaran: filterTA,
      };
      const token = session.data?.accessToken;
      const req = await justifikasiServices.getAllData(payload, token);
      if (req.status !== 200 || req.data.status_code !== 200) {
        console.error("Gagal mengambil data Justifikasi");
        return;
      }
      console.log(req.data.data);
      setData(req.data.data);
    } catch (error) {
      console.error("Get data jadwal Justifikasi error:", error);
    }
  };

  useEffect(() => {
    if (!session?.data?.accessToken) return;

    const loadData = async () => {
      setLoadingFetch(true);
      await getDataJustifikasi(); // tunggu selesai dulu

      setLoadingFetch(false);
    };

    if (session.status === "authenticated") {
      loadData();
    }
  }, [session.status]);

  return (
    <JustifikasiPageView
      setToaster={setToaster}
      session={session}
      data={data}
      setData={setData}
      loadingFetch={loadingFetch}
      setLoadingFetch={setLoadingFetch}
      filterTA={filterTA}
      setFilterTA={setFilterTA}
    />
  );
};

export default JustifikasiPage;
