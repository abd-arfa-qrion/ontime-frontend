import { Button } from "@mui/material";
import React from "react";
import FilterTahunAjaran from "../ontime/filtertahunajaran";

const HeadContentRightJustifikasi = () => {
  return (
    <div className="flex gap-2">
      <FilterTahunAjaran />
    </div>
  );
};

export default HeadContentRightJustifikasi;
