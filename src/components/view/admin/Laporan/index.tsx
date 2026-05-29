import React, { Dispatch, SetStateAction, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import AdminLayout from "@/components/layout/AdminLayout";
import HeadContent from "@/components/ui/headContent/headcontent";
import HeadContentRightLaporan from "@/components/ui/headContent/headcontentrightlaporan";
import DownloadAbsensiModal from "./Modaldownload";
import DataTableUmumGuru from "./datatabelumum/datatableguru";

type Proptype = {
  setToaster: Dispatch<SetStateAction<{}>>;
  session: any;
  lapAbsenAkdmk: any;
  lapAbsenUmum: any;
  lapAbsenMasuk: any;
  loadingFetch: boolean;
  filterTA: string;
  setFilterTA: Dispatch<SetStateAction<string>>;
};
const LaporanCetak = (props: Proptype) => {
  const { setToaster, session, filterTA, setFilterTA } = props;

  const [jenisAbsensi, setJenisAbsensi] = useState("masuk");
  const [subjek, setSubjek] = useState("siswa");
  const [modalDownload, setModalDownload] = useState(false);

  return (
    <>
      <AdminLayout>
        <div>
          <div className="bagian-head-content flex justify-between items-center">
            <HeadContent text="Laporan Absensi" />
            <HeadContentRightLaporan
              jenisAbsensi={jenisAbsensi}
              setJenisAbsensi={setJenisAbsensi}
              modalDownload={modalDownload}
              setModalDownload={setModalDownload}
              filterTA={filterTA}
              setFilterTA={setFilterTA}
            />
          </div>
          {jenisAbsensi === "umum" && subjek === "guru" ? (
            <p>Data tabel Absensi Umum Guru</p>
          ) : jenisAbsensi === "umum" && subjek === "siswa" ? (
            <p>Data tabel Absensi Umum Siswa</p>
          ) : jenisAbsensi === "masuk" && subjek === "guru" ? (
            <p>Data tabel Absensi Masuk Guru</p>
          ) : jenisAbsensi === "masuk" && subjek === "siswa" ? (
            <p>Maaf Tidak Ada absen Masuk & Pulang untuk Siswa</p>
          ) : jenisAbsensi === "pelajaran" && subjek === "guru" ? (
            <p>Maaf Tidak Ada absen pelajaran untuk Guru</p>
          ) : jenisAbsensi === "pelajaran" && subjek === "siswa" ? (
            <p>Data tabel Absensi Akademik Siswa</p>
          ) : null}
        </div>
      </AdminLayout>
      {modalDownload && (
        <DownloadAbsensiModal onClose={() => setModalDownload(false)} />
      )}
    </>
  );
};

export default LaporanCetak;
