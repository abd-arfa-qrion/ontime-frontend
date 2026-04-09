import React from "react";
import { Autocomplete, TextField, Chip } from "@mui/material";
import { TargetAbsensi } from "@/type/TargetAbsensi.type";

type Props = {
  label?: string;
  placeholder?: string;
  className?: string;
  options: TargetAbsensi[];
  value: (number | string)[];
  onChange: (value: (number | string)[]) => void;
};

export default function MSSTargetPengumuman({
  label = "Pilih Data",
  placeholder = "Cari...",
  className = "",
  options,
  value,
  onChange,
}: Props) {
  const selectedOptions = options.filter((opt) => value.includes(opt.id));

  return (
    <Autocomplete
      className={className}
      multiple
      options={options}
      getOptionLabel={(option) => option.target}
      value={selectedOptions}
      onChange={(event, newValue) => {
        const ids = newValue.map((item) => item.id);
        onChange(ids);
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            label={option.target}
            {...getTagProps({ index })}
            key={option.id}
          />
        ))
      }
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} />
      )}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      fullWidth
    />
  );
}
