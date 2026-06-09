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
          minWidth: "150px",
          boxShadow: "none",
          textTransform: "none",
          padding: "8px 20px",
          borderRadius: "10px",
          color: tabActive === "siswa" ? "#fff" : "var(--primary-color)",
          background:
            tabActive === "siswa" ? "var(--gradient-primary)" : "#ffffff",
          borderColor: "var(--primary-color)",
          "&:hover": {
            background:
              tabActive === "siswa"
                ? "var(--gradient-primary)"
                : "var(--secondary-color)",
            borderColor: "var(--primary-color)",
            color: "#fff",
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
          minWidth: "150px",
          boxShadow: "none",
          textTransform: "none",
          padding: "8px 20px",
          borderRadius: "10px",
          color: tabActive === "guru" ? "#fff" : "var(--primary-color)",
          background:
            tabActive === "guru" ? "var(--gradient-primary)" : "#ffffff",
          borderColor: "var(--primary-color)",
          "&:hover": {
            background:
              tabActive === "guru"
                ? "var(--gradient-primary)"
                : "var(--secondary-color)",
            borderColor: "var(--primary-color)",
            color: "#fff",
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
