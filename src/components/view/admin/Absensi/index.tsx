import AdminLayout from "@/components/layout/AdminLayout";
import DataTabelJadwalAkademik from "@/components/ui/ontime/datatable/datatablejadwalakademik";
import HeadContent from "@/components/ui/headContent/headcontent";
import { JadwalAkademik } from "@/type/Jadwalakademik.type";
import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  use,
  useEffect,
  useState,
} from "react";
import HeadContentRightAbsensi from "@/components/ui/headContent/headcontentrightabsensi";
import ModalAddAbsensi from "./ModalAddAbsensi";
import { Kelas } from "@/type/Kelas.type";
import kelasServices from "@/pages/api/services/kelas";
import DataTabelJadwalUmum from "@/components/ui/ontime/datatable/datatablejadwalumum";
import DataTabelJadwalMasuk from "@/components/ui/ontime/datatable/datatablejadwalmasuk";
import ModalAddAbsensiUmum from "./ModalAddAbsensiUmum";
import { JadwalUmum } from "@/type/Jadwalumum.type";
import { JadwalMasuk } from "@/type/Jadwalmasuk.type";
import { useSearchParams } from "next/navigation";

type Proptype = {
  setToaster: Dispatch<SetStateAction<{}>>;
  session: any;
  dataJdwlAkdmk: JadwalAkademik[];
  dataJdwlUmum: JadwalUmum[];
  dataJdwlMasuk: JadwalMasuk[];
  loadingFetch: boolean;
  setDataJdwlAkdmk: Dispatch<SetStateAction<JadwalAkademik[]>>;
  setDataJdwlUmum: Dispatch<SetStateAction<JadwalUmum[]>>;
  setDataJdwlMasuk: Dispatch<SetStateAction<JadwalMasuk[]>>;
  setLoadingFetch: Dispatch<SetStateAction<boolean>>;
};

const AbsensiPageView = (prop: Proptype) => {
  const {
    setToaster,
    session,
    dataJdwlAkdmk,
    dataJdwlUmum,
    dataJdwlMasuk,
    setDataJdwlAkdmk,
    setDataJdwlUmum,
    setDataJdwlMasuk,
    loadingFetch,
    setLoadingFetch,
  } = prop;
  const searchParam = useSearchParams();
  const activeTab = searchParam.get("tab") ?? "umum";

  const [kelasData, setKelasData] = useState<Kelas[]>([]);

  // Modal Manajemen
  const [addAbsensi, setAddAbsensi] = useState<boolean>(false);
  const [addAbsensiUmum, setAddAbsensiUmum] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState("");
  // Tab Manajemen
  const [jenisAbsensi, setJenisAbsensi] = useState<string>("umum"); //umum, masuk, pelajaran

  // useEffect(() => {
  //   setJenisAbsensi(jenisAbsensi);
  // }, [jenisAbsensi]);

  useEffect(() => {
    if (activeTab) {
      setJenisAbsensi(activeTab);
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

  return (
    <>
      <AdminLayout>
        <div>
          <div className="bagian-head-content flex justify-between items-center">
            <HeadContent text="Manajemen Absensi" />
            <HeadContentRightAbsensi
              jenisAbsensi={jenisAbsensi}
              setJenisAbsensi={setJenisAbsensi}
            />
          </div>
          {jenisAbsensi === "pelajaran" ? (
            <DataTabelJadwalAkademik
              data={dataJdwlAkdmk}
              setData={setDataJdwlAkdmk}
              setToaster={setToaster}
              session={session}
              loadingFetch={loadingFetch}
              setAddAbsensi={setAddAbsensi}
              kelasData={kelasData}
            />
          ) : jenisAbsensi === "umum" ? (
            <DataTabelJadwalUmum
              data={dataJdwlUmum}
              setData={setDataJdwlUmum}
              setToaster={setToaster}
              session={session}
              loadingFetch={loadingFetch}
              setAddAbsensiUmum={setAddAbsensiUmum}
              kelasData={kelasData}
            />
          ) : (
            <DataTabelJadwalMasuk
              data={dataJdwlMasuk}
              setData={setDataJdwlMasuk}
              setToaster={setToaster}
              session={session}
              loadingFetch={loadingFetch}
              setLoadingFetch={setLoadingFetch}
            />
          )}
        </div>
      </AdminLayout>
      {addAbsensi && (
        <ModalAddAbsensi
          isLoading={isLoading}
          onClose={() => setAddAbsensi(false)}
          setIsLoading={setIsLoading}
          setToaster={setToaster}
          setAddAbsensi={setAddAbsensi}
          setDataJdwlAkdmk={setDataJdwlAkdmk}
          kelasData={kelasData}
        />
      )}
      {addAbsensiUmum && (
        <ModalAddAbsensiUmum
          open={addAbsensiUmum}
          onClose={() => setAddAbsensiUmum(false)}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setToaster={setToaster}
          setAddAbsensiUmum={setAddAbsensi}
          setDataJdwlUmum={setDataJdwlUmum}
        />
      )}
    </>
  );
};

export default AbsensiPageView;
