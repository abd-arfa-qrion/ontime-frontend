import LaporanCetak from "@/components/view/admin/Laporan";
import { useSession } from "next-auth/react";
import React from "react";

const LaporanPage = ({ setToaster }: any) => {
  const session: any = useSession();
  return <LaporanCetak setToaster={setToaster} />;
};

export default LaporanPage;
