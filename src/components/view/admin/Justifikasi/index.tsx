import AdminLayout from "@/components/layout/AdminLayout";
import HeadContent from "@/components/ui/headContent/headcontent";
import HeadContentRightJustifikasi from "@/components/ui/headContent/headcontentrightjustifikasi";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  setToaster: Dispatch<SetStateAction<{}>>;
  session: any;
};
const JustifikasiPageView = (prop: Props) => {
  const { setToaster, session } = prop;
  return (
    <AdminLayout>
      <div>
        <div className="bagian-head-content flex justify-between items-center">
          <HeadContent text="Justifikasi" />
          <HeadContentRightJustifikasi />
        </div>
        <div></div>
      </div>
    </AdminLayout>
  );
};

export default JustifikasiPageView;
