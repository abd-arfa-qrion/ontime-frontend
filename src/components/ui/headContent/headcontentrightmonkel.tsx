import React, { Dispatch, SetStateAction, useState } from "react";
import FilterTahunAjaran from "../ontime/filtertahunajaran";
import FilterKelas from "../ontime/filterkelas";
import { Kelas, MonitoringKelas } from "@/type/Kelas.type";

type Proptype = {
  kelasData: Kelas[];
  setKelasData: Dispatch<SetStateAction<Kelas[]>>;
  handleFilterbyKelas: (kelas: number | null) => void;
};
const HeadContentRightMonkel = (prop: Proptype) => {
  const { kelasData, setKelasData, handleFilterbyKelas } = prop;

  return (
    <div className="flex gap-2">
      <FilterKelas
        kelasData={kelasData}
        handleFilterbyKelas={handleFilterbyKelas}
        switchBtn="list"
      />
      {/* <FilterTahunAjaran /> */}
    </div>
  );
};

export default HeadContentRightMonkel;
