import Sidebar from "@/components/fragments/sidebar";
import React from "react";
import styles from "./AdminLayout.module.scss";
import Appbar from "@/components/fragments/appbar";
import AdminFooter from "@/components/fragments/adminfooter";
import {
  IconDashboard,
  IconBookrak,
  IconCalendar,
  IconBook,
  IconGear,
  IconAnnounce,
  IconReport,
  IconClean,
  IconSearchMenu,
} from "@/components/icons";

type Proptypes = {
  children: React.ReactNode;
};

const listSidebarItems = [
  {
    title: "Your Plan",
    url: "/newncil",
    ref: "/newncil",
    icon: IconDashboard,
  },
];
const NewncilLayout = (props: Proptypes) => {
  const { children } = props;
  return (
    <div className={styles.admin}>
      <Sidebar list={listSidebarItems} />
      <div className={styles.admin__content}>
        <Appbar />
        <div className={styles.admin__content__cdata}>{children}</div>
        <AdminFooter />
      </div>
    </div>
  );
};

export default NewncilLayout;
