import SaLayout from "@/components/layout/SaLayout";
import { Dropdown, Menu, MenuButton, MenuItem } from "@mui/base";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import styles from "./Perusahaan.module.scss";
import React, { Dispatch, SetStateAction, useState } from "react";
import SmartButton from "@mui/icons-material/SmartButton";
import CardAddPerusahaan from "@/components/ui/cardadd/perusahaan";
import perusahaanServices from "@/services/perusahaan";
import { useSession } from "next-auth/react";
import { Perusahaan } from "@/type/Perusahaan.type";
import BagFilter from "@/components/bagianfilter";
import TableRowSkeleton from "@/components/ui/skeleton/tableRow";
type Proptypes = {
  setToaster: Dispatch<SetStateAction<{}>>;
};
const PerusahaanPageView = (props: Proptypes) => {
  const { setToaster } = props;
  const [isMobile, setIsMobile] = useState(false);
  const [datasPer, setDatasPer] = useState<Perusahaan[]>([]);
  const [formReset, setFormReset] = useState(false);
  const [isLoading, setIsLoading] = useState("");
  const [dataPer, setDataPer] = useState<Perusahaan>({
    id: 0,
    name: "",
    alamat: "",
    phone: "",
    kode_per: "",
  });
  const session: any = useSession();
  const handleAksiPerusahaan = async (e: {
    id: number;
    name: string;
    alamat: string;
    phone: string;
    kode_per: string;
  }) => {
    if (e) {
      if (e.id === 0) {
        const data = {
          name: e.name,
          alamat: e.alamat,
          phone: e.phone,
          kode_per: e.kode_per,
        };
        confirm(`Apakah anda yakin ingin menambahkan data ${data.name} ini?`);
        try {
          const res = await perusahaanServices.addPerusahaan(
            data,
            session.data?.accessToken
          );
          if (res.status === 200) {
            if (res.data.status_code === 200) {
              setFormReset(true);
              const id = res.data.data.id;
              try {
                const resGet = await perusahaanServices.getPerByIdArray(
                  id,
                  session.data?.accessToken
                );
                if (resGet.status === 200) {
                  if (resGet.data.status_code === 200) {
                    setDatasPer(resGet.data.data);
                    setToaster({
                      variant: "success",
                      message: res.data.message,
                    });
                    // console.log(datasPer)
                  }
                }
              } catch (error) {
                setToaster({
                  variant: "danger",
                  message: res.data.message,
                });
              }
            } else {
              setToaster({
                variant: "danger",
                message: res.data.message,
              });
            }
          } else {
            setToaster({
              variant: "danger",
              message: res.data.message,
            });
          }
        } catch (error) {
          setToaster({
            variant: "danger",
            message: `Data Error! ${error}`,
          });
        }
      } else {
        const id = String(e.id);
        const data = {
          // id: e.id,
          name: e.name,
          alamat: e.alamat,
          phone: e.phone,
          kode_per: e.kode_per,
        };
        confirm(`Apakah anda yakin ingin mengubah data id ${data.name} ini?`);
        try {
          const res = await perusahaanServices.updatePer(
            id,
            data,
            session.data?.accessToken
          );
          if (res.status === 200) {
            if (res.data.status_code === 200) {
              const id = res.data.data.id;
              try {
                const resGet = await perusahaanServices.getPerByIdArray(
                  id,
                  session.data?.accessToken
                );
                if (resGet.status === 200) {
                  if (resGet.data.status_code === 200) {
                    setDatasPer(resGet.data.data);
                    setDataPer({
                      id: 0,
                      name: "",
                      alamat: "",
                      phone: "",
                      kode_per: "",
                    });
                    // setFormReset(true)
                    setToaster({
                      variant: "success",
                      message: res.data.message,
                    });
                  }
                }
              } catch (error) {
                setToaster({
                  variant: "danger",
                  message: res.data.message,
                });
              }
            } else {
              setToaster({
                variant: "danger",
                message: res.data.message,
              });
            }
          } else {
            setToaster({
              variant: "danger",
              message: res.data.message,
            });
          }
        } catch (error) {
          setToaster({
            variant: "danger",
            message: `Data Error! ${error}`,
          });
        }
      }
    }
    setIsLoading("");
  };
  const getAllPer = async (e: { selected: string; search: string }) => {
    setDatasPer([]);
    setIsLoading("fetching");
    if (e.selected === "0") {
      try {
        const req = await perusahaanServices.getAllPerusahaans(
          session.data?.accessToken
        );
        if (req.status === 200) {
          if (req.data.status_code === 200) {
            setDatasPer(req.data.data);
            setIsLoading("");
            setToaster({
              variant: "success",
              message: req.data.message,
            });
          } else if (req.data.status_code === 201) {
            setDatasPer([]);
            setIsLoading("");
            setToaster({
              variant: "warning",
              message: req.data.message,
            });
          }
        }
      } catch (error) {
        setIsLoading("");
        setToaster({
          variant: "danger",
          message: `Data Error! ${error}`,
        });
      }
    } else {
      try {
        const req = await perusahaanServices.getSearchPer(
          e.search,
          session.data?.accessToken
        );
        if (req.status === 200) {
          if (req.data.status_code === 200) {
            setDatasPer(req.data.data);
            setIsLoading("");
            setToaster({
              variant: "success",
              message: req.data.message,
            });
          } else if (req.data.status_code === 201) {
            setDatasPer([]);
            setIsLoading("");
            setToaster({
              variant: "warning",
              message: req.data.message,
            });
          }
        }
      } catch (error) {
        setIsLoading("");
        setToaster({
          variant: "danger",
          message: `Data Error! ${error}`,
        });
      }
    }
  };
  const handleDeletePer = async (id: string) => {
    const data = {
      id: String(id),
    };
    confirm(`Apakah anda yakin ingin menghapus data id ${id} ini?`);
    try {
      const req = await perusahaanServices.deletePer(
        data,
        session.data?.accessToken
      );
      if (req.status === 200 && req.data.status_code === 200) {
        setToaster({
          variant: "success",
          message: req.data.message,
        });
        getAllPer({ selected: "0", search: "" });
      }
    } catch (error) {
      setToaster({
        variant: "danger",
        message: `Data Error! ${error}`,
      });
    }
  };

  return (
    <SaLayout>
      <div>
        <h1 className={styles.perusahaan__title}>Manajemen perusahaan</h1>
        <CardAddPerusahaan
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          formReset={formReset}
          setFormReset={setFormReset}
          data={dataPer}
          handleAksiPerusahaan={handleAksiPerusahaan}
        />
        <div className={styles.perusahaan__pemisah}></div>
        <div className={styles.perusahaan__content}>
          <div className={styles.perusahaan__content__atas}>
            <div className={styles.perusahaan__content__atas__bagianFilter}>
              <h3>List Data Perusahaan</h3>
              <div
                className={
                  styles.perusahaan__content__atas__bagianFilter__filter
                }
              >
                <BagFilter getAllPer={getAllPer} setToaster={setToaster} />
              </div>
            </div>
            <div className={styles.perusahaan__content__atas__search}></div>
          </div>
          {isMobile ? (
            <div>disini card fetch</div>
          ) : (
            <table className={styles.perusahaan__content__table}>
              <thead>
                <tr>
                  <th className={styles.perusahaan__content__table__number}>
                    No
                  </th>
                  <th className={styles.perusahaan__content__table__username}>
                    Nama perusahaan
                  </th>
                  <th>Alamat Perusahaan</th>
                  <th>Nomor Telpon</th>
                  <th>Kode Perusahaan</th>
                  <th className={styles.perusahaan__content__table__aksi}>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {datasPer.length === 0 && isLoading === "fetching" ? (
                  <TableRowSkeleton columns={6} rowCount={3} />
                ) : datasPer.length === 0 && isLoading === "" ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{ textAlign: "center", color: "grey" }}
                    >
                      No Data...
                    </td>
                  </tr>
                ) : (
                  datasPer.map((per: any, index: number) => (
                    <tr key={per.id}>
                      <td>{index + 1}</td>
                      <td>{per.name}</td>
                      <td>{per.alamat}</td>
                      <td>{per.phone}</td>
                      <td>{per.kode_per}</td>
                      <td>
                        <div
                          className={styles.perusahaan__content__table__action}
                        >
                          <Dropdown>
                            <MenuButton
                              className={
                                styles.perusahaan__content__table__action__button
                              }
                            >
                              <SmartButton />
                            </MenuButton>
                            <Menu
                              className={
                                styles.perusahaan__content__table__action__menu
                              }
                            >
                              <MenuItem onClick={() => setDataPer(per)}>
                                <EditIcon style={{ fontSize: "15px" }} /> Edit
                              </MenuItem>
                              <MenuItem onClick={() => handleDeletePer(per.id)}>
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
          )}
        </div>
      </div>
    </SaLayout>
  );
};

export default PerusahaanPageView;
