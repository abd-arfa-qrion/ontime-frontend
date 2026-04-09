"use client";

import React from "react";
import { Autocomplete, TextField } from "@mui/material";

type OptionType = {
  label: string;
  value: number | string;
};

type Props = {
  label?: string;
  options: OptionType[];
  value: OptionType | null;
  onChange: (value: OptionType | null) => void;
  placeholder?: string;
};

export default function SearchSelect({
  label,
  options,
  value,
  onChange,
  placeholder,
}: Props) {
  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={(event, newValue) => onChange(newValue)}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, val) => option.value === val.value}
      fullWidth
      size="small"
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} />
      )}
    />
  );
}
