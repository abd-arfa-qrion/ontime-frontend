"use client";

import { useState } from "react";
import { HexColorPicker } from "react-colorful";

interface Props {
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPickerField({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-gray-700">
        Pilih Warna lain
      </label>

      {/* input preview */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 border border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:border-blue-500 transition"
      >
        <div
          className="w-6 h-6 rounded border"
          style={{ backgroundColor: value }}
        />

        <span className="text-sm">{value}</span>
      </div>

      {/* picker */}
      {open && (
        <div className="mt-3">
          <HexColorPicker color={value} onChange={onChange} />
        </div>
      )}
    </div>
  );
}
