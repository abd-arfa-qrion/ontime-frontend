import AdminLayout from "@/components/layout/AdminLayout";
import Button from "@/components/ui/button";
import styles from "./Roleuser.module.scss";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Roleuser } from "@/type/Roleuser.type";
import { Dropdown } from "@mui/base/Dropdown";
import { MenuButton } from "@mui/base/MenuButton";
import { Menu } from "@mui/base/Menu";
import { MenuItem } from "@mui/base/MenuItem";
import SmartButton from "@mui/icons-material/SmartButton";
import ModalAddRole from "./ModalAddRole";
import { useSession } from "next-auth/react";
import ModalUpdateRole from "./ModalUpdateRole";
import ModalDeleteRole from "./ModalDeleteRole";
import SaLayout from "@/components/layout/SaLayout";
import PaginationComponen from "@/components/ui/pagination";
import SearchInput from "@/components/ui/searchInput";
import TableRowSkeleton from "@/components/ui/skeleton/tableRow";
type Proptypes = {
  roles: Roleuser[];
  setToaster: Dispatch<SetStateAction<{}>>;
  meta: {
    per_page: number;
    page: number;
    count_data: number;
    count_page: number;
  };
  setMeta: Dispatch<
    SetStateAction<{
      per_page: number;
      page: number;
      count_data: number;
      count_page: number;
    }>
  >;
};
const RoleuserPageView = (props: Proptypes) => {
  const { roles, setToaster, meta, setMeta } = props;
  const [roleData, setRoleData] = useState<Roleuser[]>([]);
  const [modalAddRole, setModalAddRole] = useState(false);
  const [modalUpdateRole, setModalUpdateRole] = useState<Roleuser | {}>({});
  const [modalDeleteRole, setModalDeleteRole] = useState<Roleuser | {}>({});
  const session: any = useSession();

  useEffect(() => {
    setRoleData(roles);
  }, [roles]);

  return (
    <>
      <SaLayout>
        <div>
          <h1 className={styles.roleuser__title}>Manajemen roleuser</h1>
          <div className={styles.roleuser__content}>
            <div className={styles.roleuser__content__atas}>
              <div className={styles.roleuser__content__atas__addButton}>
                <Button
                  type="button"
                  variant="tri"
                  onClick={() => setModalAddRole(true)}
                >
                  {" "}
                  <i className="bx bx-plus" /> Tambah roleuser
                </Button>
              </div>
              <div className={styles.produk__content__atas__search}>
                <SearchInput />
              </div>
            </div>
            <table className={styles.roleuser__content__table}>
              <thead>
                <tr>
                  <th className={styles.roleuser__content__table__number}>
                    No
                  </th>
                  <th>Roleuser</th>
                  <th className={styles.roleuser__content__table__aksi}>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {roleData && roleData.length === 0 ? (
                  <TableRowSkeleton columns={3} rowCount={5} />
                ) : (
                  roleData.map((roleuser: any, index: number) => (
                    <tr key={roleuser.id}>
                      <td>{index + 1}</td>
                      <td>{roleuser.role}</td>
                      <td>
                        <div
                          className={styles.roleuser__content__table__action}
                        >
                          <Dropdown>
                            <MenuButton
                              className={
                                styles.roleuser__content__table__action__button
                              }
                            >
                              <SmartButton />
                            </MenuButton>
                            <Menu
                              className={
                                styles.roleuser__content__table__action__menu
                              }
                            >
                              <MenuItem
                                onClick={() => setModalUpdateRole(roleuser)}
                              >
                                <EditIcon style={{ fontSize: "15px" }} /> Edit
                              </MenuItem>
                              <MenuItem
                                onClick={() => setModalDeleteRole(roleuser)}
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
            <PaginationComponen meta={meta} setMeta={setMeta} />
          </div>
        </div>
      </SaLayout>
      {modalAddRole && (
        <ModalAddRole
          setModalAddRole={setModalAddRole}
          setToaster={setToaster}
          setRoleData={setRoleData}
          setMeta={setMeta}
        />
      )}
      {!!Object.keys(modalUpdateRole).length && (
        <ModalUpdateRole
          modalUpdateRole={modalUpdateRole}
          setModalUpdateRole={setModalUpdateRole}
          setRoleData={setRoleData}
          setToaster={setToaster}
          session={session}
          setMeta={setMeta}
        />
      )}
      {!!Object.keys(modalDeleteRole).length && (
        <ModalDeleteRole
          modalDeleteRole={modalDeleteRole}
          setModalDeleteRole={setModalDeleteRole}
          setRoleData={setRoleData}
          setToaster={setToaster}
          session={session}
        />
      )}
    </>
  );
};

export default RoleuserPageView;
