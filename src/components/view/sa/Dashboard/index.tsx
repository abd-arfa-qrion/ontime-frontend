import SaLayout from "@/components/layout/SaLayout";
import ResumePenjualan from "@/components/ui/chart/multibarchart/admin/ResumePenjualan";
import MyPieChart from "@/components/ui/chart/piechart";

import {
  TransaksiTodayDefault,
  TransaksiTodayType,
} from "@/type/Dashboard.type";
import { Button } from "@mui/material";
import { get } from "http";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, {
  Dispatch,
  SetStateAction,
  use,
  useCallback,
  useEffect,
  useState,
} from "react";

type Proptypes = {
  setToaster: Dispatch<SetStateAction<{}>>;
};
const SaDashboardView = (prop: Proptypes) => {
  const { setToaster } = prop;
  const [countTrx, setCountTrx] = useState<TransaksiTodayType>(
    TransaksiTodayDefault,
  );
  // const [txBlnBerjalan, setTxBlnBerjalan] = useState<TransaksiPeriode[]>([
  //   TransaksiPeriodeDefault,
  // ]);
  const pieChartData = [
    { name: "Counter", value: countTrx.countCounter },
    { name: "Mobile", value: countTrx.countMobile },
    { name: "Qris", value: countTrx.countQris },
  ];
  // const barChartData = txBlnBerjalan;
  const session: any = useSession();
  //ambil count transaksi total dan perchannel
  const getCountTXToday = useCallback(async () => {
    // try {
    //   const req = await dashboardsaServices.getCountTxToday(
    //     session.data?.accessToken
    //   );
    //   if (req.status === 200) {
    //     if (req.data.status_code === 200) {
    //       setCountTrx(req.data.data);
    //     } else {
    //       setToaster({
    //         variant: "warning",
    //         message: req.data.status_code + "-" + req.data.message,
    //       });
    //     }
    //   } else {
    //     setToaster({
    //       variant: "danger",
    //       message: req.status + "-" + req.data.message,
    //     });
    //   }
    // } catch (error) {
    //   setToaster({
    //     variant: "danger",
    //     message: `Data Error! ${error}`,
    //   });
    // }
  }, [session.data?.accessToken]);
  //ambil data transaksi bulan berjalan
  const getTXBlnBerjalan = useCallback(async () => {
    const dateNow = new Date();
    dateNow.setDate(1);
    dateNow.setHours(0, 0, 0, 0);
    const startDate = dateNow.getTime();

    const dateNow2 = new Date();
    dateNow2.setDate(dateNow2.getDate() - 1);
    dateNow2.setHours(23, 59, 59, 999);
    const endDate = dateNow2.getTime();

    const data = {
      startDate: Number(startDate),
      endDate: Number(endDate),
    };
    // try {
    //   const req = await dashboardsaServices.getTxBlnBerjalan(
    //     data,
    //     session.data?.accessToken
    //   );
    //   if (req.status === 200) {
    //     if (req.data.status_code === 200) {
    //       setTxBlnBerjalan(req.data.data);
    //     } else {
    //       setToaster({
    //         variant: "warning",
    //         message: req.data.status_code + "-" + req.data.message,
    //       });
    //     }
    //   } else {
    //     setToaster({
    //       variant: "danger",
    //       message: req.status + "-" + req.data.message,
    //     });
    //   }
    // } catch (error) {
    //   setToaster({
    //     variant: "danger",
    //     message: `Data Error! ${error}`,
    //   });
    // }
  }, [session.data?.accessToken]);

  useEffect(() => {
    if (session.status === "authenticated") {
      getCountTXToday();
      getTXBlnBerjalan();
    }
  }, [getCountTXToday, getTXBlnBerjalan, session.status]);

  return (
    <SaLayout>
      <div className="w-full flex flex-col gap-2">
        <div className="w-full shadow-md rounded-lg p-4 flex md:flex-row flex-col gap-2 items-center justify-between">
          <p className="md:text-2xl text-lg font-bold ">
            Jumlah Transaksi Hari Ini
            {countTrx.count > 0 && (
              <Link
                href="/sa/transaksi"
                className="text-white hover:bg-green-700 text-sm rounded-md px-2 py-1 bg-green-800 flex items-center gap-1 justify-center"
                target="_blank"
              >
                <i className="bx bx-show-alt text-lg mr-1"></i>
                Lihat Detail
              </Link>
            )}
          </p>
          <div className="bg-tird p-4 pt-2 rounded-xl text-white">
            <p className="text-center md:text-lg text-sm">Total</p>
            <p className="text-center md:text-7xl text-3xl font-bold">
              {countTrx.count}
            </p>
          </div>
          <div className="md:w-1/2">
            <MyPieChart
              title="Transaksi Hari Ini"
              width="100%"
              height={250}
              data={pieChartData}
            />
          </div>
        </div>
        <div>
          {/* <ResumePenjualan
            title="Resume Transaksi Bulan Ini"
            data={barChartData}
          /> */}
        </div>
      </div>
    </SaLayout>
  );
};

export default SaDashboardView;
