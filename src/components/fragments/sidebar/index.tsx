import { useRouter } from "next/router";
import styles from "./Sidebar.module.scss";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import type { ComponentType } from "react";
import Button from "@/components/ui/button";
import { ArrowBackIos, LogoutOutlined } from "@mui/icons-material";

/* =========================
   TYPES
========================= */

type IconProps = {
  fontSize?: number;
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

/* =========================
   HOOK: DETECT MOBILE
========================= */

const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};

/* =========================
   COMPONENT
========================= */

const Sidebar = ({ list }: Proptypes) => {
  const isMobile = useIsMobile();
  const { pathname } = useRouter();
  const session: any = useSession();

  const [isLoading, setIsLoading] = useState(false);

  const [klikMenu, setKlikMenu] = useState<Record<string, boolean>>({});

  const pathParts = pathname.split("/").filter(Boolean);
  const pathName =
    pathParts.length >= 2
      ? `/${pathParts[0]}/${pathParts[1]}`
      : `/${pathParts[0]}`;
  const urlQms = process.env.NEXT_PUBLIC_QMS_BASEURL;

  const handleClick = (ref: string) => {
    setKlikMenu((prev) => ({
      ...prev,
      [ref]: !prev[ref],
    }));
  };

  useEffect(() => {
    list.forEach((item) => {
      if (item.li && pathName.includes(item.ref)) {
        setKlikMenu((prev) => ({
          ...prev,
          [item.ref]: true,
        }));
      }
    });
  }, [pathName, list]);

  const handleSignout = async () => {
    setIsLoading(true);
    const callbackUrl =
      process.env.NEXT_PUBLIC_NEXTAUTH_URL +
      "/" +
      window.location.pathname.slice(1);

    setTimeout(async () => {
      const result = await signOut({ callbackUrl });

      setIsLoading(false);
    }, 500);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar__top}>
        {/* LOGO */}
        <div className={styles.sidebar__top__logo}>
          <div className={styles.sidebar__top__logo__kiri}>
            {isMobile ? (
              <div className="flex gap-1 mt-5">
                <div className="bg-primary rounded-xl w-3 h-3" />
                <div className="bg-secondary rounded-xl w-3 h-3" />
                <div className="bg-tird rounded-xl w-3 h-3" />
              </div>
            ) : (
              <Image
                src="/assets/logo/logo.svg"
                width={180}
                height={50}
                loading="lazy"
                alt="logo"
              />
            )}
          </div>
        </div>

        {/* MENU */}
        <div className={styles.sidebar__top__list}>
          {list.map((lis, index) => {
            const Icon = lis.icon;

            return (
              <React.Fragment key={index}>
                {/* DROPDOWN ITEM */}
                {lis.li ? (
                  <button
                    type="button"
                    className={`${styles.sidebar__top__list__itemDD} ${
                      pathName === lis.ref
                        ? styles.sidebar__top__list__itemDD__active
                        : ""
                    }`}
                    onClick={() => handleClick(lis.ref)}
                  >
                    <Icon fontSize={25} />

                    <p className={styles.sidebar__top__list__itemDD__title}>
                      {lis.title}
                      <span className="ml-auto">
                        {klikMenu[lis.ref] ? "▲" : "▼"}
                      </span>
                    </p>
                  </button>
                ) : (
                  /* NORMAL ITEM */
                  <Link
                    href={lis.url}
                    className={`${styles.sidebar__top__list__item} ${
                      pathName === lis.ref
                        ? styles.sidebar__top__list__item__active
                        : ""
                    }`}
                  >
                    <Icon fontSize={25} />
                    <p className={styles.sidebar__top__list__item__title}>
                      {lis.title}
                    </p>
                  </Link>
                )}

                {/* SUB MENU */}
                {lis.li &&
                  klikMenu[lis.ref] &&
                  lis.li.map((sub, subIndex) => {
                    const SubIcon = sub.icon;

                    return (
                      <Link
                        href={sub.url}
                        key={`${index}-${subIndex}`}
                        className={`${styles.sidebar__top__list__itemli} ${
                          pathname === sub.ref
                            ? styles.sidebar__top__list__itemli__active
                            : ""
                        }`}
                      >
                        <SubIcon
                          fontSize={16}
                          className={styles.sidebar__top__list__itemli_icon}
                        />
                        <p className={styles.sidebar__top__list__itemli_title}>
                          {sub.title}
                        </p>
                      </Link>
                    );
                  })}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className={styles.sidebar__bottom}>
        <Link
          href={`${urlQms}/token-login?token=${session.data?.accessToken}`}
          className="w-full text-white font-semibold [background:var(--gradient-primary)] hover:[background:var(--primary-color)] p-3 border rounded-md text-center underline-none"
        >
          <ArrowBackIos /> {isLoading ? "Loading..." : "Login to QMS"}
        </Link>

        <Button
          type="button"
          onClick={() => handleSignout()}
          variant="primary"
          disabled={isLoading}
        >
          {" "}
          <LogoutOutlined /> {isLoading ? "Loading..." : "LOGOUT"}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
