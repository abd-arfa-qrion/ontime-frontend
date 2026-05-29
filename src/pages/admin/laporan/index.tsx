import LaporanCetak from "@/components/view/admin/Laporan";
import {
  LaporanAbsensiAkademik,
  LaporanAbsensiMasuk,
  LaporanAbsensiUmum,
} from "@/type/Laporan.type";
import { getTahunAjaranWithSemester } from "@/utils/tasemester";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

const LaporanPage = ({ setToaster }: any) => {
  const session: any = useSession();
  const [lapAbsenAkdmk, setLapAbsenAkdmk] = useState<LaporanAbsensiAkademik[]>(
    [],
  );
  const [lapAbsenUmum, setLapAbsenUmum] = useState<LaporanAbsensiUmum[]>([]);
  const [lapAbsenMasuk, setLapAbsenMasuk] = useState<LaporanAbsensiMasuk[]>([]);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [filterTA, setFilterTA] = useState(() => {
    return getTahunAjaranWithSemester().ta;
  });

  return (
    <LaporanCetak
      setToaster={setToaster}
      session={session}
      lapAbsenAkdmk={lapAbsenAkdmk}
      lapAbsenUmum={lapAbsenUmum}
      lapAbsenMasuk={lapAbsenMasuk}
      loadingFetch={loadingFetch}
      filterTA={filterTA}
      setFilterTA={setFilterTA}
    />
  );
};

export default LaporanPage;
