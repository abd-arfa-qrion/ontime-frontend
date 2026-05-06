import taSmesterServices from "@/pages/api/services/tasmester";
import { Kelas } from "@/type/Kelas.type";
import { TahunAjaran } from "@/type/Tahunajaran.type";
import { Box, Typography, Modal, ButtonBase, TextField } from "@mui/material";
import Select from "@/components/ui/select";
import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Button from "@/components/ui/button";
import { getTahunAjaranWithSemester } from "@/utils/tasemester";
import { JadwalUmum } from "@/type/Jadwalumum.type";
import CalendarIcon from "@/components/icons/CalendarIcon";
import DatePicker from "react-datepicker";
import MSSMethodeAbsensi from "@/components/ui/ontime/multiselect/msmethodeabsensi";
import { MethodeAbsensi } from "@/type/MethodeAbsensi.type";
import methodeAbsensiServices from "@/pages/api/services/methodeabsensi";
import targetAbsensiServices from "@/pages/api/services/targetabsensi";
import { TargetAbsensi } from "@/type/TargetAbsensi.type";
import MSSTargetAbsensi from "@/components/ui/ontime/multiselect/mstargetabsensi";
import jadwalUmumServices from "@/pages/api/services/jadwalumum";

type Proptypes = {
  open: boolean;
  onClose: () => void;
  updateJadwal: JadwalUmum | any;
  setUpdateJadwal: Dispatch<SetStateAction<{}>>;
  setToaster: Dispatch<SetStateAction<{}>>;
  session: any;
  setData: Dispatch<SetStateAction<JadwalUmum[]>>;
  kelasData: Kelas[];
  isLoading: string;
  setIsLoading: Dispatch<SetStateAction<string>>;
};
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);
const ModalUpdateAbsensiUmum = (props: Proptypes) => {
  const {
    open,
    onClose,
    updateJadwal,
    setUpdateJadwal,
    setToaster,
    session,
    setData,
    kelasData,
    isLoading,
    setIsLoading,
  } = props;

  const [taData, setTaData] = useState<TahunAjaran[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState<string>("");

  const [selectedTarget, setSelectedTarget] = useState<(number | string)[]>([]);
  const [selectedMethode, setSelectedMethode] = useState<(number | string)[]>(
    [],
  );

  //state get data
  const [methodeAbsensi, setMethodeAbsensi] = useState<MethodeAbsensi[]>([]);
  const [targetAbsensi, setTargetAbsensi] = useState<TargetAbsensi[]>([]);

  const tasem = getTahunAjaranWithSemester();
  const parseDate = (dateStr: string) => {
    const [dateOnly] = dateStr.split("T"); // "2026-04-26"
    const [year, month, day] = dateOnly.split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
  };
  // SET data awal
  useEffect(() => {
    if (updateJadwal) {
      setStartDate(
        updateJadwal.tgl_mulai ? parseDate(updateJadwal.tgl_mulai) : null,
      );
      setEndDate(
        updateJadwal.tgl_selesai ? parseDate(updateJadwal.tgl_selesai) : null,
      );
      setSelectedMethode(
        (updateJadwal.methodes_absensi || []).map((item: any) =>
          Number(item.id),
        ),
      );
      setSelectedTarget(
        (updateJadwal.targets_absensi || []).map((item: any) =>
          Number(item.id),
        ),
      );
    }
  }, [updateJadwal]);
  // END SET data awal
  const handleUpdateJadwalAkademik = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsLoading("updtJAka");

    const form: any = event.target as HTMLFormElement;

    const masuk = form.jamMasuk.value + ":" + form.menitMasuk.value + ":00";
    const keluar = form.jamKeluar.value + ":" + form.menitKeluar.value + ":59";

    const isSameArray = (a: (number | string)[], b: (number | string)[]) => {
      if (a.length !== b.length) return false;
      const sortedA = [...a].map(Number).sort();
      const sortedB = [...b].map(Number).sort();
      return sortedA.every((val, i) => val === sortedB[i]);
    };
    const normalizeTime = (t: string) => t.slice(0, 8);
    const formatDate = (date: Date | null) => {
      if (!date) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };
    //log
    console.log("COMPARE DEBUG:", {
      tahunajaran: [
        Number(form.tahunajaran.value),
        Number(updateJadwal.tahunajaran_id),
      ],
      nama: [form.namaJadwal.value, updateJadwal.absensi_name],
      masuk: [masuk, updateJadwal.start_time],
      keluar: [keluar, updateJadwal.end_time],
      tgl_mulai: [formatDate(startDate), updateJadwal.tgl_mulai?.split("T")[0]],
      tgl_selesai: [
        formatDate(endDate),
        updateJadwal.tgl_selesai?.split("T")[0],
      ],
      methode: [
        selectedMethode,
        (updateJadwal.methodes_absensi || []).map((m: any) => Number(m.id)),
      ],
      target: [
        selectedTarget,
        (updateJadwal.targets_absensi || []).map((t: any) => Number(t.id)),
      ],
    });
    // end log
    const isSame =
      Number(form.tahunajaran.value) === Number(updateJadwal.tahunajaran_id) &&
      form.namaJadwal.value === updateJadwal.absensi_name &&
      normalizeTime(masuk) === normalizeTime(updateJadwal.start_time) &&
      normalizeTime(keluar) === normalizeTime(updateJadwal.end_time) &&
      formatDate(startDate) === updateJadwal.tgl_mulai.split("T")[0] &&
      formatDate(endDate) === updateJadwal.tgl_selesai.split("T")[0] &&
      isSameArray(
        selectedMethode,
        (updateJadwal.methodes_absensi || []).map((m: any) => m.id),
      ) &&
      isSameArray(
        selectedTarget,
        (updateJadwal.targets_absensi || []).map((t: any) => t.id),
      );

    if (isSame) {
      setIsLoading("");
      setToaster({
        variant: "warning",
        message: "Tidak ada perubahan data",
      });
      return;
    }

    const data = {
      id: updateJadwal.id,
      inst: session.data?.user?.instansiId,
      tahunajaran_id: Number(form.tahunajaran.value),
      absensi_name: form.namaJadwal.value,
      tgl_mulai: startDate?.toLocaleDateString("en-CA"),
      tgl_selesai: endDate?.toLocaleDateString("en-CA"),
      start_time: masuk,
      end_time: keluar,
      targets_absensi: selectedTarget,
      methodes_absensi: selectedMethode,
      institution_id: session.data?.user?.instansi,
    };

    console.log("data yang akan diupdate:", data);
    try {
      const result = await jadwalUmumServices.UpdateData(
        data,
        session.data?.accessToken,
      );
      if (result.status !== 200 || result.data.status_code !== 200) {
        setIsLoading("");
        setToaster({
          variant: "warning",
          message: result.data.message,
        });
      } else {
        setIsLoading("");
        form.reset();
        setIsLoading("");
        setUpdateJadwal({});
        setToaster({
          variant: "success",
          message: "Update Jadwal Pelajaran Berhasil!",
        });
        // feth ulang seluruh data user
        const payload = {
          inst: session.data?.user?.instansiId,
          tahunajaran: tasem.ta,
        };
        const { data } = await jadwalUmumServices.getAllData(
          payload,
          session.data?.accessToken,
        );
        setData(data.data);
      }
    } catch (error) {
      setToaster({
        variant: "danger",
        message: `Terjadi kesalahan ${error}`,
      });
      setIsLoading("");
    }
  };

  useEffect(() => {
    if (!session?.data?.accessToken) return;
    const loadData = async () => {
      await getDataTA(); // tunggu selesai dulu
      await Promise.all([getDataMethodeAbsensi(), getDataTargetAbsensi()]); // setelah itu baru jalankan paralel
    };

    if (session.status === "authenticated") {
      loadData();
      console.log("data editing: ", updateJadwal);
    }
  }, [session?.data?.accessToken]);

  const getDataTA = async () => {
    const data = {
      inst: session.data?.user?.instansiId,
    };
    const res = await taSmesterServices.getDataTA(
      data,
      session.data?.accessToken,
    );
    if (res.status !== 200) {
      setToaster({
        variant: "danger",
        message: res.data.message,
      });
    } else {
      setTaData(res.data.data);
    }
    console.log(res);
  };
  const getDataTargetAbsensi = async () => {
    const data = {
      inst: session.data?.user?.instansiId,
    };
    try {
      const res = await targetAbsensiServices.getAllData(
        session.data?.accessToken,
      );
      if (res.status !== 200) {
        setToaster({
          variant: "danger",
          message: res.data.message,
        });
      } else {
        setTargetAbsensi(res.data.data);
      }
      console.log(res);
    } catch (error) {
      setToaster({
        variant: "danger",
        message: "Terjadi kesalahan",
      });
    } finally {
      setIsLoading("");
    }
  };
  const getDataMethodeAbsensi = async () => {
    try {
      const res = await methodeAbsensiServices.getAllData(
        session.data?.accessToken,
      );
      if (res.status !== 200) {
        setToaster({
          variant: "danger",
          message: res.data.message,
        });
      } else {
        setMethodeAbsensi(res.data.data);
      }
      console.log(res);
    } catch (error) {
      setToaster({
        variant: "danger",
        message: "Terjadi kesalahan",
      });
    } finally {
      setIsLoading("");
    }
  };

  const startTime = updateJadwal?.start_time
    ? updateJadwal.start_time.split(":")
    : ["", ""];
  const endTime = updateJadwal?.end_time
    ? updateJadwal.end_time.split(":")
    : ["", ""];

  const jamMasukDefault = startTime[0];
  const menitMasukDefault = startTime[1];
  const jamPulangDefault = endTime[0];
  const menitPulangDefault = endTime[1];

  return (
    <Modal open={open} onClose={() => setUpdateJadwal({})}>
      <Box
        sx={{
          width: 600,
          bgcolor: "#fff",
          borderRadius: 2,
          p: 3,
          mx: "auto",
          mt: "10%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <div className=" flex justify-between items-center bg-green-200 text-center p-3 border-y-1 border-[var(--primary-color)] mx-[-20px] mb-4">
          <h1 className="font-semibold">Update Data Absensi Mata Pelajaran</h1>
          <ButtonBase onClick={onClose}>
            <i className="bx bx-x text-2xl"></i>
          </ButtonBase>
        </div>

        <form onSubmit={handleUpdateJadwalAkademik}>
          <div className="border-b border-gray-800 py-2 mb-4 flex gap-4 items-center">
            <Typography className="text-[var(--primary-color)] whitespace-nowrap">
              Tahun Ajaran
            </Typography>

            <Select
              name="tahunajaran"
              defaultValue={updateJadwal?.ta}
              options={
                taData &&
                taData.map((data: any) => ({
                  value: data.id,
                  label: data.name,
                }))
              }
            />
          </div>
          <div className="mb-4">
            <TextField
              fullWidth
              label="Nama Jadwal"
              name="namaJadwal"
              value={updateJadwal?.absensi_name}
              onChange={(e) => {
                setUpdateJadwal({
                  ...updateJadwal,
                  absensi_name: e.target.value,
                });
              }}
            />
          </div>

          <div className="flex gap-4 mb-5">
            <div className="flex-col">
              <div className="flex gap-2">
                <p className="text-sm">Dari Tanggal</p>
                <CalendarIcon />
              </div>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                className={`w-full border rounded px-2 py-1`}
              />
            </div>

            {/* Sampai Tanggal */}
            <div className="flex-col">
              <div className="flex gap-2">
                <p className="text-sm">Sampai Tanggal</p>
                <CalendarIcon />
              </div>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
                className="w-full border rounded px-2 py-1"
              />
            </div>
          </div>

          <div>
            <div className="flex gap-4 mb-5">
              <div className="w-1/2 flex border border-1 border-gray-800 p-2 rounded-lg">
                <div className="flex-col gap-2">
                  <b className="w-full bg-green-100 px-5 py-1">Jam Mulai</b>
                  <div className="flex gap-2 items-center">
                    <Select
                      className="w-full mb-4"
                      label="Jam"
                      name="jamMasuk"
                      defaultValue={jamMasukDefault}
                      options={
                        hours &&
                        hours.map((jam) => ({
                          value: jam,
                          label: jam,
                        }))
                      }
                    />
                    <p>:</p>
                    <Select
                      className="w-full mb-4"
                      label="Menit"
                      name="menitMasuk"
                      defaultValue={menitMasukDefault}
                      options={
                        minutes &&
                        minutes.map((mnt) => ({
                          value: mnt,
                          label: mnt,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="w-1/2 flex border border-1 border-gray-800 p-2 rounded-lg">
                <div className="flex-col gap-2">
                  <b className="w-full bg-green-100 px-5 py-1">Jam Selesai</b>
                  <div className="flex gap-2 items-center">
                    <Select
                      className="w-full mb-4"
                      label="Jam"
                      name="jamKeluar"
                      defaultValue={jamPulangDefault}
                      options={
                        hours &&
                        hours.map((jam) => ({
                          value: jam,
                          label: jam,
                        }))
                      }
                    />
                    <p>:</p>
                    <Select
                      className="w-full mb-4"
                      label="Menit"
                      name="menitKeluar"
                      defaultValue={menitPulangDefault}
                      options={
                        minutes &&
                        minutes.map((mnt) => ({
                          value: mnt,
                          label: mnt,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <MSSMethodeAbsensi
              required
              label="Metode Absen"
              placeholder="Cari metode..."
              options={methodeAbsensi}
              value={selectedMethode}
              onChange={setSelectedMethode}
              className="mb-5"
              error={error}
            />
            <MSSTargetAbsensi
              required
              label="Target Absensi"
              placeholder="Cari target..."
              options={targetAbsensi}
              value={selectedTarget}
              onChange={setSelectedTarget}
              className="mb-5"
              error={error}
            />
            <div className="flex gap-4 w-[70%] ml-auto mt-10">
              <Button
                type="button"
                className="[background:var(--gradient-secondary)] hover:[background:var(--secondary-dark)]"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading === "updtJAka"}
                className="[background:var(--gradient-primary)] hover:[background:var(--primary-color)]"
              >
                {isLoading === "updtJAka" ? (
                  <div className="box-loader">
                    <div className="loader" />
                    <p>Loading...</p>
                  </div>
                ) : (
                  "Simpan"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalUpdateAbsensiUmum;
