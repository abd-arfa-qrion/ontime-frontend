import React from "react";
type Proptype = {
  text: string;
};
const HeadContent = (prop: Proptype) => {
  const { text } = prop;
  return (
    <div className="mb-5 mt-2">
      <h2>{text}</h2>
      <span className="text-sm text-gray-400">Home / {text}</span>
    </div>
  );
};

export default HeadContent;
