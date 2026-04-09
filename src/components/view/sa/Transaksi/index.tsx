import SaLayout from "@/components/layout/SaLayout";
import DataTabelTrx from "@/components/ui/datatabeltrx";
import transaksiServices from "@/services/transaksi";
import { Transaksi } from "@/type/Transaksi.type";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

type Proptype = {
  setToaster: Dispatch<SetStateAction<{}>>;
  session: any;
};
const TransaksiPageView = (prop: Proptype) => {
  const { setToaster, session } = prop;
  const [dataTrx, setDataTrx] = useState<Transaksi[]>([]);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const getDataTrx = async () => {
    setLoadingFetch(true);
    try {
      const req = await transaksiServices.getAllTrx(session.data?.accessToken);
      if (req.status === 200) {
        if (req.data.status_code === 200) {
          console.log(req.data.data);
          setDataTrx(req.data.data);
          setToaster({
            variant: "success",
            message: req.data.message,
          });
        }
      }
    } catch (error) {
      setToaster({
        variant: "danger",
        message: `Data Error! ${error}`,
      });
    } finally {
      setLoadingFetch(false);
    }
  };

  useEffect(() => {
    if (session.status === "authenticated") {
      getDataTrx();
    }
  }, [session.status]);
  return (
    <SaLayout>
      <div>
        <h2>Daftar Transaksi Hari Ini</h2>
        <DataTabelTrx
          data={dataTrx}
          setData={setDataTrx}
          setToaster={setToaster}
          session={session}
          loadingFetch={loadingFetch}
        />
      </div>
    </SaLayout>
  );
};

export default TransaksiPageView;
