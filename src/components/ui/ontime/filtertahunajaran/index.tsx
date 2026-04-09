import CalendarIcon from "@/components/icons/CalendarIcon";
import { CalendarMonthRounded } from "@mui/icons-material";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React, { useState } from "react";
const options = [
  { value: "0", label: "2024/2024" },
  { value: "1", label: "2025/2026" },
  { value: "2", label: "2026/2027" },
];
const FilterTahunAjaran = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedOption(event.target.value);
  };
  return (
    <FormControl
      sx={{
        minWidth: 180,
        "& .MuiOutlinedInput-root": {
          borderRadius: "10px",
        },
        "& .MuiSelect-icon": {
          color: "gray-800",
        },
        "& .MuiSelect-iconOpen": {
          transform: "rotate(0deg)",
          color: "var(--primary-color)",
        },
      }}
      size="small"
    >
      <InputLabel id="demo-simple-select-label" className="rounded-[10px]">
        Tahun Ajaran
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={selectedOption}
        label="Options"
        onChange={handleChange}
        IconComponent={CalendarMonthRounded}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterTahunAjaran;
