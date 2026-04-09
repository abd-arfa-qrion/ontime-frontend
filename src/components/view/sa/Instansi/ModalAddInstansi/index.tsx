import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import {
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Search from "@mui/icons-material/Search";
import styles from "./ModalAddInstansi.module.scss";
import Select from "@/components/ui/select";

type Proptypes = {
  // setToaster: Dispatch<SetStateAction<{}>>
  setAddInstansi: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  handleAddInstansi: (data: any) => void;
  datasPerusahaan: any;
  getPerusahaan: (searchValue: string) => void;
};
const ModalAddInstansi = (props: Proptypes) => {
  const {
    setAddInstansi,
    isLoading,
    setIsLoading,
    handleAddInstansi,
    datasPerusahaan,
    getPerusahaan,
  } = props;
  const [kodeInstansi, setKodeInstansi] = useState("");
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form: any = e.target as HTMLFormElement;
    const kodePer = datasPerusahaan.find(
      (item: any) => item.id === form.per_id.value
    );
    const data = {
      name: form.name.value,
      alamat: form.alamat.value,
      phone: form.phone.value,
      kodeInstansi: kodePer.kode_per + form.kode_instansi.value,
      perusahaanId: form.per_id.value,
    };
    handleAddInstansi(data);
  };
  // Tombol Enter Keyboard
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const form = e.target as HTMLFormElement;
      const searchValue = form.value;
      if (searchValue !== "") {
        getPerusahaan(searchValue);
      }
    }
  };
  // Button Search
  const handleSearchPer = (e: any) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const searchValue = form.per_name.value;
    if (searchValue !== "") {
      console.log(searchValue);
      getPerusahaan(searchValue);
    }
  };

  const handleKodeInstansi = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // set maximal panjang karekter adalah 4
    if (value.length <= 3) {
      value = value.replace(/[^\d]/g, ""); // Remove non-numeric characters
      setKodeInstansi(value);
    }
  };

  return (
    <Modal onClose={() => setAddInstansi(false)}>
      <div className={styles.maddinstansi}>
        <h1 className={styles.maddinstansi__title}>Tambah Instansi Baru</h1>
        <form
          onSubmit={handleSearchPer}
          className={styles.maddinstansi__bagiansearch}
        >
          <TextField
            required
            autoFocus
            className={styles.maddinstansi__bagiansearch__inputsearch}
            id="outlined-basic"
            label="Data Perusahaan"
            variant="outlined"
            name="per_name"
            placeholder="ketik nama perusahaan..."
            onKeyDown={handleKeyDown}
          />
          <Button
            variant="secondary"
            type="submit"
            className={styles.maddinstansi__bagiansearch__btnsearch}
          >
            <Search />
          </Button>
        </form>
        {datasPerusahaan.length > 0 && (
          <form onSubmit={handleSubmit}>
            <Select
              label="Pilih Perusahaan"
              name="per_id"
              options={
                datasPerusahaan &&
                datasPerusahaan.map((data: any) => ({
                  value: data.id,
                  label: data.name,
                }))
              }
            />
            <Input
              label="Nama Instansi/Unit"
              type="text"
              name="name"
              placeholder="Nama"
              required
            />
            <Input
              label="Alamat"
              type="text"
              name="alamat"
              placeholder="alamat"
              required
            />
            <Input
              label="Phone/WA"
              type="number"
              name="phone"
              placeholder="no hp/wa"
              required
            />
            <TextField
              label="Kode Instansi"
              type="text"
              name="kode_instansi"
              placeholder="Kode Instansi"
              required
              fullWidth
              margin="normal"
              value={kodeInstansi}
              onChange={handleKodeInstansi}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography variant="caption">
                      {datasPerusahaan.length > 0
                        ? datasPerusahaan[0].kode_per
                        : ""}
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              className={styles.maddinstansi__btn}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="box-loader">
                  <div className="loader" />
                  <p>Loading...</p>
                </div>
              ) : (
                "Simpan"
              )}
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default ModalAddInstansi;
