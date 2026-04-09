import Sidebar from "@/components/fragments/sidebar";
import React from "react";
import styles from "./SaLayout.module.scss";
import { encrypt } from "@/utils/secureUrl";
import Appbar from "@/components/fragments/appbar";
import AdminFooter from "@/components/fragments/adminfooter";

type Proptypes = {
  children: React.ReactNode;
};

const listSidebarItems = [
  {
    title: "Home",
    url: `/sa`,
    ref: "/sa",
    icon: "bxs-dashboard",
  },
  {
    title: "Perusahaan",
    url: "/sa/perusahaan",
    ref: "/sa/perusahaan",
    icon: "bxs-institution",
  },
  {
    title: "Instansi",
    url: "/sa/instansi",
    ref: "/sa/instansi",
    icon: "bxs-store-alt",
  },
  {
    title: "Users",
    url: "/sa/users",
    ref: "/sa/users",
    icon: "bxs-group",
  },
  {
    title: "Wewenang User",
    url: "/sa/roleuser",
    ref: "/sa/roleuser",
    icon: "bxs-user-check",
  },
  {
    title: "Transaksi",
    url: "/sa/transaksi",
    ref: "/sa/transaksi",
    icon: "bx-transfer-alt",
  },
  {
    title: "History",
    url: "/sa/history",
    ref: "/sa/history",
    icon: "bx-history",
  },
  {
    title: "Laporan",
    url: "/sa/laporan",
    ref: "/sa/laporan",
    icon: "bxs-book-alt",
  },
  {
    title: "Renotif",
    url: "",
    ref: "/sa/renotif",
    icon: "bx-user-pin",
    li: [
      {
        title: "Backdate",
        url: "/sa/renotif/backdate",
        ref: "/sa/renotif/backdate",
        icon: "bx-list-ul",
      },
    ],
  },
];
const SaLayout = (props: Proptypes) => {
  const { children } = props;
  return (
    <div className="flex flex-col">
      <div className={styles.admin}>
        <Sidebar list={listSidebarItems} />
        <div className={styles.admin__content}>
          <Appbar list={listSidebarItems} />
          <div className={styles.admin__content__cdata}>{children}</div>
          <AdminFooter />
        </div>
      </div>
    </div>
  );
};

export default SaLayout;
