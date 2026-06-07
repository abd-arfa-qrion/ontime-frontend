import { Button } from "@mui/material";
import React, { useState } from "react";
import FilterTahunAjaran from "../ontime/filtertahunajaran";

type Proptypes = {
  statusPublish: string;
  setStatusPublish: React.Dispatch<React.SetStateAction<string>>;
  setAddPengumuman: React.Dispatch<React.SetStateAction<boolean>>;
};
const HeadContentRightPengumuman = (prop: Proptypes) => {
  const { statusPublish, setStatusPublish, setAddPengumuman } = prop;

  const handleClick = (jenis: string) => {
    setStatusPublish(jenis);
  };
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => handleClick("publish")}
        variant={statusPublish === "publish" ? "contained" : "outlined"}
        sx={{
          textTransform: "none",
          padding: "8px 20px",
          borderRadius: "10px",
          color: statusPublish === "publish" ? "#fff" : "var(--primary-color)",
          backgroundColor:
            statusPublish === "publish" ? "var(--primary-color)" : "#ffffff",
          borderColor: "var(--primary-color)",
          "&:hover": {
            backgroundColor:
              statusPublish === "publish"
                ? "var(--primary-color)"
                : "var(--secondary-color)",
            borderColor: "var(--primary-color)",
            cursor: statusPublish === "publish" ? "default" : "pointer",
          },
        }}
      >
        Disiarkan
      </Button>
      {/* <Button
        onClick={() => handleClick("draft")}
        variant={statusPublish === "draft" ? "contained" : "outlined"}
        sx={{
          textTransform: "none",
          padding: "8px 20px",
          borderRadius: "10px",
          color: statusPublish === "draft" ? "#fff" : "var(--primary-color)",
          backgroundColor:
            statusPublish === "draft" ? "var(--primary-color)" : "#ffffff",
          borderColor: "var(--primary-color)",
          "&:hover": {
            backgroundColor:
              statusPublish === "draft"
                ? "var(--primary-color)"
                : "var(--secondary-color)",
            borderColor: "var(--primary-color)",
            cursor: statusPublish === "draft" ? "default" : "pointer",
          },
        }}
      >
        Draft
      </Button> */}
      <Button
        onClick={() => handleClick("schedule")}
        variant={statusPublish === "schedule" ? "contained" : "outlined"}
        sx={{
          textTransform: "none",
          padding: "8px 20px",
          borderRadius: "10px",
          color: statusPublish === "schedule" ? "#fff" : "var(--primary-color)",
          backgroundColor:
            statusPublish === "schedule" ? "var(--primary-color)" : "#ffffff",
          borderColor: "var(--primary-color)",
          "&:hover": {
            backgroundColor:
              statusPublish === "schedule"
                ? "var(--primary-color)"
                : "var(--secondary-color)",
            borderColor: "var(--primary-color)",
            cursor: statusPublish === "schedule" ? "default" : "pointer",
          },
        }}
      >
        Terjadwal
      </Button>

      <Button
        onClick={() => setAddPengumuman(true)}
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
        Buat Pengumuman +
      </Button>

      {/* <FilterTahunAjaran /> */}
    </div>
  );
};

export default HeadContentRightPengumuman;
