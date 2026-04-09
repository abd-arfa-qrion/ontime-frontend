import { ButtonLoading, ButtonLoadingDefault } from "@/type/Buttonloading.type";
import { useSession } from "next-auth/react";
import React, { Dispatch, SetStateAction, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import { renderToString } from "react-dom/server";
import SaLayout from "@/components/layout/SaLayout";
import transaksiServices from "@/services/transaksi";
import ExportDataTransaksiTemplate from "@/components/ui/laporan/TempalteExcel/LapTransaksi";
import FilterLaporanTransaksi from "@/components/ui/laporan/filterlaporantransaksi";

type Proptype = { setToaster: Dispatch<SetStateAction<{}>> };
const LaporanCetak = (props: Proptype) => {
  const { setToaster } = props;
  const session: any = useSession();
  const [isLoading, setIsLoading] = useState("");

  const exportToExcel = (data: any[], fileName: string, template: string) => {
    // Render komponen menjadi HTML string
    const htmlString = renderToString(
      <ExportDataTransaksiTemplate data={data} />
    );

    // Konversi HTML string menjadi worksheet
    const worksheet = XLSX.utils.table_to_sheet(
      new DOMParser()
        .parseFromString(htmlString, "text/html")
        .querySelector("table")
    );

    // Buat workbook dan tambahkan worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, template);

    // Simpan file
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const getAllTransaksi = async (e: { selected: string; dataDate: any }) => {
    console.log("tarik data siswa", e.selected);
    if (e.selected === "sukses") {
      try {
        const result = await transaksiServices.getTransaksiSuksesByTgl(
          e.dataDate,
          session.data?.accessToken
        );
        if (result.status === 200) {
          if (result.data.status_code === 200) {
            console.log("data transaksi", result.data.data);
            exportToExcel(
              result.data.data,
              `Data_Transaksi_${e.selected}`,
              "DataTransaksi"
            );
            setIsLoading("");
            setToaster({
              variant: "success",
              message: "Download data Transaksi berhasil!",
            });
          } else {
            setToaster({
              variant: "danger",
              message: `Data tidak ditemukan! ${result.data.data.message}`,
            });
            setIsLoading("");
          }
        } else {
          setToaster({
            variant: "danger",
            message: `terjadi kesalahan dalam fetching data ${result.data.message}`,
          });
          setIsLoading("");
        }
      } catch (error) {
        setToaster({
          variant: "danger",
          message: `Data Error! ${error}`,
        });
        setIsLoading("");
      }
    } else if (e.selected === "gagal") {
      try {
        const result = await transaksiServices.getTransaksiGagalByTgl(
          e.dataDate,
          session.data?.accessToken
        );
        if (result.status === 200) {
          if (result.data.status_code === 200) {
            console.log("data transaksi", result.data.data);
            exportToExcel(
              result.data.data,
              `Data_Transaksi_${e.selected}`,
              "DataTransaksi"
            );
            setIsLoading("");
            setToaster({
              variant: "success",
              message: "Download data Transaksi berhasil!",
            });
          } else {
            setToaster({
              variant: "danger",
              message: `Data tidak ditemukan! ${result.data.data.message}`,
            });
            setIsLoading("");
          }
        } else {
          setToaster({
            variant: "danger",
            message: `terjadi kesalahan dalam fetching data ${result.data.message}`,
          });
          setIsLoading("");
        }
      } catch (error) {
        setToaster({
          variant: "danger",
          message: `Data Error! ${error}`,
        });
        setIsLoading("");
      }
    } else {
      try {
        const result = await transaksiServices.getAllTransaksiByTgl(
          e.dataDate,
          session.data?.accessToken
        );
        if (result.status === 200) {
          if (result.data.status_code === 200) {
            console.log("data siswa", result.data.data);
            exportToExcel(result.data.data, "Data_Transaksi", "DataTransaksi");
            setIsLoading("");
            setToaster({
              variant: "success",
              message: "Download data pembayaran berhasil!",
            });
          } else {
            setToaster({
              variant: "danger",
              message: `Data tidak ditemukan! ${result.data.data.message}`,
            });
            setIsLoading("");
          }
        } else {
          setToaster({
            variant: "danger",
            message: `terjadi kesalahan dalam fetching data ${result.data.message}`,
          });
          setIsLoading("");
        }
      } catch (error) {
        setToaster({
          variant: "danger",
          message: `Data Error! ${error}`,
        });
        setIsLoading("");
      }
    }
  };

  return (
    <SaLayout>
      <div className="grid grid-cols-2 gap-2">
        <div className="shadow-md rounded-md  p-2">
          <h3 className="mb-4">Cetak Laporan Transaksi</h3>
          <FilterLaporanTransaksi
            getAllTransaksi={getAllTransaksi}
            setToaster={setToaster}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>
      </div>
    </SaLayout>
  );
};

export default LaporanCetak;
