import ResumePenjualan from "@/components/ui/chart/multibarchart/admin/ResumePenjualan";
import PieTidakHadir from "@/components/ui/chart/piechart";
import { Resume7Hari, Resume7HariTidakhadir } from "@/type/Dashboard.type";
import { Card } from "@mui/material";
import React from "react";

type Proptype = {
  loadingFetch: boolean;
  dataResume7Hari: Resume7Hari[];
  dataResume7HariTidakhadir: Resume7HariTidakhadir[];
};
const DashboardChart = (prop: Proptype) => {
  const { loadingFetch, dataResume7Hari, dataResume7HariTidakhadir } = prop;
  return (
    <div className="flex gap-5 flex-wrap md:flex-nowrap">
      <Card className="p-3 flex-[2] rounded-lg">
        <ResumePenjualan
          title="Ringkasan Kehadiran Siswa"
          data={dataResume7Hari}
        />
      </Card>

      <Card className="p-3 flex-[1] rounded-lg">
        <PieTidakHadir
          title="Ringkasan Siswa Tidak Hadir"
          data={dataResume7HariTidakhadir}
        />
      </Card>
    </div>
  );
};

export default DashboardChart;
