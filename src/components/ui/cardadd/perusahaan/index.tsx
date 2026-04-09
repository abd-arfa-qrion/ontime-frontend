import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./CardAddPerusahaan.module.scss";
import { Input, TextField } from "@mui/material";
import Button from "../../button";
import { Perusahaan } from "@/type/Perusahaan.type";

type Proptypes = {
  handleAksiPerusahaan: (e: any) => void;
  data: Perusahaan;
  formReset: boolean;
  setFormReset: Dispatch<SetStateAction<boolean>>;
  isLoading: string;
  setIsLoading: Dispatch<SetStateAction<string>>;
};
const CardAddPerusahaan = (props: Proptypes) => {
  const {
    handleAksiPerusahaan,
    data,
    formReset,
    setFormReset,
    isLoading,
    setIsLoading,
  } = props;
  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [phone, setPhone] = useState("");
  const [kodePer, setKodePer] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading("btn-submit");
    e.preventDefault();
    if (data.id === 0) {
      const form = e.target as HTMLFormElement;
      const id = 0;
      const name = form.nama_perusahaan.value;
      const alamat = form.alamat_perusahaan.value;
      const phone = form.phone.value;
      const kode_per = form.kode_perusahaan.value;
      handleAksiPerusahaan({ id, name, alamat, phone, kode_per });
    } else {
      const form = e.target as HTMLFormElement;
      const id = data.id;
      const name = form.nama_perusahaan.value;
      const alamat = form.alamat_perusahaan.value;
      const phone = form.phone.value;
      const kode_per = form.kode_perusahaan.value;
      handleAksiPerusahaan({ id, name, alamat, phone, kode_per });
      setNama("");
      setPhone("");
      setKodePer("");
      setAlamat("");
    }
  };

  useEffect(() => {
    if (data.id !== 0 && data.name) {
      setNama(data.name);
    }
    if (data.id !== 0 && data.alamat) {
      setAlamat(data.alamat);
    }
    if (data.id !== 0 && data.phone) {
      setPhone(data.phone);
    }
    if (data.id !== 0 && data.kode_per) {
      setKodePer(data.kode_per);
    }
    if (formReset) {
      setNama("");
      setPhone("");
      setKodePer("");
      setAlamat("");
      setFormReset(false);
    }
  }, [data, formReset, setFormReset]);

  return (
    <div className={styles.cardadd}>
      <h2 className={styles.cardadd__title}>
        {data && data.id === 0
          ? "Tambah Data Perusahaan"
          : `Edit Data Perusahaan "${data.name}"`}
      </h2>

      <form className={styles.cardadd__form} onSubmit={handleSubmit}>
        <TextField
          required
          id="outlined-basic"
          label="Nama Perusahaan"
          variant="outlined"
          name="nama_perusahaan"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          InputLabelProps={{
            shrink: nama ? true : false,
          }}
        />
        <TextField
          required
          id="outlined-basic"
          label="Alamat"
          variant="outlined"
          name="alamat_perusahaan"
          value={alamat}
          onChange={(e) => setAlamat(e.target.value)}
          InputLabelProps={{
            shrink: alamat ? true : false,
          }}
        />
        <TextField
          required
          id="outlined-basic"
          label="Telp"
          variant="outlined"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          InputLabelProps={{
            shrink: phone ? true : false,
          }}
        />
        <TextField
          required
          id="outlined-basic"
          label="Kode Perusahaan"
          variant="outlined"
          name="kode_perusahaan"
          value={kodePer}
          onChange={(e) => setKodePer(e.target.value)}
          InputLabelProps={{
            shrink: kodePer ? true : false,
          }}
        />
        <Button
          type="submit"
          variant="tri"
          disabled={isLoading === "btn-submit"}
        >
          {isLoading === "btn-submit" ? (
            <div className="box-loader">
              <div className="loader" />
              <p>Loading...</p>
            </div>
          ) : data.id === 0 ? (
            <i className="bx bx-plus-circle"> Simpan</i>
          ) : (
            <i className="bx bxs-edit"> Update</i>
          )}
        </Button>
      </form>
    </div>
  );
};

export default CardAddPerusahaan;
