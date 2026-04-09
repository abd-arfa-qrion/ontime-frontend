import { BorderColor } from "@mui/icons-material";
import React from "react";
type Props = {
  onClick?: () => void;
};
const EditBtn = (prop: Props) => {
  const { onClick } = prop;
  return (
    <div onClick={onClick}>
      <div
        className="
      inline-flex
      items-center
      justify-center
      border
      border-[var(--primary-color)]
      p-1
      rounded-md
      cursor-pointer
      transition-all
      duration-200
      hover:bg-gray-100
      hover:scale-110
      active:scale-95
    "
      >
        <BorderColor className="text-[var(--primary-color)] text-sm" />
      </div>
    </div>
  );
};

export default EditBtn;
