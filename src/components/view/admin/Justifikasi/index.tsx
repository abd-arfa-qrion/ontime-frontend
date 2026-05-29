import AdminLayout from "@/components/layout/AdminLayout";
import HeadContent from "@/components/ui/headContent/headcontent";
import HeadContentRightDashboard from "@/components/ui/headContent/headcontentrightdashboard";
import DataTableJustifikasi from "@/components/ui/ontime/datatable/datatablejustifikasi";
import DataTableJustifikasiGuru from "@/components/ui/ontime/datatable/datatablejustifikasiguru";
import justifikasiServices from "@/pages/api/services/justifikasi";
import kelasServices from "@/pages/api/services/kelas";
import { Justifikasi, JustifikasiGuru } from "@/type/Justifikasi.type";
import { Kelas } from "@/type/Kelas.type";
import { getTahunAjaranWithSemester } from "@/utils/tasemester";
import { useSearchParams } from "next/navigation";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

type Props = {
  setToaster: Dispatch<SetStateAction<{}>>;
  session: any;
  data: Justifikasi[];
  setData: Dispatch<SetStateAction<Justifikasi[]>>;
  loadingFetch: boolean;
  setLoadingFetch: Dispatch<SetStateAction<boolean>>;
  filterTA: string;
  setFilterTA: Dispatch<SetStateAction<string>>;
};
const JustifikasiPageView = (prop: Props) => {
  const {
    setToaster,
    session,
    data,
    setData,
    loadingFetch,
    setLoadingFetch,
    filterTA,
    setFilterTA,
  } = prop;

  const searchParam = useSearchParams();
  const activeTab = searchParam.get("tab") ?? "siswa";

  const [kelasData, setKelasData] = useState<Kelas[]>([]);
  const [isLoading, setIsLoading] = useState("");
  const [tabActive, setTabActive] = useState("siswa");
  const [dataGuru, setDataGuru] = useState<JustifikasiGuru[]>([]);

  const tasem = getTahunAjaranWithSemester();
  useEffect(() => {
    if (activeTab) {
      setTabActive(activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!session?.data?.accessToken) return;
    const loadData = async () => {
      await getDataKelas(); // tunggu selesai dulu
    };

    if (session.status === "authenticated") {
      loadData();
    }
  }, [session?.data?.accessToken]);

  useEffect(() => {
    if (tabActive === "guru") {
      if (session.status === "authenticated") {
        getDataGuru();
      }
    }
  }, [tabActive]);

  const getDataGuru = async () => {
    setLoadingFetch(true);
    const data = {
      inst: session.data?.user?.instansiId,
      tahunajaran: tasem.ta,
    };
    try {
      const res = await justifikasiServices.getAllDataGuru(
        data,
        session.data?.accessToken,
      );
      if (res.status !== 200 && res.data.status_code !== 200) {
        setToaster({
          variant: "danger",
          message: res.data.message,
        });
      } else {
        console.log("data justifikasi guru: ", res);
        setDataGuru(res.data.data);
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingFetch(false);
    }
  };
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
            filterTA={filterTA}
            setFilterTA={setFilterTA}
          />
        </div>
        {tabActive === "siswa" ? (
          <DataTableJustifikasi
            data={data}
            setData={setData}
            session={session}
            loadingFetch={loadingFetch}
            setToaster={setToaster}
          />
        ) : (
          <DataTableJustifikasiGuru
            dataGuru={dataGuru}
            setDataGuru={setDataGuru}
            session={session}
            loadingFetch={loadingFetch}
            setToaster={setToaster}
            setTabActive={setTabActive}
          />
        )}

        <div></div>
      </div>
    </AdminLayout>
  );
};

export default JustifikasiPageView;
