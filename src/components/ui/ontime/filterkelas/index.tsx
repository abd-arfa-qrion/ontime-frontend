import { Kelas } from "@/type/Kelas.type";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React, { useState } from "react";

type Proptype = {
  kelasData: Kelas[];
  handleFilterbyKelas: (kelas: number | null) => void;
  switchBtn: string;
};

const FilterKelas = (prop: Proptype) => {
  const { kelasData, handleFilterbyKelas, switchBtn } = prop;

  // default = ALL
  const [selectedOption, setSelectedOption] = useState<string>("all");

  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedOption(value);

    if (value === "all") {
      handleFilterbyKelas(null); // kirim null = semua data
    } else {
      handleFilterbyKelas(Number(value));
    }
  };

  return (
    <FormControl
      sx={{
        minWidth: 180,

        backgroundColor: "#fff",
        borderRadius: "10px",

        "& .MuiOutlinedInput-root": {
          borderRadius: "10px",
          backgroundColor: "#fff",
        },

        "& .MuiInputLabel-root": {
          backgroundColor: "#fff",
          paddingX: "4px",
        },

        "& .MuiSelect-icon": {
          color: "gray",
        },

        "& .MuiSelect-iconOpen": {
          transform: "rotate(0deg)",
          color: "var(--primary-color)",
        },
      }}
      size="small"
    >
      <InputLabel id="filter-kelas-label">Kelas</InputLabel>

      <Select
        disabled={switchBtn !== "list"}
        labelId="filter-kelas-label"
        value={selectedOption}
        label="Kelas"
        onChange={handleChange}
      >
        {/* 🔥 OPTION ALL */}
        <MenuItem value="all">Semua Kelas</MenuItem>

        {kelasData.map((option) => (
          <MenuItem key={option.id} value={option.id.toString()}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterKelas;
