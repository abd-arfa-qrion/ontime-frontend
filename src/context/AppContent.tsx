import { useEffect } from "react";
import { useSession } from "next-auth/react";

import taSmesterServices from "@/pages/api/services/tasmester";
import { useTahunAjaranStore } from "@/store/tahunAjaranStore";

export default function AppContent() {
  const session: any = useSession();

  const { setActiveTahunAjaran, setListTahunAjaran } = useTahunAjaranStore();

  useEffect(() => {
    const loadTahunAjaran = async () => {
      try {
        if (!session?.data?.user?.instansiId) return;

        const res = await taSmesterServices.getDataTAFilter(
          {
            inst: session.data.user.instansiId,
          },
          session.data.accessToken,
        );

        // console.log("Inisiasi awal Tahun Ajaran:", res.data.data);

        setListTahunAjaran(res.data.data);

        const aktif = res.data.data.find(
          (item: any) => item.status_id === "ACTIVE",
        );

        if (aktif) {
          // console.log("Tahun Ajaran aktif:", aktif);
          setActiveTahunAjaran(aktif);
        }
      } catch (error) {
        console.error("Gagal memuat Tahun Ajaran:", error);
      }
    };

    if (session.status === "authenticated") {
      loadTahunAjaran();
    }
  }, [
    session.status,
    session.data?.user?.instansiId,
    session.data?.accessToken,
    setActiveTahunAjaran,
    setListTahunAjaran,
  ]);

  return null;
}
