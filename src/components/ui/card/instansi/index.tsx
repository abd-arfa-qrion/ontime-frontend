import React, { useState } from "react";
import styles from "./CardInstansi.module.scss";
import { Instansi } from "@/type/Instansi.type";

type Proptypes = {
  dataInstansis: Instansi[];
  dataLink?: boolean;
  handleClick: (data: Instansi) => void;
};
const CardInstansi = (props: Proptypes) => {
  const { dataInstansis, dataLink, handleClick } = props;

  return (
    <div className={styles.cardinstansi}>
      {dataInstansis && !dataLink
        ? dataInstansis.map((item, index) => (
            <div key={index} className={styles.cardinstansi__card}>
              <div className={styles.cardinstansi__card__bagiantext}>
                <div
                  className={styles.cardinstansi__card__bagiantext__bagianatas}
                >
                  <h3
                    className={
                      styles.cardinstansi__card__bagiantext__bagianatas__title
                    }
                  >
                    {item.name}
                  </h3>
                  <p
                    className={
                      styles.cardinstansi__card__bagiantext__bagianatas__kode
                    }
                  >
                    Kode: {item.kodeInstansi}
                  </p>
                </div>

                <div
                  className={styles.cardinstansi__card__bagiantext__bagianbawah}
                >
                  <p
                    className={
                      styles.cardinstansi__card__bagiantext__bagianbawah__harga
                    }
                  >
                    {item.alamat}
                  </p>
                </div>
              </div>
            </div>
          ))
        : dataInstansis.map((item, index) => (
            <div
              key={index}
              className="bg-white border shadow-md p-4 rounded-md cursor-pointer hover:bg-forth"
              onClick={() => handleClick(item)}
            >
              <div className={styles.cardinstansi__card__bagiantext}>
                <div
                  className={styles.cardinstansi__card__bagiantext__bagianatas}
                >
                  <h3
                    className={
                      styles.cardinstansi__card__bagiantext__bagianatas__title
                    }
                  >
                    {item.name}
                  </h3>
                  <p
                    className={
                      styles.cardinstansi__card__bagiantext__bagianatas__kode
                    }
                  >
                    Kode: {item.kodeInstansi}
                  </p>
                </div>

                <div
                  className={styles.cardinstansi__card__bagiantext__bagianbawah}
                >
                  <p
                    className={
                      styles.cardinstansi__card__bagiantext__bagianbawah__harga
                    }
                  >
                    {item.alamat}
                  </p>
                </div>
              </div>
            </div>
          ))}
    </div>
  );
};

export default CardInstansi;
