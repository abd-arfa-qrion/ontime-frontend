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
    title: "Dashboard",
    url: "/admin",
    ref: "/admin",
    icon: IconDashboard,
  },
  {
    title: "Monitoring Kelas",
    url: "/admin/kelas",
    ref: "/admin/kelas",
    icon: IconBookrak,
  },
  {
    title: "Kalender Akademik",
    url: "/admin/akademik",
    ref: "/admin/akademik",
    icon: IconCalendar,
  },
  {
    title: "Manajemen Absensi",
    url: "/admin/absensi",
    ref: "/admin/absensi",
    icon: IconBook,
  },
  {
    title: "Justifikasi",
    url: "/admin/justifikasi",
    ref: "/admin/justifikasi",
    icon: IconSearchMenu,
  },
  {
    title: "Manajemen Piket",
    url: "/admin/piketguru",
    ref: "/admin/piketguru",
    icon: IconClean,
  },
  {
    title: "Laporan",
    url: "/admin/laporan",
    ref: "/admin/laporan",
    icon: IconReport,
  },
  {
    title: "Pengumuman",
    url: "/admin/pengumuman",
    ref: "/admin/pengumuman",
    icon: IconAnnounce,
  },
  {
    title: "Pengaturan",
    url: "/admin/pengaturan",
    ref: "/admin/pengaturan",
    icon: IconGear,
  },
];
const AdminLayout = (props: Proptypes) => {
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

export default AdminLayout;
