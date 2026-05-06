import AdminLayout from "@/components/layout/AdminLayout";
import HeadContent from "@/components/ui/headContent/headcontent";
import HeadContentRightDashboard from "@/components/ui/headContent/headcontentrightdashboard";
import DataTableJustifikasi from "@/components/ui/ontime/datatable/datatablejustifikasi";
import kelasServices from "@/pages/api/services/kelas";
import { Justifikasi } from "@/type/Justifikasi.type";
import { Kelas } from "@/type/Kelas.type";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

type Props = {
  setToaster: Dispatch<SetStateAction<{}>>;
  session: any;
  data: Justifikasi[];
  setData: Dispatch<SetStateAction<Justifikasi[]>>;
  loadingFetch: boolean;
};
const JustifikasiPageView = (prop: Props) => {
  const { setToaster, session, data, setData, loadingFetch } = prop;
  const [kelasData, setKelasData] = useState<Kelas[]>([]);
  const [isLoading, setIsLoading] = useState("");
  const [tabActive, setTabActive] = useState("siswa");
  useEffect(() => {
    if (!session?.data?.accessToken) return;
    const loadData = async () => {
      await getDataKelas(); // tunggu selesai dulu
    };

    if (session.status === "authenticated") {
      loadData();
    }
  }, [session?.data?.accessToken]);

  const getDataKelas = async () => {
    const data = {
      inst: session.data?.user?.instansiId,
    };
    try {
      const res = await kelasServices.getAllData(
        data,
        session.data?.accessToken,
      );
      if (res.status !== 200) {
        setToaster({
          variant: "danger",
          message: res.data.message,
        });
      } else {
        setKelasData(res.data.data);
      }
      console.log(res);
    } catch (error) {
      setToaster({
        variant: "danger",
        message: "Terjadi kesalahan",
      });
    } finally {
      setIsLoading("");
    }
  };
  const handleFilterbyKelas = (kelas: number | null) => {
    if (kelas !== null) {
      console.log(kelas);
    } else {
      console.log(data);
    }
  };
  return (
    <AdminLayout>
      <div>
        <div className="bagian-head-content flex justify-between items-center">
          <HeadContent text="Justifikasi" />
          <HeadContentRightDashboard
            tabActive={tabActive}
            setTabActive={setTabActive}
            kelasData={kelasData}
            handleFilterbyKelas={handleFilterbyKelas}
          />
        </div>
        <DataTableJustifikasi
          data={data}
          setData={setData}
          session={session}
          loadingFetch={loadingFetch}
        />
        <div></div>
      </div>
    </AdminLayout>
  );
};

export default JustifikasiPageView;
