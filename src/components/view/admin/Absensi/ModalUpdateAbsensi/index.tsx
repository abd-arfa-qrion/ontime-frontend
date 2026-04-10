import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { Instansi } from "@/type/Instansi.type";
import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";

type Proptypes = {
  updateInstansi: Instansi | any;
  setUpdateInstansi: Dispatch<SetStateAction<{}>>;
  setInstansiData: Dispatch<SetStateAction<Instansi[]>>;
  setToaster: Dispatch<SetStateAction<{}>>;
  session: any;
};
const ModalUpdateAbsensi = (props: Proptypes) => {
  const {
    updateInstansi,
    setUpdateInstansi,
    setInstansiData,
    setToaster,
    session,
  } = props;

  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateInstansi = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const form: any = event.target as HTMLFormElement;

    const data = {
      name: form.name.value,
      alamat: form.alamat.value,
      phone: form.phone.value,
    };

    console.log(data);
    // const result = await instansiServices.updateInstansi(
    //   updateInstansi.id,
    //   data,
    //   session.data?.accessToken,
    // );
    // if (result.status === 200) {
    //   form.reset();
    //   setIsLoading(false);
    //   setUpdateInstansi({});
    //   setToaster({
    //     variant: "success",
    //     message: "Update Jasa berhasil!",
    //   });
    //   // feth ulang seluruh data user
    //   const { data } = await instansiServices.getAllInstansi(
    //     session.data?.accessToken,
    //   );
    //   setInstansiData(data.data);
    // } else {
    //   setIsLoading(false);
    // }
  };

  return (
    <Modal onClose={() => setUpdateInstansi({})}>
      <h1>Edit Instansi</h1>
      <form onSubmit={handleUpdateInstansi}>
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
          type="number"
          name="phone"
          defaultValue={updateInstansi.phone}
        />

        <Button type="submit" disabled={isLoading}>
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
    </Modal>
  );
};

export default ModalUpdateAbsensi;
