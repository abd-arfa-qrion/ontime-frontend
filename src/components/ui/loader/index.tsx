import React from "react";

type LoaderProps = {
  size?: number;
  color?: string;
  align?: string;
};

const Loader = ({ size = 20, color = "#000", align = "left" }: LoaderProps) => {
  return (
    <div className={`w-full text-${align}`}>
      <p
        className="loader"
        style={
          {
            "--loader-size": `${size}px`,
            "--loader-color": color,
          } as React.CSSProperties
        }
      />
    </div>
  );
};

export default Loader;
