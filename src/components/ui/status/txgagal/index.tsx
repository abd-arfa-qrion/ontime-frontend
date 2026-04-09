import React from "react";
type Proptypes = {
  text?: string;
};
const TxGagal = (props: Proptypes) => {
  const { text } = props;
  return (
    <div className="text-white bg-red-800 p-2 border rounded-md text-center max-w-10">
      {text ? text : <i className="bx bx-x text-xl font-bold"></i>}
    </div>
  );
};

export default TxGagal;
