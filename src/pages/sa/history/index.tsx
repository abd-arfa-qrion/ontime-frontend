import HistoryPageView from "@/components/view/sa/History";
import { useSession } from "next-auth/react";
import React from "react";

const SaHistoryPage = ({ setToaster }: any) => {
  const session: any = useSession();
  return <HistoryPageView setToaster={setToaster} session={session} />;
};

export default SaHistoryPage;
