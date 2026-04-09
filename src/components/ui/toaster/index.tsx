import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./Toaster.module.scss";

type PropTypes = {
  variant: string;
  message?: string;
  setToaster: Dispatch<SetStateAction<{}>>;
};

const toasterVariant: any = {
  success: {
    title: "Success",
    icon: "bx-check-circle",
    color: "#a3d9a5",
    barColor: "#3f9242",
  },
  danger: {
    title: "Error",
    icon: "bx-x-circle",
    color: "#f39b9a",
    barColor: "#bb2525",
  },
  warning: {
    title: "Penting!",
    icon: "bx-info-circle",
    color: "#e0c07b",
    barColor: "#e19d08",
  },
};
const Toaster = (props: PropTypes) => {
  const { variant = "success", message, setToaster } = props;

  const [toastBar, setToastBar] = useState(100);
  const timerRef = useRef<any>(null);

  const timerStart = () => {
    timerRef.current = setInterval(() => {
      setToastBar((prevLength) => prevLength - 0.06);
    }, 0.06);
  };

  useEffect(() => {
    timerStart();
  }, []);
  return (
    <div
      className={`${styles.toaster} ${styles[`toaster--${variant}`]}`}
      data-aos="fade-up"
      data-aos-delay="100"
    >
      <div className={styles.toaster__main}>
        <div className={styles.toaster__main__icon}>
          <i
            className={`bx ${toasterVariant[variant].icon}`}
            style={{ color: toasterVariant[variant].barColor }}
          />
        </div>
        <div className={styles.toaster__main__text}>
          <p className={styles.toaster__main__text__title}>
            {toasterVariant[variant].title}
          </p>
          <p className={styles.toaster__main__text__message}>{message}</p>
        </div>
        <div
          className={`bx bx-x ${styles.toaster__main__close}`}
          onClick={() => setToaster({})}
        ></div>
      </div>

      <div
        className={`${styles.toaster__timer}`}
        style={{ backgroundColor: toasterVariant[variant].color }}
      >
        <div
          style={{
            width: `${toastBar}%`,
            height: "100%",
            backgroundColor: toasterVariant[variant].barColor,
          }}
        ></div>
      </div>
    </div>
  );
};

export default Toaster;
