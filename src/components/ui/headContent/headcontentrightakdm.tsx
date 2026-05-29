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
};
const HeadContentRightAkademik = (prop: Proptypes) => {
  const { setAddJadwal, switchBtn, setSwitchBtn } = prop;

  return (
    <div className="flex gap-2">
      <CustomizedSwitches switchBtn={switchBtn} setSwitchBtn={setSwitchBtn} />
      <Button
        variant="outlined"
        sx={{
          textTransform: "none",
          padding: "8px 20px",
          borderRadius: "10px",
        }}
      >
        Download
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
