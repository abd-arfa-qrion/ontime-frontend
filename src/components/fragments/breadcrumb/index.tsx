import React, { ComponentType } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./Breadcrumb.module.scss";

type IconProps = {
  size?: number;
  className?: string;
};

type SidebarItem = {
  title: string;
  url: string;
  ref: string;
  icon: ComponentType<IconProps>;
  li?: SidebarItem[];
};

type Proptypes = {
  list: SidebarItem[];
};
const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};
const Breadcrumb = (props: Proptypes) => {
  const isMobile = useIsMobile();
  const { list } = props;
  const { pathname } = useRouter();

  // Membagi pathname menjadi segmen-segmen
  const pathParts = pathname.split("/").filter((part) => part !== "");

  // Fungsi untuk mencari title berdasarkan url
  const findTitle = (url: string, items: typeof list): string | null => {
    for (const item of items) {
      if (item.url === url) return item.title;
      if (item.li) {
        const subItem = findTitle(url, item.li);
        if (subItem) return subItem;
      }
    }
    return null;
  };

  // Membuat breadcrumb items berdasarkan pathParts
  const breadcrumbItems = pathParts.map((part, index) => {
    const url = `/${pathParts.slice(0, index + 1).join("/")}`;
    const title = findTitle(url, list) || part;

    // Elemen terakhir: tampilkan sebagai teks
    if (index === pathParts.length - 1) {
      return (
        <span key={index} className={styles.breadcrumb__item}>
          <p>{title}</p>
        </span>
      );
    }

    // Elemen lainnya: tampilkan sebagai link
    return (
      <span key={index} className={styles.breadcrumb__item}>
        <Link href={url}>{title}</Link>
      </span>
    );
  });

  return (
    <>
      {isMobile ? (
        <div></div>
      ) : (
        <nav className={styles.breadcrumb} aria-label="breadcrumb">
          {/* Item pertama (misal: Home atau Dashboard) */}
          {pathParts.length > 0 && (
            <span className={styles.breadcrumb__item}>
              <Link href={`/${pathParts[0]}`}>
                <i className="bx bxs-home mr-1"></i>
              </Link>
            </span>
          )}
          {/* Tambahkan breadcrumb dinamis */}
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <span className={styles.breadcrumb__separator}>
                  <i className="bx bx-chevrons-right"></i>
                </span>
              )}
              {item}
            </React.Fragment>
          ))}
        </nav>
      )}
    </>
  );
};

export default Breadcrumb;
