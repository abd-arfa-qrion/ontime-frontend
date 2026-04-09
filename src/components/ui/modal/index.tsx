import React, { useEffect, useRef } from "react";
import styles from "./Modal.module.scss";

type Proptypes = {
  children: React.ReactNode;
  onClose: any;
  width?: string;
};
const Modal = (props: Proptypes) => {
  const { children, onClose, width } = props;
  const ref: any = useRef();
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  return (
    <div className={styles.modal}>
      <div className={styles.modal__content + " " + width} ref={ref}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
