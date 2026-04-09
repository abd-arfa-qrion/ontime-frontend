import InstansiPageView from "@/components/view/sa/Instansi";
import instansiServices from "@/services/instansi";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";

const SaInstansiPage = ({ setToaster }: any) => {
  const [instansis, setInstansis] = useState([]);
  const session: any = useSession();

  const getAllInstansi = useCallback(async () => {
    try {
      const { data } = await instansiServices.getAllInstansi(
        session.data?.accessToken
      );
      if (data.status_code !== 200) {
        setToaster({
          variant: "danger",
          message: "Data Instansi gagal!",
        });
      }
      setToaster({
        variant: "success",
        message: "Data Instansi berhasil!",
      });
      setInstansis(data.data);
    } catch (error) {
      setToaster({
        variant: "danger",
        message: "Data Instansi gagal!",
      });
    }
    // console.log(session)
  }, [session.data?.accessToken, setToaster, setInstansis]);

  useEffect(() => {
    if (session.status === "authenticated") {
      getAllInstansi();
    }
  }, [getAllInstansi, session.status]);

  return (
    <InstansiPageView
      instansis={instansis}
      setToaster={setToaster}
      session={session}
    />
  );
};
export default SaInstansiPage;
