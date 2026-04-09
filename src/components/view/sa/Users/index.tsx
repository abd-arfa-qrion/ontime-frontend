import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./User.module.scss";
import ModalUpdateUser from "./ModalUpdateUser";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ModalDeleteUser from "./ModalDeleteUser";
import { User } from "@/type/user.type";
import { useSession } from "next-auth/react";
import { Dropdown } from "@mui/base/Dropdown";
import { MenuButton } from "@mui/base/MenuButton";
import { Menu } from "@mui/base/Menu";
import { MenuItem } from "@mui/base/MenuItem";
import SmartButton from "@mui/icons-material/SmartButton";
import SaLayout from "@/components/layout/SaLayout";
import Button from "@/components/ui/button";
import ModalAddUser from "./ModalAddUser";
import PaginationComponen from "@/components/ui/pagination";
import SearchInput from "@/components/ui/searchInput";
import TableRowSkeleton from "@/components/ui/skeleton/tableRow";
type Proptypes = {
  users: User[];
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
const UserPageView = (props: Proptypes) => {
  const { users, setToaster, meta, setMeta } = props;
  const [updateUser, setUpdateUser] = useState<User | {}>({});
  const [deletedUser, setDeletedUser] = useState<User | {}>({});
  const [usersData, setUsersData] = useState<User[]>([]);
  const [modalAddUser, setModalAddUser] = useState(false);
  const session: any = useSession();

  useEffect(() => {
    setUsersData(users);
  }, [users]);
  return (
    <>
      <SaLayout>
        <div>
          <h1 className={styles.users__title}>Manajemen Users</h1>
          <div className={styles.users__content}>
            <div className={styles.users__content__atas}>
              <div className={styles.users__content__atas__addButton}>
                <Button
                  type="button"
                  variant="tri"
                  onClick={() => setModalAddUser(true)}
                >
                  {" "}
                  <i className="bx bx-plus" /> Tambah User
                </Button>
              </div>
              <div className={styles.users__content__atas__search}>
                <SearchInput />
              </div>
            </div>
            <table className={styles.users__content__table}>
              <thead>
                <tr>
                  <th className={styles.users__content__table__number}>No</th>
                  <th className={styles.users__content__table__username}>
                    Username
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Time Session</th>
                  <th className={styles.users__content__table__aksi}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {usersData && usersData.length === 0 ? (
                  <TableRowSkeleton columns={7} rowCount={5} />
                ) : (
                  usersData.map((user: any, index: number) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.username}</td>
                      <td>{user.nama}</td>
                      <td>{user.email}</td>
                      <td>{user.roleId}</td>
                      <td>{user.timeSession}</td>
                      <td>
                        <div className={styles.users__content__table__action}>
                          <Dropdown>
                            <MenuButton
                              className={
                                styles.users__content__table__action__button
                              }
                            >
                              <SmartButton />
                            </MenuButton>
                            <Menu
                              className={
                                styles.users__content__table__action__menu
                              }
                            >
                              <MenuItem onClick={() => setUpdateUser(user)}>
                                <EditIcon style={{ fontSize: "15px" }} /> Edit
                              </MenuItem>
                              <MenuItem onClick={() => setDeletedUser(user)}>
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
      {modalAddUser && (
        <ModalAddUser
          setModalAddUser={setModalAddUser}
          setUsersData={setUsersData}
          setToaster={setToaster}
          setMeta={setMeta}
        />
      )}
      {!!Object?.keys(updateUser).length && (
        <ModalUpdateUser
          updateUser={updateUser}
          setUpdateUser={setUpdateUser}
          setUsersData={setUsersData}
          setToaster={setToaster}
          session={session}
          meta={meta}
          setMeta={setMeta}
        />
      )}
      {!!Object?.keys(deletedUser).length && (
        <ModalDeleteUser
          deletedUser={deletedUser}
          setDeletedUser={setDeletedUser}
          setUsersData={setUsersData}
          setToaster={setToaster}
          setMeta={setMeta}
          session={session}
        />
      )}
    </>
  );
};

export default UserPageView;
