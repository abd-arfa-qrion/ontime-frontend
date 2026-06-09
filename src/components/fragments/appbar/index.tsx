import { useSession } from "next-auth/react";
import React from "react";
import styles from "./Appbar.module.scss";
import Image from "next/image";
type IconProps = {
  size?: number;
  className?: string;
};

const Appbar = () => {
  const session: any = useSession();
  const namaInstansi = session.data?.user?.namaInstansi;
  const instAddInfo = session.data?.user?.instAddInfo;
  const logo = session.data?.logo;
  console.log(logo);
  return (
    <div className={styles.appbar}>
      <div className="flex gap-2 items-center">
        <Image
          src={logo || "/assets/logo/foto-sekolah.png"}
          width={50}
          height={50}
          alt="logo-sekolah"
          className="py-2"
        />
        <div className="flex flex-col gap-0 items-left">
          <p className="text-lg md:text-xl font-semibold"> {namaInstansi}</p>
          <p className="text-xs md:text-sm text-gray-400">
            NPSN: {instAddInfo}
          </p>
        </div>
      </div>
      <div className="text-md px-2 flex gap-0 md:gap-2 items-center flex-col md:flex-row">
        <div className="flex gap-2 items-center">
          <div className="flex gap-2">
            <Image
              src="/assets/logo/foto-user.png"
              width={50}
              height={50}
              alt="foto-user"
              className="rounded-full bg-gray-200"
            />
            <div className="flex flex-col gap-0">
              <p className="text-xs md:text-sm font-semibold">
                {session.data?.user?.name}
              </p>
              <p className="text-[8px] md:text-[10px] text-gray-500">
                {session.data?.user?.role}
              </p>
              <p className="text-[10px] md:text-[11px] text-gray-500 mt-[-5px]">
                {session.data?.user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appbar;
