import AdminFooter from "@/components/fragments/adminfooter";
import styles from "./AuthLayout.module.scss";
import Image from "next/image";
import { IconDashboard } from "@/components/icons";

type Proptypes = {
  error?: string;
  children: React.ReactNode;
  title: string;
  link: string;
  linkText?: string;
};
const AuthLayout = (props: Proptypes) => {
  // deklarasikan konstanta
  const { error, children, title, link, linkText } = props;

  return (
    <div className={styles.auth}>
      <Image
        src="/assets/logo/logo.svg"
        width={200}
        height={140}
        loading="lazy"
        alt="logo"
        className="mt-2"
      />
      <h1
        className={styles.auth__title}
        data-aos="fade-right"
        data-aos-delay="200"
      >
        {title}
      </h1>
      {error && <p className={styles.auth__error}>{error}</p>}

      <div
        className={styles.auth__form}
        data-aos="fade-left"
        data-aos-delay="200"
      >
        {children}
      </div>
      <AdminFooter />
      <div className="flex w-auto items-center justify-center mt-5 border-gray-500 border py-1 pl-1 pr-2 rounded-2xl">
        <i className="bx bx-lock-alt text-[32px]"></i>
        <div className="flex flex-col leading-none">
          <p className="font-bold text-md">S E C U R E</p>
          <p className="text-[10px] text-green-600">SSL ENCRYPTION</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
