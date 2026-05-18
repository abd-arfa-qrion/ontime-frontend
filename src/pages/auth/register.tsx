import RegisterView from "@/components/view/auth/Register";
import { PositionPegawai } from "@/type/Position.type";
import React, { useEffect, useState } from "react";

const Register = ({ setToaster }: any) => {
  const [dataPosition, setDataPosition] = useState<PositionPegawai[]>([]);

  const getAllPosition = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ONTUITION_BASEURL}/api/m-positions`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const result = await res.json();
      setDataPosition(result);
      console.log("ini data posision: ", result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllPosition();
  }, []);
  return <RegisterView setToaster={setToaster} dataPosition={dataPosition} />;
};

export default Register;
