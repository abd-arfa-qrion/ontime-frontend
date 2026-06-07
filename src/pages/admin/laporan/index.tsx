import LaporanCetak from "@/components/view/admin/Laporan";
import laporanServices from "@/pages/api/services/laporan";
import { useTahunAjaranStore } from "@/store/tahunAjaranStore";
import {
  LapAbsensiMasukGuru,
  LaporanAbsensiAkademik,
  LaporanAbsensiUmum,
} from "@/type/Laporan.type";
import { formatTglUtkBankendRequest } from "@/utils/formatdate";
import { getTahunAjaranWithSemester } from "@/utils/tasemester";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const LaporanPage = ({ setToaster }: any) => {
  const session: any = useSession();
  const [lapAbsenAkdmk, setLapAbsenAkdmk] = useState<LaporanAbsensiAkademik[]>(
    [],
  );
  const [lapAbsenUmum, setLapAbsenUmum] = useState<LaporanAbsensiUmum[]>([]);
  const [lapAbsenMasukGuru, setLapAbsenMasukGuru] = useState<
    LapAbsensiMasukGuru[]
  >([]);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const activeTahunAjaran = useTahunAjaranStore(
    (state) => state.activeTahunAjaran,
  );
  const [filterTA, setFilterTA] = useState("");
  useEffect(() => {
    if (activeTahunAjaran) {
      setFilterTA(activeTahunAjaran.name);
    }
  }, [activeTahunAjaran]);

  const date = new Date();
  const getDatalapAbsenMasukGuru = async () => {
    try {
      const payload = {
        inst: session.data?.user?.instansiId,
        tahunajaran: filterTA,
        tgl: formatTglUtkBankendRequest(date),
      };
      console.log("date req Monitoring kelas:", date);
      console.log("payload data req Monitoring kelas:", payload);
      const token = session.data?.accessToken;
      const req = await laporanServices.getDataMasukPulangGuru(payload, token);
      if (req.status !== 200 || req.data.status_code !== 200) {
        console.error(
          "Gagal mengambil data monitoring kelas",
          req.data.message,
        );
        return;
      }
      console.log("data response result:", req.data.data);
      setLapAbsenMasukGuru(req.data.data);
    } catch (error) {
      console.error("Get data lap masuk pulang guru error:", error);
    }
  };
  useEffect(() => {
    if (!session?.data?.accessToken) return;
    const loadData = async () => {
      setLoadingFetch(true);
      await getDatalapAbsenMasukGuru(); // tunggu selesai dulu
      setLoadingFetch(false);
    };

    if (session.status === "authenticated") {
      loadData();
    }
  }, [session.status]);
  return (
    <LaporanCetak
      setToaster={setToaster}
      session={session}
      lapAbsenAkdmk={lapAbsenAkdmk}
      lapAbsenUmum={lapAbsenUmum}
      lapAbsenMasukGuru={lapAbsenMasukGuru}
      setLapAbsenMasukGuru={setLapAbsenMasukGuru}
      loadingFetch={loadingFetch}
      setLoadingFetch={setLoadingFetch}
      filterTA={filterTA}
      setFilterTA={setFilterTA}
    />
  );
};

export default LaporanPage;
