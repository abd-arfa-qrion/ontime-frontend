import React from "react";
import Select from "@/components/ui/select";

type Props = {
  name?: string;
};

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));

const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);

const TimePicker = (prop: Props) => {
  const { name } = prop;
  return (
    <div className="flex gap-2 items-center">
      <Select
        className="w-full mb-4"
        label="Jam"
        name={`jam-${name}`}
        options={
          hours &&
          hours.map((jam) => ({
            value: jam,
            label: jam,
          }))
        }
      />
      <p>:</p>
      <Select
        className="w-full mb-4"
        label="Menit"
        name={`menit-${name}`}
        options={
          minutes &&
          minutes.map((mnt) => ({
            value: mnt,
            label: mnt,
          }))
        }
      />
    </div>
  );
};

export default TimePicker;
