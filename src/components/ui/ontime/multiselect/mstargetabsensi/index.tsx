import React from "react";
import { Autocomplete, TextField, Chip } from "@mui/material";
import { TargetAbsensi } from "@/type/TargetAbsensi.type";

type Props = {
  error?: string;
  required?: boolean;
  label?: string;
  placeholder?: string;
  className?: string;
  options: TargetAbsensi[];
  value: (number | string)[];
  onChange: (value: (number | string)[]) => void;
};

export default function MSSTargetAbsensi({
  label = "Pilih Data",
  placeholder = "Cari...",
  className = "",
  required = false,
  error = "",
  options,
  value,
  onChange,
}: Props) {
  const selectedOptions = options.filter((opt) => value.includes(opt.id));

  return (
    <Autocomplete
      aria-required={required}
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
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error === "target"} // ⬅️ penting
          helperText={error === "target" ? "Target wajib dipilih" : ""}
        />
      )}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      fullWidth
    />
  );
}
