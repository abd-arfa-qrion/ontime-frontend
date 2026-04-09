import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import instansiServices from "@/services/instansi";
import roleuserService from "@/services/roleuser";
import { Instansi } from "@/type/Instansi.type";
import { User } from "@/type/user.type";
import styles from "./ModalAddUser.module.scss";
import { useSession } from "next-auth/react";
import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import userService from "@/services/user";
import { TextField } from "@mui/material";
import Select from "@/components/ui/select";
// import Select from '@/components/ui/select'

type Proptypes = {
  setToaster: Dispatch<SetStateAction<{}>>;
  setModalAddUser: Dispatch<SetStateAction<boolean>>;
  setUsersData: Dispatch<SetStateAction<User[]>>;
  setMeta: Dispatch<
    SetStateAction<{
      per_page: number;
      page: number;
      count_data: number;
      count_page: number;
    }>
  >;
};
const ModalAddUser = (props: Proptypes) => {
  const { setToaster, setModalAddUser, setUsersData, setMeta } = props;
  const [isLoading, setIsLoading] = useState(false);
  const session: any = useSession();
  const [roles, setRoles] = useState([]);
  const [instansis, setInstansis] = useState<Instansi[]>([]);
  const [perusahaan, setPerusahaan] = useState({
    idPer: 0,
    namaPer: "Nama Perusahaan",
  });
  const handleAddUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form: any = e.target as HTMLFormElement;
    const data = {
      username: form.username.value,
      password: form.password.value,
      nama: form.nama.value,
      email: form.email.value,
      phone: form.no_hp.value,
      instansiId: String(form.instansi.value),
      karyawanId: "2637fd9d-e0bb-49b1-b6e8-84e8287e000d",
      status: "1",
      roleId: form.role.value,
      timeSession: Number(form.time_ses.value),
    };
    console.log(data);
    if (!data.roleId) {
      setIsLoading(false);
      setToaster({
        variant: "danger",
        message: "Maaf Nama Role wajib diisi!",
      });
      return;
    }
    const result = await userService.addUser(data, session.data?.accessToken);

    if (result.status === 200) {
      if (result.data.status_code === 400) {
        setIsLoading(false);
        setToaster({
          variant: "danger",
          message: `${result.data.message}`,
        });
      } else {
        setIsLoading(false);
        setToaster({
          variant: "success",
          message: "Role User Berhasil ditambahkan!",
        });
        form.reset();
        setModalAddUser(false);

        // fetch ulang seluruh data user
        const { data } = await userService.getAllUsers(
          10,
          1,
          session.data?.accessToken
        );
        setUsersData(data.data);
        setMeta(data.meta);
      }
    } else {
      setIsLoading(false);
    }
  };
  const getRoles = useCallback(async () => {
    const result = await roleuserService.getRoles(session.data?.accessToken);
    if (result.status === 200) {
      setRoles(result.data.data);
    }
  }, [session.data?.accessToken]);
  const getInstansis = useCallback(async () => {
    const result = await instansiServices.getAllInstansi(
      session.data?.accessToken
    );
    if (result.status === 200) {
      setInstansis(result.data.data);
    }
    // console.log(result.data.data)
  }, [session.data?.accessToken]);
  const handleInstansiChange = (instId: string) => {
    const instansi = instansis.find((inst: Instansi) => inst.id === instId);
    if (instansi) {
      const namaPer = instansi.perusahaan.name;
      const idPer = instansi.perusahaan.id;
      setPerusahaan({ idPer, namaPer });
      // Do something with perusahaanId
    } else {
      console.log("Instansi tidak ditemukan");
    }
  };

  useEffect(() => {
    getInstansis();
    getRoles();
  }, [getInstansis, getRoles]);

  return (
    <Modal onClose={() => setModalAddUser(false)}>
      <div className={styles.madduser}>
        <h1>Tambah User Baru</h1>

        <form onSubmit={handleAddUser}>
          <Input
            label="Nama"
            name="nama"
            type="text"
            placeholder="Masukkan Nama"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Masukkan Email"
          />
          <Input
            label="No. HP"
            name="no_hp"
            type="text"
            placeholder="Masukkan No. HP"
          />
          <Input
            name="per_id"
            type="text"
            defaultValue={perusahaan.idPer.toString()}
            hidden
          />
          <Select
            label="Role user"
            name="role"
            options={roles.map((role: any) => ({
              value: role.role,
              label: role.role,
            }))}
          />
          <Input
            label="Time Session"
            name="time_ses"
            type="number"
            placeholder="Masukkan angka dalam menit"
          />
          <Select
            label="Instansi"
            name="instansi"
            options={instansis.map((inst: any) => ({
              value: inst.id,
              label: inst.name,
            }))}
            onChange={handleInstansiChange}
          />
          <p className={styles.madduser__bagper}>
            Perusahaan - <span>{perusahaan.namaPer}</span>
          </p>
          <div className={styles.madduser__bagusername}>
            <TextField
              className={styles.madduser__bagusername__username}
              label="Username"
              name="username"
              type="text"
              placeholder="Masukkan Username"
            />
            <TextField
              className={styles.madduser__bagusername__password}
              label="Password"
              name="password"
              type="password"
              placeholder="Masukkan Password"
            />
          </div>
          <Button type="submit" className={styles.madduser__btnsubmit}>
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
      </div>
    </Modal>
  );
};

export default ModalAddUser;
