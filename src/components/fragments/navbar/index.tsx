import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./Navbar.module.scss";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import Tooltips from "@/components/ui/tooltips";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@mui/material";

const Navbar = () => {
  const { data }: any = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // ambil role userSession
  const role = data?.user?.role;
  const name = data?.user?.name;
  const handleClick = async () => {
    setIsLoading(true);
    if (data) {
      await signOut({
        callbackUrl: process.env.NEXTAUTH_URL,
      });
      setIsLoading(false);
    } else {
      await signIn();
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.navbar__kiri}>
        <Link className={styles.navbar__kiri__logo} href="/">
          <Image
            src="/assets/logo/logo.svg"
            width={120}
            height={90}
            priority={false}
            loading="lazy"
            alt="logo"
            style={{ fontFamily: "Harabara" }}
            className="fontlogo"
          />
        </Link>
        <p className={styles.navbar__kiri__par}>apps</p>
      </div>
      <div className={styles.navbar__tengah}></div>
      <div className={styles.navbar__kanan}>
        <div className={styles.navbar__kanan__panel}>
          {data ? (
            <>
              <div
                className={`${styles.navbar__kanan__panel__nama} 
              sm:block hidden`}
              >
                Hi, {name}
              </div>
              <Tooltips
                text="Klik untuk masuk ke Halaman Admin"
                position="left"
              >
                <Link
                  className={styles.navbar__kanan__panel__panelbutton}
                  href={
                    role === "member"
                      ? "/member"
                      : role === "admin"
                        ? "/admin"
                        : role === "kasir"
                          ? "/kasir"
                          : role === "keuangankps"
                            ? "/keuangankps"
                            : role === "personalia"
                              ? "/personalia"
                              : role === "mgmkebun"
                                ? "/mgmkebun"
                                : role === "operatorsch"
                                  ? "/operatorsch"
                                  : "/sa"
                  }
                >
                  <AutoAwesomeMosaicIcon
                    className={styles.navbar__kanan__panelbutton__icon}
                  />
                </Link>
              </Tooltips>
            </>
          ) : (
            ""
          )}
        </div>
        {data && (
          <Button
            className={styles.navbar__kanan__button}
            onClick={handleClick}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="box-loader">
                <div className="sm-loader" />
              </div>
            ) : (
              <div className={styles.navbar__kanan__button__iconnavcont}>
                <LogoutIcon
                  className={styles.navbar__kanan__button__iconnavcont__iconnav}
                />{" "}
                <p className="hidden lg:block">Logout</p>
              </div>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
export default Navbar;
