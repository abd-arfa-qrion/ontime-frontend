import Sidebar from "@/components/fragments/sidebar";
import React from "react";
import styles from "./SaLayout.module.scss";
import Appbar from "@/components/fragments/appbar";
import AdminFooter from "@/components/fragments/adminfooter";
import { IconDashboard, IconReport } from "@/components/icons";

type Proptypes = {
  children: React.ReactNode;
};

const listSidebarItems = [
  {
    title: "Home",
    url: `/sa`,
    ref: "/sa",
    icon: IconDashboard,
  },
  {
    title: "Laporan",
    url: "/sa/laporan",
    ref: "/sa/laporan",
    icon: IconReport,
  },
];
const SaLayout = (props: Proptypes) => {
  const { children } = props;
  return (
    <div className="flex flex-col">
      <div className={styles.admin}>
        <Sidebar list={listSidebarItems} />
        <div className={styles.admin__content}>
          <Appbar />
          <div className={styles.admin__content__cdata}>{children}</div>
          <AdminFooter />
        </div>
      </div>
    </div>
  );
};

export default SaLayout;
