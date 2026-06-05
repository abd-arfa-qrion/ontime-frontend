import ResumePenjualan from "@/components/ui/chart/multibarchart/admin/ResumePenjualan";
import PieTidakHadir from "@/components/ui/chart/piechart";
import {
  Resume7Hari,
  Resume7HariGuru,
  Resume7HariTidakhadir,
  Resume7HariTidakhadirGuru,
} from "@/type/Dashboard.type";
import { Card } from "@mui/material";
import React from "react";

type Proptype = {
  loadingFetch: boolean;
  dataResume7HariGuru: Resume7HariGuru[];
  dataResume7HariTidakhadirGuru: Resume7HariTidakhadirGuru[];
};
const DashboardChartGuru = (prop: Proptype) => {
  const { loadingFetch, dataResume7HariGuru, dataResume7HariTidakhadirGuru } =
    prop;
  return (
    <div className="flex gap-5 flex-wrap md:flex-nowrap">
      <Card className="p-3 flex-[2] rounded-lg">
        <ResumePenjualan
          title="Ringkasan Kehadiran Guru"
          data={dataResume7HariGuru}
        />
      </Card>

      <Card className="p-3 flex-[1] rounded-lg">
        <PieTidakHadir
          title="Ringkasan Guru Tidak Hadir"
          data={dataResume7HariTidakhadirGuru}
        />
      </Card>
    </div>
  );
};

export default DashboardChartGuru;
