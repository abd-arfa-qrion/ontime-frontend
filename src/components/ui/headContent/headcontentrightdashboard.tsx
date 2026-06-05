import { Button } from "@mui/material";
import React from "react";
import FilterTahunAjaran from "../ontime/filtertahunajaran";
import FilterKelas from "../ontime/filterkelas";

type Proptypes = {
  tabActive: string;
  setTabActive: React.Dispatch<React.SetStateAction<string>>;
  kelasData: any;
  selectFilterKelas: (kelas: number | null) => void;
  filterTA: string;
  setFilterTA: React.Dispatch<React.SetStateAction<string>>;
};
const HeadContentRightDashboard = (prop: Proptypes) => {
  const {
    tabActive,
    setTabActive,
    kelasData,
    selectFilterKelas,
    filterTA,
    setFilterTA,
  } = prop;

  const handleClick = (jenis: string) => {
    setTabActive(jenis);
  };
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => handleClick("siswa")}
        variant={tabActive === "siswa" ? "contained" : "outlined"}
        sx={{
          textTransform: "none",
          padding: "8px 20px",
          borderRadius: "10px",
          color: tabActive === "siswa" ? "#fff" : "var(--primary-color)",
          backgroundColor:
            tabActive === "siswa" ? "var(--primary-color)" : "transparent",
          borderColor: "var(--primary-color)",
          "&:hover": {
            backgroundColor:
              tabActive === "siswa"
                ? "var(--primary-color)"
                : "var(--secondary-color)",
            borderColor: "var(--primary-color)",
            cursor: tabActive === "siswa" ? "default" : "pointer",
          },
        }}
      >
        Siswa
      </Button>
      <Button
        onClick={() => handleClick("guru")}
        variant={tabActive === "guru" ? "contained" : "outlined"}
        sx={{
          textTransform: "none",
          padding: "8px 20px",
          borderRadius: "10px",
          color: tabActive === "guru" ? "#fff" : "var(--primary-color)",
          backgroundColor:
            tabActive === "guru" ? "var(--primary-color)" : "transparent",
          borderColor: "var(--primary-color)",
          "&:hover": {
            backgroundColor:
              tabActive === "guru"
                ? "var(--primary-color)"
                : "var(--secondary-color)",
            borderColor: "var(--primary-color)",
            cursor: tabActive === "guru" ? "default" : "pointer",
          },
        }}
      >
        Guru
      </Button>
      {tabActive === "siswa" && (
        <FilterKelas
          kelasData={kelasData}
          handleFilterbyKelas={selectFilterKelas}
          switchBtn="list"
        />
      )}

      <FilterTahunAjaran filterTA={filterTA} setFilterTA={setFilterTA} />
    </div>
  );
};

export default HeadContentRightDashboard;
