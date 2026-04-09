import { JadwalAkademik } from "@/type/Jadwalakademik.type";
import { Kelas } from "@/type/Kelas.type";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";

type Proptype = {
  kelasData: Kelas[];
  handleFilterbyKelas: (kelas: number) => void;
  switchBtn: string;
};
const FilterKelas = (prop: Proptype) => {
  const { kelasData, handleFilterbyKelas, switchBtn } = prop;
  const [selectedOption, setSelectedOption] = useState("");
  const handleChange = async (event: SelectChangeEvent<string>) => {
    setSelectedOption(event.target.value);
    const idKelas = Number(event.target.value);
    console.log(event.target.value);
    await handleFilterbyKelas(idKelas);
  };
  return (
    <FormControl
      sx={{
        minWidth: 180,
        "& .MuiOutlinedInput-root": {
          borderRadius: "10px",
        },
      }}
      size="small"
    >
      <InputLabel id="demo-simple-select-label" className="rounded-[10px]">
        Kelas
      </InputLabel>
      <Select
        disabled={switchBtn !== "list"}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={selectedOption}
        label="Options"
        onChange={handleChange}
      >
        {kelasData.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterKelas;
