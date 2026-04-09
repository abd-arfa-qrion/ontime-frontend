import styles from "./Instansi.module.scss";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Button from "@/components/ui/button";
import { Instansi } from "@/type/Instansi.type";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ModalAddInstansi from "./ModalAddInstansi";
import ModalUpdateInstansi from "./ModalUpdateInstansi";
import ModalDeleteInstansi from "./ModalDeleteInstansi";
import { Dropdown } from "@mui/base/Dropdown";
import { MenuButton } from "@mui/base/MenuButton";
import { Menu } from "@mui/base/Menu";
import { MenuItem } from "@mui/base/MenuItem";
import SmartButton from "@mui/icons-material/SmartButton";
import SaLayout from "@/components/layout/SaLayout";
import instansiServices from "@/services/instansi";
import { Perusahaan } from "@/type/Perusahaan.type";
import perusahaanServices from "@/services/perusahaan";
import TableRowSkeleton from "@/components/ui/skeleton/tableRow";

type Proptypes = {
  instansis: Instansi[];
  setToaster: Dispatch<SetStateAction<{}>>;
  session: any;
};
const InstansiPageView = (props: Proptypes) => {
  const { instansis, setToaster, session } = props;
  const [instansiData, setInstansiData] = useState<Instansi[]>([]);
  const [addInstansi, setAddInstansi] = useState(false);
  const [updateInstansi, setUpdateInstansi] = useState<Instansi | {}>({});
  const [deletedInstansi, setDeletedInstansi] = useState<Instansi | {}>({});
  const [datasPerusahaan, setDatasPerusahaan] = useState<Perusahaan[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const getPerusahaan = async (value: string) => {
    try {
      const res = await perusahaanServices.getSearchPer(
        value,
        session.data?.accessToken
      );
      if (res.status === 200 && res.data.status_code === 200) {
        setDatasPerusahaan(res.data.data);
      } else {
        setToaster({
          variant: "warning",
          message: res.data.message,
        });
      }
    } catch (error) {
      setToaster({
        variant: "danger",
        message: `Data Error! ${error}`,
      });
    }
  };
  const handleAddInstansi = async (data: any) => {
    try {
      const result = await instansiServices.addInstansi(
        data,
        session.data?.accessToken
      );
      if (result.status === 200 && result.data.status_code === 200) {
        setAddInstansi(false);
        setToaster({
          variant: "success",
          message: "Tambah Jasa baru berhasil!",
        });
        // fetch ulang seluruh data user
        const { data } = await instansiServices.getAllInstansi(
          session.data?.accessToken
        );
        setInstansiData(data.data);
        setIsLoading(false);
        setDatasPerusahaan([]);
      } else {
        setIsLoading(false);
        setToaster({
          variant: "warning",
          message: result.data.message,
        });
      }
    } catch (error) {
      setToaster({
        variant: "danger",
        message: `Data Error! ${error}`,
      });
    }
  };

  useEffect(() => {
    setInstansiData(instansis);
  }, [instansis]);
  return (
    <>
      <SaLayout>
        <div>
          <h1 className={styles.instansi__title}>Manajemen instansi</h1>
          <div className={styles.instansi__content}>
            <div className={styles.instansi__content__addButton}>
              <Button
                type="button"
                variant="tri"
                onClick={() => setAddInstansi(true)}
              >
                {" "}
                <i className="bx bx-plus" /> Tambah instansi
              </Button>
            </div>
            <table className={styles.instansi__content__table}>
              <thead>
                <tr>
                  <th className={styles.instansi__content__table__number}>
                    No
                  </th>
                  <th>Name</th>
                  <th>Alamat</th>
                  <th>Telp/HP</th>
                  <th>Perusahaan</th>
                  <th className={styles.instansi__content__table__aksi}>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {instansiData && instansiData.length === 0 ? (
                  <TableRowSkeleton columns={6} rowCount={5} />
                ) : (
                  instansiData.map((instansi: any, index: number) => (
                    <tr key={instansi.id}>
                      <td>{index + 1}</td>
                      <td>
                        {instansi.kodeInstansi} - {instansi.name}
                      </td>
                      <td>{instansi.alamat}</td>
                      <td>{instansi.phone}</td>
                      <td>{instansi.perusahaan.name}</td>
                      <td>
                        <div
                          className={styles.instansi__content__table__action}
                        >
                          <Dropdown>
                            <MenuButton
                              className={
                                styles.instansi__content__table__action__button
                              }
                            >
                              <SmartButton />
                            </MenuButton>
                            <Menu
                              className={
                                styles.instansi__content__table__action__menu
                              }
                            >
                              <MenuItem
                                onClick={() => setUpdateInstansi(instansi)}
                              >
                                <EditIcon style={{ fontSize: "15px" }} /> Edit
                              </MenuItem>
                              <MenuItem
                                onClick={() => setDeletedInstansi(instansi)}
                              >
                                <DeleteForeverIcon
                                  style={{ fontSize: "15px" }}
                                />{" "}
                                Delete
                              </MenuItem>
                            </Menu>
                          </Dropdown>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </SaLayout>
      {addInstansi && (
        <ModalAddInstansi
          setAddInstansi={setAddInstansi}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          handleAddInstansi={handleAddInstansi}
          datasPerusahaan={datasPerusahaan}
          getPerusahaan={getPerusahaan}
        />
      )}
      {!!Object?.keys(updateInstansi).length && (
        <ModalUpdateInstansi
          updateInstansi={updateInstansi}
          setUpdateInstansi={setUpdateInstansi}
          setInstansiData={setInstansiData}
          setToaster={setToaster}
          session={session}
        />
      )}
      {!!Object?.keys(deletedInstansi).length && (
        <ModalDeleteInstansi
          deletedInstansi={deletedInstansi}
          setDeletedInstansi={setDeletedInstansi}
          setInstansiData={setInstansiData}
          setToaster={setToaster}
          session={session}
        />
      )}
    </>
  );
};

export default InstansiPageView;
