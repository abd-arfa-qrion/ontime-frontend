import React from "react";
import styles from "./FetchData.module.scss";
import { Button, TextField, colors } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
type Propstype = {
  kodeItem: string;
  itemTempData: any;
  judul: string;
  attrId: string;
  attrHandleKode: (e: any) => void;
  attrHandleAdd: (e: any) => void;
  handleDeletedItem: (e: any) => void;
  btnKurangStok: (e: any) => void;
  btnTambahStok: (e: any) => void;
  autoFokus?: string;
};
const FetchData = (prop: Propstype) => {
  const {
    kodeItem,
    itemTempData,
    judul,
    attrId,
    attrHandleKode,
    attrHandleAdd,
    handleDeletedItem,
    btnTambahStok,
    btnKurangStok,
    autoFokus,
  } = prop;

  return (
    <div className={styles.fetch}>
      <TextField
        id={attrId === "dataproduk" ? "idproduk" : "idjasa"}
        label={attrId === "dataproduk" ? "ID PRODUK" : "ID JASA"}
        variant="outlined"
        placeholder="Scan Barcode!"
        className={styles.fetch__idproduk}
        value={kodeItem}
        onChange={attrHandleKode}
        onKeyDown={(e) => e.key === "Enter" && attrHandleAdd(e)}
        {...(autoFokus && { autoFocus: true })}
      />
      <table className={styles.fetch__table}>
        <thead>
          <tr>
            <th>No</th>
            <th>Kode</th>
            <th>{judul}</th>
            <th style={{ textAlign: "right" }}>Harga</th>
            <th>Qty</th>
            <th style={{ textAlign: "right" }}>Jumlah</th>
            <th className="btnaksitd"></th>
          </tr>
        </thead>
        {attrId === "dataproduk" ? (
          <tbody>
            {itemTempData.map((item: any, index: number) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.kode_produk}</td>
                <td>{item.nama_produk}</td>
                <td style={{ textAlign: "right" }}>
                  {item.amount.toLocaleString("id-ID")}
                </td>
                <td className={styles.fetch__table__qtydiv}>
                  <TextField
                    hiddenLabel
                    id="filled-hidden-label-normal"
                    value={item.qty}
                    variant="filled"
                    style={{ width: "70px" }}
                    inputProps={{
                      style: {
                        padding: "10px",
                        fontSize: "18px",
                      },
                    }}
                  />
                  <div className={styles.fetch__table__qtydiv__qtybtn}>
                    <KeyboardArrowUpIcon
                      className={styles.fetch__table__qtydiv__qtybtn__upIcon}
                      onClick={() => btnTambahStok(item)}
                    />
                    {item.qty > 1 ? (
                      <KeyboardArrowDownIcon
                        className={
                          styles.fetch__table__qtydiv__qtybtn__downIcon
                        }
                        onClick={() => btnKurangStok(item)}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </td>
                <td style={{ textAlign: "right" }}>
                  {item.jml_amount.toLocaleString("id-ID")}
                </td>
                <td>
                  <Button onClick={() => handleDeletedItem(item)}>
                    <DeleteForeverIcon
                      style={{ fontSize: "20px", color: "#bf0505" }}
                      className={styles.fetch__table__deleteBtn}
                    />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            {itemTempData.map((item: any, index: number) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.kode_jasa}</td>
                <td>{item.deskripsi_jasa}</td>
                <td style={{ textAlign: "right" }}>
                  {item.amount.toLocaleString("id-ID")}
                </td>
                <td className={styles.fetch__table__qtydiv}>
                  <TextField
                    hiddenLabel
                    id="filled-hidden-label-normal"
                    value={item.qty}
                    variant="filled"
                    style={{ width: "70px" }}
                    inputProps={{
                      style: {
                        padding: "10px",
                        fontSize: "18px",
                      },
                    }}
                  />
                  <div className={styles.fetch__table__qtydiv__qtybtn}>
                    <KeyboardArrowUpIcon
                      className={styles.fetch__table__qtydiv__qtybtn__upIcon}
                      onClick={() => btnTambahStok(item)}
                    />
                    {item.qty > 1 ? (
                      <KeyboardArrowDownIcon
                        className={
                          styles.fetch__table__qtydiv__qtybtn__downIcon
                        }
                        onClick={() => btnKurangStok(item)}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </td>
                <td style={{ textAlign: "right" }}>
                  {item.jml_amount.toLocaleString("id-ID")}
                </td>
                <td>
                  <Button onClick={() => handleDeletedItem(item)}>
                    <DeleteForeverIcon
                      style={{ fontSize: "20px", color: "#bf0505" }}
                      className={styles.fetch__table__deleteBtn}
                    />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default FetchData;
