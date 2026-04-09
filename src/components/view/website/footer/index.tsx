import { Map } from "@mui/icons-material";
import styles from "./Footer.module.scss";
import Image from "next/image";
const FooterPage = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.footer__atas}>
        <div className={styles.footer__atas__kiri}>
          <h5 className={styles.footer__atas__kiri__title}>Hubungi Kami</h5>
          <p className={styles.footer__atas__kiri__main}>
            <i className="bx bxl-whatsapp" /> 0896-2055-0512
          </p>
        </div>
        <div className={styles.footer__atas__tengah}>
          <h5 className={styles.footer__atas__tengah__title}>Base Office</h5>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.6545130172804!2d101.44400481087831!3d0.519193463679755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5ac1d766eaabb%3A0x8712d94967d9370e!2sMenara%20Dang%20Merdu%20Bank%20Riau%20Kepri%20Syariah!5e0!3m2!1sid!2sid!4v1709029205628!5m2!1sid!2sid"
            width={"100%"}
            height="300"
            style={{ border: 0 }}
            loading="lazy"
          ></iframe>
        </div>
        <div className={styles.footer__atas__kanan}>
          <h5 className={styles.footer__atas__kanan__title}>Social Media</h5>
          <p className={styles.footer__atas__kanan__main}>
            <i className="bx bxl-facebook" style={{ color: "#387ADF" }} />
            <i className="bx bxl-instagram" style={{ color: "#FE7BE5" }} />
            <i className="bx bxl-tiktok" />
            <i className="bx bxl-youtube" style={{ color: "#D80032" }} />
          </p>
          <p style={{ textAlign: "right" }}>qrion.id</p>
        </div>
      </div>
      <div className={styles.footer__bawah}>
        <p className="mt-5">
          Copyright © 2025 & Dibuat dengan{" "}
          <i className="bx bxs-heart text-pink-600"></i> by{" "}
          <a
            className="hover:underline hover:text-secondary"
            href="https://qrion.id"
          >
            www.qrion.id
          </a>
        </p>
      </div>
    </div>
  );
};

export default FooterPage;
