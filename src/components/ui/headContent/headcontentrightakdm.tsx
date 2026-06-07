import { Button } from "@mui/material";
import React from "react";
import FilterTahunAjaran from "../ontime/filtertahunajaran";
import CustomizedSwitches from "../ontime/swithbutton";

type Proptypes = {
  switchBtn: string;
  setSwitchBtn: React.Dispatch<React.SetStateAction<string>>;
  setAddJadwal: React.Dispatch<React.SetStateAction<boolean>>;
  filterTA: string;
  setFilterTA: React.Dispatch<React.SetStateAction<string>>;
  handleDownload: () => void;
  exporting?: boolean; // ⬅️ ADD INI
  progress?: number; // ⬅️ ADD INI
};
const HeadContentRightAkademik = (prop: Proptypes) => {
  const {
    setAddJadwal,
    switchBtn,
    setSwitchBtn,
    handleDownload,
    exporting = false,
    progress = 0,
  } = prop;

  return (
    <div className="flex gap-2">
      <CustomizedSwitches switchBtn={switchBtn} setSwitchBtn={setSwitchBtn} />
      <Button
        variant="outlined"
        className={`
          px-4 py-2 rounded-lg border border-green-600 text-green-600 transition
          ${exporting ? "bg-gray-400 cursor-not-allowed" : "bg-white hover:bg-green-100 hover:border-green-200"}
        `}
        sx={{
          textTransform: "none",
          padding: "8px 20px",
          borderRadius: "10px",
        }}
        onClick={() => handleDownload()}
        disabled={exporting}
      >
        {exporting ? `Generating... ${progress}%` : "Download"}
      </Button>

      <Button
        onClick={() => setAddJadwal(true)}
        variant="contained"
        sx={{
          py: 1,
          background: "var(--gradient-primary)",
          textTransform: "none",
          boxShadow: "none",
          borderRadius: "10px",

          "&:hover": {
            background: "var(--gradient-primary)",
            filter: "brightness(1.05)",
            boxShadow: "none",
          },
        }}
      >
        Tambah Agenda +
      </Button>

      <FilterTahunAjaran
        filterTA={prop.filterTA}
        setFilterTA={prop.setFilterTA}
      />
    </div>
  );
};

export default HeadContentRightAkademik;
