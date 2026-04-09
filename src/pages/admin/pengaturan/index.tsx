import PengaturanPageView from "@/components/view/admin/pengaturan";
import SetAreaServices from "@/pages/api/services/setarea";
import {
  InstitutionArea,
  InstitutionAreaDefault,
} from "@/type/Institutionarea.type";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const PengaturanPage = ({ setToaster }: any) => {
  const session: any = useSession();
  const [dataArea, setDataArea] = useState<InstitutionArea>(
    InstitutionAreaDefault,
  );
  const [loadingFetch, setLoadingFetch] = useState(true);
  const getDataArea = async () => {
    try {
      const payload = {
        inst: session.data?.user?.instansiId,
      };
      const token = session.data?.accessToken;
      const req = await SetAreaServices.getDataArea(payload, token);
      if (req.status !== 200 || req.data.status_code !== 200) {
        if (req.data.status_code === 201) {
          console.log("data tidak ditemukan");
        }
        console.error("Gagal mengambil data area");
        return;
      }
      console.log(req.data.data);
      setDataArea(req.data.data);
    } catch (error) {
      console.error("Get data area error:", error);
    }
  };

  useEffect(() => {
    if (!session?.data?.accessToken) return;

    const loadData = async () => {
      setLoadingFetch(true);
      await getDataArea(); // tunggu selesai dulu

      setLoadingFetch(false);
    };

    if (session.status === "authenticated") {
      loadData();
    }
  }, [session.status]);

  return (
    <PengaturanPageView
      setToaster={setToaster}
      session={session}
      dataArea={dataArea}
      setDataArea={setDataArea}
    />
  );
};

export default PengaturanPage;
