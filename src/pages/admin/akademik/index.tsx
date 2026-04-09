import AkademikPageView from "@/components/view/admin/Akademik";
import kaldikServices from "@/pages/api/services/kaldik";
import { Kaldik } from "@/type/Kaldik.type";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const AdminAkademikPage = ({ setToaster }: any) => {
  const session: any = useSession();
  const [data, setData] = React.useState<Kaldik[]>([]);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const getDataKaldik = async () => {
    try {
      const payload = {
        inst: session.data?.user?.instansiId,
      };
      const token = session.data?.accessToken;
      const req = await kaldikServices.getAllData(payload, token);
      if (req.status !== 200 || req.data.status_code !== 200) {
        console.error("Gagal mengambil data kalender akademik");
        return;
      }
      console.log(req.data.data);
      setData(req.data.data);
    } catch (error) {
      console.error("Get data kalender akademik error:", error);
    }
  };

  useEffect(() => {
    if (!session?.data?.accessToken) return;

    const loadData = async () => {
      setLoadingFetch(true);
      await getDataKaldik(); // tunggu selesai dulu

      setLoadingFetch(false);
    };

    if (session.status === "authenticated") {
      loadData();
    }
  }, [session.status]);
  return (
    <AkademikPageView
      setToaster={setToaster}
      session={session}
      data={data}
      setData={setData}
      loadingFetch={loadingFetch}
      setLoadingFetch={setLoadingFetch}
    />
  );
};
export default AdminAkademikPage;
