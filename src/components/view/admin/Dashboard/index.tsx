import AdminLayout from "@/components/layout/AdminLayout";
import HeadContent from "@/components/ui/headContent/headcontent";
import HeadContentRightDashboard from "@/components/ui/headContent/headcontentrightdashboard";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import DashboardAtas from "./bagatas";
import DashboardChart from "./bagchart";
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
import DataTableDashboardSiswa7Hari from "@/components/ui/ontime/datatable/datatabledashboardsiswa7hari";
import { Kelas } from "@/type/Kelas.type";
import kelasServices from "@/pages/api/services/kelas";
import DashboardAtasGuru from "./bagatasguru";
import DashboardChartGuru from "./bagchartguru";
import DataTableDashboardGuru7Hari from "@/components/ui/ontime/datatable/datatabledashboardguru7hari";

type Proptypes = {
  setToaster: Dispatch<SetStateAction<{}>>;
  session: any;
  countSiswa: number;
  countGuru: number;
  dataResume: ResumeSiswa[];
  dataResumeGuru: ResumeGuru[];
  dataResume7Hari: Resume7Hari[];
  dataResume7HariGuru: Resume7HariGuru[];
  dataResume7HariTidakhadir: Resume7HariTidakhadir[];
  dataResume7HariTidakhadirGuru: Resume7HariTidakhadirGuru[];
  loadingFetch: boolean;
  data: Resume7HariPerbulan[];
  dataGuru: Resume7HariPerbulanGuru[];
  filterTA: string;
  setFilterTA: Dispatch<SetStateAction<string>>;
};
const AdminDashboardView = (prop: Proptypes) => {
  const {
    setToaster,
    session,
    countSiswa,
    countGuru,
    dataResume,
    dataResumeGuru,
    dataResume7Hari,
    dataResume7HariGuru,
    dataResume7HariTidakhadir,
    dataResume7HariTidakhadirGuru,
    loadingFetch,
    data,
    dataGuru,
    filterTA,
    setFilterTA,
  } = prop;
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
    <>
      <AdminLayout>
        <div>
          <div className="bagian-head-content flex justify-between items-center">
            <HeadContent text="Dashboard" />
            <HeadContentRightDashboard
              tabActive={tabActive}
              setTabActive={setTabActive}
              kelasData={kelasData}
              selectFilterKelas={handleFilterbyKelas}
              filterTA={filterTA}
              setFilterTA={setFilterTA}
            />
          </div>
          {tabActive === "siswa" ? (
            <div className="flex flex-col gap-4">
              <DashboardAtas
                countSiswa={countSiswa}
                dataResume={dataResume}
                loadingFetch={loadingFetch}
              />
              <DashboardChart
                dataResume7Hari={dataResume7Hari}
                dataResume7HariTidakhadir={dataResume7HariTidakhadir}
                loadingFetch={loadingFetch}
              />
              <DataTableDashboardSiswa7Hari
                data={data}
                loadingFetch={loadingFetch}
                session={session}
                setData={setToaster}
                filterTA={filterTA}
              />
              {/* <DashboardTable /> */}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <DashboardAtasGuru
                countGuru={countGuru}
                dataResume={dataResumeGuru}
                loadingFetch={loadingFetch}
              />
              <DashboardChartGuru
                dataResume7HariGuru={dataResume7HariGuru}
                dataResume7HariTidakhadirGuru={dataResume7HariTidakhadirGuru}
                loadingFetch={loadingFetch}
              />
              <DataTableDashboardGuru7Hari
                dataGuru={dataGuru}
                loadingFetch={loadingFetch}
                session={session}
                filterTA={filterTA}
              />
              {/* <DashboardTable /> */}
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboardView;
