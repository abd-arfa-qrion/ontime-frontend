import JustifikasiPageView from "@/components/view/admin/Justifikasi";
import { useSession } from "next-auth/react";
import React from "react";

const JustifikasiPage = ({ setToaster }: any) => {
  const session: any = useSession();

  return <JustifikasiPageView setToaster={setToaster} session={session} />;
};

export default JustifikasiPage;
