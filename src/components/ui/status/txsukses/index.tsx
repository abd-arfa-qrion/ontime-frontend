import React from "react";
type Proptypes = {
  text?: string;
};
const TxSukses = (props: Proptypes) => {
  const { text } = props;
  return (
    <div className="text-white bg-green-600 p-1 border rounded-md text-center max-w-10">
      {text ? text : <i className="bx bx-check text-xl font-bold"></i>}
    </div>
  );
};

export default TxSukses;
