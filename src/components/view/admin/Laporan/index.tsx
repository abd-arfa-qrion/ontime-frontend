import { ButtonLoading, ButtonLoadingDefault } from "@/type/Buttonloading.type";
import { useSession } from "next-auth/react";
import React, { Dispatch, SetStateAction, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import { renderToString } from "react-dom/server";
import ExportDataTransaksiTemplate from "@/components/ui/laporan/TempalteExcel/LapTransaksi";
import AdminLayout from "@/components/layout/AdminLayout";

type Proptype = { setToaster: Dispatch<SetStateAction<{}>> };
const LaporanCetak = (props: Proptype) => {
  const { setToaster } = props;
  const session: any = useSession();
  const [isLoading, setIsLoading] = useState("");

  const exportToExcel = (data: any[], fileName: string, template: string) => {
    // Render komponen menjadi HTML string
    const htmlString = renderToString(
      <ExportDataTransaksiTemplate data={data} />,
    );

    // Konversi HTML string menjadi worksheet
    const worksheet = XLSX.utils.table_to_sheet(
      new DOMParser()
        .parseFromString(htmlString, "text/html")
        .querySelector("table"),
    );

    // Buat workbook dan tambahkan worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, template);

    // Simpan file
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <AdminLayout>
      <div className="grid grid-cols-2 gap-2">tes</div>
    </AdminLayout>
  );
};

export default LaporanCetak;
