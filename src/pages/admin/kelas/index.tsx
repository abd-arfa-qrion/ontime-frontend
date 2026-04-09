import KelasPageView from "@/components/view/admin/Kelas";
import { useSession } from "next-auth/react";
import React from "react";

const AdminKelasPage = ({ setToaster }: any) => {
  const session: any = useSession();
  return <KelasPageView setToaster={setToaster} session={session} />;
};

export default AdminKelasPage;
