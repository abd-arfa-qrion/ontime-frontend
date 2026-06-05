import Button from "@/components/ui/button";
import justifikasiServices from "@/pages/api/services/justifikasi";
import { Justifikasi } from "@/type/Justifikasi.type";
import { formatCreatedAt } from "@/utils/formatdate";
import {
  Box,
  ButtonBase,
  Modal,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  updateJustifikasi: Justifikasi | any;
  setUpdateJustifikasi: Dispatch<SetStateAction<{}>>;
  isLoading: string;
  setIsLoading: Dispatch<SetStateAction<string>>;
  setToaster: Dispatch<SetStateAction<{}>>;
  session: any;
  setData: Dispatch<SetStateAction<Justifikasi[]>>;
  taTasem: string;
};
const ModalUpdateJustifikasi = (props: Props) => {
  const {
    open,
    onClose,
    updateJustifikasi,
    setUpdateJustifikasi,
    isLoading,
    setIsLoading,
    setToaster,
    session,
    taTasem,
    setData,
  } = props;
  const [statusHadirTo, setStatusHadirTo] = useState(
    updateJustifikasi?.status_hadir,
  );

  const handleAddJustifikasi = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      setIsLoading("updtJAka");

      // validasi sederhana
      if (!updateJustifikasi?.status_hadir) {
        setToaster({
          variant: "danger",
          message: "Status kehadiran wajib dipilih",
        });
        return;
      }

      // jika pakai upload file multipart/form-data
      const formData = new FormData();

      formData.append("student_id", updateJustifikasi?.student_id);
      formData.append("status_hadir_from", updateJustifikasi?.status_hadir);
      formData.append("status_hadir_to", statusHadirTo);
      formData.append("keterangan", updateJustifikasi?.alasan || "");
      formData.append("waktu_absensi", updateJustifikasi?.waktu_absensi);

      // optional file
      if (updateJustifikasi?.file) {
        formData.append("file", updateJustifikasi.file);
      }

      console.log("payload justifikasi:", {
        student_id: updateJustifikasi?.student_id,
        status_hadir_from: updateJustifikasi?.status_hadir,
        status_hadir_to: statusHadirTo,
        keterangan: updateJustifikasi?.alasan,
        waktu_absensi: updateJustifikasi?.waktu_absensi,
        file: updateJustifikasi?.file,
      });

      // request api
      const result = await justifikasiServices.updateDataJustifikasi(
        formData,
        session.data?.accessToken,
      );

      if (result.status !== 200 && result.data.status_code !== 200) {
        setToaster({
          variant: "danger",
          message: result?.data?.message || "Gagal update justifikasi",
        });
      } else {
        setToaster({
          variant: "success",
          message: result?.data?.message,
        });

        setUpdateJustifikasi({});

        // reload data
        const req = await justifikasiServices.getAllData(
          {
            inst: session.data?.user?.instansiId,
            tahunajaran: taTasem,
          },
          session.data?.accessToken,
        );
        setData(req.data.data);
      }
    } catch (error: any) {
      console.log(error);

      setToaster({
        variant: "danger",
        message: "Terjadi kesalahan server",
      });
    } finally {
      setIsLoading("");
    }
  };
  return (
    <Modal open={true} onClose={() => setUpdateJustifikasi({})}>
      <Box
        sx={{
          width: 560,
          maxHeight: "92vh",
          overflowY: "auto",
          bgcolor: "transparent",
          mx: "auto",
          mt: "2vh",
          borderRadius: 6,
        }}
      >
        <div className="bg-white rounded-[28px] overflow-hidden shadow-2xl border border-slate-200">
          {/* HEADER */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />

            <div className="relative px-6 py-4 flex justify-between items-center">
              <div className="text-white">
                <h1 className="text-xl font-bold">Justifikasi Absensi</h1>

                <p className="text-green-50 text-sm">
                  Perbarui status kehadiran siswa
                </p>
              </div>

              <ButtonBase
                onClick={onClose}
                className="!w-9 !h-9 !rounded-full hover:!bg-white/20"
              >
                <i className="bx bx-x text-2xl text-white"></i>
              </ButtonBase>
            </div>
          </div>

          <form onSubmit={handleAddJustifikasi}>
            <div className="p-5 flex flex-col gap-5">
              {/* INFO SISWA */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <i className="bx bx-user text-xl text-white"></i>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800">Data Siswa</h4>

                    <p className="text-slate-500 text-xs">
                      Informasi absensi siswa
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white rounded-xl p-3 border border-slate-200">
                    <p className="text-slate-500 text-xs mb-1">Nama</p>

                    <p className="font-semibold text-slate-800">
                      {updateJustifikasi?.student_name}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-slate-200">
                    <p className="text-slate-500 text-xs mb-1">Tanggal</p>

                    <p className="font-semibold text-slate-800">
                      {formatCreatedAt(updateJustifikasi?.waktu_absensi)}
                    </p>
                  </div>
                </div>
              </div>

              {/* STATUS */}
              <div>
                <div className="mb-3">
                  <h4 className="font-bold text-slate-800">Status Kehadiran</h4>

                  <p className="text-slate-500 text-xs">
                    Pilih status kehadiran siswa
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    {
                      label: "Hadir",
                      value: "hadir",
                      icon: "bx-check-circle",
                      color:
                        "peer-checked:border-green-500 peer-checked:bg-green-50",
                    },
                    {
                      label: "Sakit",
                      value: "sakit",
                      icon: "bx-plus-medical",
                      color:
                        "peer-checked:border-orange-500 peer-checked:bg-orange-50",
                    },
                    {
                      label: "Izin",
                      value: "izin",
                      icon: "bx-note",
                      color:
                        "peer-checked:border-blue-500 peer-checked:bg-blue-50",
                    },
                    {
                      label: "Alpa",
                      value: "alpa",
                      icon: "bx-x-circle",
                      color:
                        "peer-checked:border-red-500 peer-checked:bg-red-50",
                    },
                    {
                      label: "Dinas",
                      value: "dinas",
                      icon: "bx-briefcase",
                      color:
                        "peer-checked:border-emerald-500 peer-checked:bg-emerald-50",
                    },
                  ].map((item) => (
                    <label key={item.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="status_hadir"
                        value={item.value}
                        checked={statusHadirTo === item.value}
                        onChange={(e) => setStatusHadirTo(e.target.value)}
                        className="peer hidden"
                      />

                      <div
                        className={`border-2 border-slate-200 rounded-2xl p-3 transition-all duration-300 ${item.color}`}
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex gap-2 items-center">
                            <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center">
                              <i
                                className={`bx ${item.icon} text-xl text-slate-700`}
                              ></i>
                            </div>

                            <p className="font-semibold text-sm text-slate-800">
                              {item.label}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">
                              Pilih status
                            </p>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* KETERANGAN */}
              <div>
                <div className="mb-2">
                  <h4 className="font-bold text-slate-800">Keterangan</h4>

                  <p className="text-slate-500 text-xs">
                    Tambahkan alasan tambahan
                  </p>
                </div>

                <TextareaAutosize
                  minRows={2}
                  name="keterangan"
                  placeholder="Masukkan keterangan..."
                  value={updateJustifikasi?.alasan}
                  onChange={(e) =>
                    setUpdateJustifikasi({
                      ...updateJustifikasi,
                      alasan: e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-slate-300 p-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 resize-none transition-all text-sm"
                />
              </div>

              {/* UPLOAD */}
              <div>
                <div className="mb-2">
                  <h4 className="font-bold text-slate-800">Upload Bukti</h4>

                  <p className="text-slate-500 text-xs">
                    PDF, JPG, PNG maksimal 5MB
                  </p>
                </div>

                <label
                  htmlFor="upload-bukti"
                  className="group relative flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-emerald-500 hover:bg-emerald-50/40"
                >
                  <input
                    id="upload-bukti"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      setUpdateJustifikasi({
                        ...updateJustifikasi,
                        file: e.target.files?.[0],
                      });
                    }}
                  />

                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-3">
                    <i className="bx bx-cloud-upload text-4xl text-emerald-500"></i>
                  </div>

                  <p className="font-semibold text-slate-700 text-sm">
                    Drag & Drop File
                  </p>

                  <p className="text-slate-500 text-xs mt-1">
                    atau klik untuk memilih file
                  </p>
                </label>

                {updateJustifikasi?.file && (
                  <div className="mt-3 flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-3">
                    <div className="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center">
                      <i className="bx bx-file text-2xl text-emerald-500"></i>
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <p className="font-semibold text-sm text-slate-700 truncate">
                        {updateJustifikasi.file.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {(updateJustifikasi.file.size / 1024 / 1024).toFixed(2)}{" "}
                        MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* BUTTON ACTION */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  onClick={onClose}
                  className="[background:var(--gradient-secondary)] hover:[background:var(--secondary-dark)] !rounded-xl !px-6 !py-2.5"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isLoading === "updtJAka"}
                  className="!bg-gradient-to-r !from-emerald-500 !to-teal-500 hover:!opacity-90 !rounded-xl !px-6 !py-2.5"
                >
                  {isLoading === "updtJAka" ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    "Simpan"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalUpdateJustifikasi;
