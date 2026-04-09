import React from "react";
import { Autocomplete, TextField, Chip } from "@mui/material";
import { MethodeAbsensi } from "@/type/MethodeAbsensi.type";

type Props = {
  error?: string;
  required?: boolean;
  label?: string;
  placeholder?: string;
  className?: string;
  options: MethodeAbsensi[];
  value: (number | string)[];
  onChange: (value: (number | string)[]) => void;
};

export default function MSSMethodeAbsensi({
  label = "Pilih Data",
  placeholder = "Cari...",
  className = "",
  options,
  error = "",
  value,
  required = false,
  onChange,
}: Props) {
  const selectedOptions = options.filter((opt) => value.includes(opt.id));

  return (
    <Autocomplete
      aria-required={required}
      className={className}
      multiple
      options={options}
      getOptionLabel={(option) => option.methode}
      value={selectedOptions}
      onChange={(event, newValue) => {
        const ids = newValue.map((item) => item.id);
        onChange(ids);
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            label={option.methode}
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
          error={error === "methode"} // ⬅️ penting
          helperText={error === "methode" ? "Methode wajib dipilih" : ""}
        />
      )}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      fullWidth
    />
  );
}
