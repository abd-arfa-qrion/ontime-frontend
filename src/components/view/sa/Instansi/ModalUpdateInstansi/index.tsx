import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import instansiServices from "@/services/instansi";
import { Instansi } from "@/type/Instansi.type";
import styles from "./ModalUpdateInstansi.module.scss";
import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { InputAdornment, TextField, Typography } from "@mui/material";

type Proptypes = {
  updateInstansi: Instansi | any;
  setUpdateInstansi: Dispatch<SetStateAction<{}>>;
  setInstansiData: Dispatch<SetStateAction<Instansi[]>>;
  setToaster: Dispatch<SetStateAction<{}>>;
  session: any;
};
const ModalUpdateInstansi = (props: Proptypes) => {
  const {
    updateInstansi,
    setUpdateInstansi,
    setInstansiData,
    setToaster,
    session,
  } = props;
  const [phone, setPhone] = useState(updateInstansi.phone);
  const [kodePer, setKodePer] = useState(updateInstansi.perusahaan.id);
  const [kodeInstansi, setKodeInstansi] = useState(
    updateInstansi.kodeInstansi.slice(-3)
  );
  const [isLoading, setIsLoading] = useState(false);

  console.log(updateInstansi);
  const handleUpdateInstansi = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const form: any = event.target as HTMLFormElement;
    const data = {
      name: form.name.value,
      alamat: form.alamat.value,
      phone: form.phone.value,
      kodeInstansiFrom: updateInstansi.kodeInstansi,
      kodeInstansi:
        String(updateInstansi.perusahaan.kode_per) +
        String(form.kode_instansi.value),
      perusahaan: {
        id: form.per_id.value,
      },
    };
    try {
      const result = await instansiServices.updateInstansi(
        updateInstansi.id,
        data,
        session.data?.accessToken
      );
      // console.log(result)
      if (result.status === 200 && result.data.status_code === 200) {
        form.reset();
        setIsLoading(false);
        setUpdateInstansi({});
        setToaster({
          variant: "success",
          message: "Update Instansi berhasil!",
        });
        // feth ulang seluruh data user
        const { data } = await instansiServices.getAllInstansi(
          session.data?.accessToken
        );
        setInstansiData(data.data);
      } else {
        setIsLoading(false);
        setToaster({
          variant: "danger",
          message: result.data.message,
        });
      }
    } catch (error) {
      setToaster({
        variant: "danger",
        message: "Update Instansi gagal!",
      });
    }
  };

  const phoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // set maximal panjang karekter adalah 4
    value = value.replace(/[^\d]/g, ""); // Remove non-numeric characters
    setPhone(value);
  };
  const handleKodeInst = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // set maximal panjang karekter adalah 4
    if (value.length <= 3) {
      value = value.replace(/[^\d]/g, ""); // Remove non-numeric characters
      setKodeInstansi(value);
    }
  };
  const handleKodePer = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^\d]/g, ""); // Remove non-numeric characters
    setKodePer(value);
  };

  return (
    <Modal onClose={() => setUpdateInstansi({})}>
      <div className={styles.mupdateinstansi}>
        <h1 className={styles.mupdateinstansi__title}> Edit Instansi</h1>
        <form onSubmit={handleUpdateInstansi}>
          <div className={styles.mupdateinstansi__bagperusahaan}>
            <TextField
              name="per_id"
              label="Kode Perusahaan"
              value={kodePer}
              onChange={handleKodePer}
              variant="outlined"
            />
            <p>{updateInstansi.perusahaan.name}</p>
          </div>
          <Input
            label="Nama"
            type="text"
            name="name"
            defaultValue={updateInstansi.name}
          />
          <Input
            label="Alamat"
            type="text"
            name="alamat"
            defaultValue={updateInstansi.alamat}
          />
          <Input
            label="Phone/WA"
            type="phone"
            name="phone"
            value={phone}
            onChange={phoneNumber}
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
            onChange={handleKodeInst}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography variant="caption">
                    {updateInstansi.kodeInstansi.slice(0, 4)}
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
          <Button
            className={styles.mupdateinstansi__btn}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="box-loader">
                <div className="loader" />
                <p>Updating...</p>
              </div>
            ) : (
              "Update"
            )}
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default ModalUpdateInstansi;
