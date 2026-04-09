import SaDashboardView from "@/components/view/sa/Dashboard";
import { useSession } from "next-auth/react";
import React from "react";

const SaPage = ({ setToaster }: any) => {
  return <SaDashboardView setToaster={setToaster} />;
};

export default SaPage;
