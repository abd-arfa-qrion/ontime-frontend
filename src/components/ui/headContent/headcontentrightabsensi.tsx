import { Button } from "@mui/material";
import React from "react";
import FilterTahunAjaran from "../ontime/filtertahunajaran";
import { useRouter } from "next/router";

type Proptype = {
  jenisAbsensi: string;
  setJenisAbsensi: React.Dispatch<React.SetStateAction<string>>;
};
const HeadContentRightAbsensi = (prop: Proptype) => {
  const { jenisAbsensi, setJenisAbsensi } = prop;
  const router = useRouter();

  const handleClick = (jenis: string) => {
    setJenisAbsensi(jenis);
    router.push(`?tab=${jenis}`);
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => handleClick("masuk")}
        variant={jenisAbsensi === "masuk" ? "contained" : "outlined"}
        sx={{
          fontSize: "12px",
          padding: "8px 20px",
          borderRadius: "10px",
          color: jenisAbsensi === "masuk" ? "#fff" : "var(--primary-color)",
          backgroundColor:
            jenisAbsensi === "masuk" ? "var(--primary-color)" : "transparent",
          borderColor: "var(--primary-color)",
          "&:hover": {
            backgroundColor:
              jenisAbsensi === "masuk"
                ? "var(--primary-color)"
                : "var(--secondary-color)",
            borderColor: "var(--primary-color)",
            cursor: jenisAbsensi === "masuk" ? "default" : "pointer",
          },
        }}
      >
        Absen Masuk Kantor
      </Button>
      <Button
        onClick={() => handleClick("umum")}
        variant={jenisAbsensi === "umum" ? "contained" : "outlined"}
        sx={{
          fontSize: "12px",
          padding: "8px 20px",
          borderRadius: "10px",
          color: jenisAbsensi === "umum" ? "#fff" : "var(--primary-color)",
          backgroundColor:
            jenisAbsensi === "umum" ? "var(--primary-color)" : "transparent",
          borderColor: "var(--primary-color)",
          "&:hover": {
            backgroundColor:
              jenisAbsensi === "umum"
                ? "var(--primary-color)"
                : "var(--secondary-color)",
            borderColor: "var(--primary-color)",
            cursor: jenisAbsensi === "umum" ? "default" : "pointer",
          },
        }}
      >
        Absen Umum
      </Button>
      <Button
        onClick={() => handleClick("pelajaran")}
        variant={jenisAbsensi === "pelajaran" ? "contained" : "outlined"}
        sx={{
          fontSize: "12px",
          padding: "8px 20px",
          borderRadius: "10px",
          color: jenisAbsensi === "pelajaran" ? "#fff" : "var(--primary-color)",
          backgroundColor:
            jenisAbsensi === "pelajaran"
              ? "var(--primary-color)"
              : "transparent",
          borderColor: "var(--primary-color)",
          "&:hover": {
            backgroundColor:
              jenisAbsensi === "pelajaran"
                ? "var(--primary-color)"
                : "var(--secondary-color)",
            borderColor: "var(--primary-color)",
            cursor: jenisAbsensi === "pelajaran" ? "default" : "pointer",
          },
        }}
      >
        Absen Pelajaran
      </Button>
      <FilterTahunAjaran />
    </div>
  );
};

export default HeadContentRightAbsensi;
