import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Modal, Box, TextField, InputAdornment } from "@mui/material";

import "react-datepicker/dist/react-datepicker.css";
import { TahunAjaran } from "@/type/Tahunajaran.type";
import taSmesterServices from "@/pages/api/services/tasmester";
import Select from "@/components/ui/select";
import { JadwalMasuk } from "@/type/Jadwalmasuk.type";
import jadwalMasukServices from "@/pages/api/services/jadwalmasuk";
import { getTahunAjaranWithSemester } from "@/utils/tasemester";
import Button from "@/components/ui/button";
import { useTahunAjaranStore } from "@/store/tahunAjaranStore";

type Props = {
  open: boolean;
  onClose: () => void;
  setToaster: Dispatch<SetStateAction<{}>>;
  editingData: JadwalMasuk | null;
  isLoading: string;
  setIsLoading: Dispatch<SetStateAction<string>>;
  session: any;
  setData: Dispatch<SetStateAction<JadwalMasuk[]>>;
};
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);
const ModalUpdateAbsensiMasuk = (props: Props) => {
  const {
    open,
    onClose,
    setToaster,
    editingData,
    isLoading,
    setIsLoading,
    session,
    setData,
  } = props;

  const [taData, setTaData] = useState<TahunAjaran[]>([]);
  const [error, setError] = useState<string>("");

  const activeTahunAjaran = useTahunAjaranStore(
    (state) => state.activeTahunAjaran,
  );

  useEffect(() => {
    if (!session?.data?.accessToken) return;

    const loadData = async () => {
      await getDataTA(); // tunggu selesai dulu
    };

    if (session.status === "authenticated") {
      loadData();
    }
  }, [session?.data?.accessToken]);
  const getDataTA = async () => {
    const data = {
      inst: session.data?.user?.instansiId,
    };
    try {
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
    } catch (error) {
      setToaster({
        variant: "danger",
        message: "Terjadi kesalahan",
      });
    } finally {
      setIsLoading("");
    }
  };

  const handleUpdateAbsensi = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading("submitBtn1");

    const form: any = e.target as HTMLFormElement;
    const payload = {
      id: editingData?.id,
      inst: session.data?.user?.instansiId,
      tahunajaran_id: Number(form.tahunajaran_id.value),
      hari: form.hari.value,
      start_time: form.jamMasuk.value + ":" + form.menitMasuk.value + ":00",
      end_time: form.jamKeluar.value + ":" + form.menitKeluar.value + ":59",
      toleransi_time: Number(form.toleransi_time.value),
      institution_id: session.data?.user?.instansi,
    };
    console.log(payload);
    try {
      const resData = await jadwalMasukServices.UpdateData(
        payload,
        session.data?.accessToken,
      );

      if (resData.status !== 200 || resData.data.status_code !== 200) {
        setToaster({
          variant: "danger",
          message: resData.data.message,
        });
        return;
      }

      const data = {
        inst: session.data?.user?.instansiId,
        tahunajaran: activeTahunAjaran?.name,
      };

      const res = await jadwalMasukServices.getAllData(
        data,
        session.data?.accessToken,
      );
      if (res.status !== 200 || res.data.status_code !== 200) {
        setToaster({
          variant: "danger",
          message: res.data.message,
        });
        return;
      }
      setData(res.data.data);
      setToaster({
        variant: "success",
        message: resData.data.message,
      });
    } catch (error) {
      setToaster({
        variant: "danger",
        message: "Terjadi kesalahan",
      });
    } finally {
      setIsLoading("");
    }
    onClose();
  };

  const startTime = editingData?.start_time
    ? editingData.start_time.split(":")
    : ["", ""];
  const endTime = editingData?.end_time
    ? editingData.end_time.split(":")
    : ["", ""];

  const jamMasukDefault = startTime[0];
  const menitMasukDefault = startTime[1];
  const jamPulangDefault = endTime[0];
  const menitPulangDefault = endTime[1];
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 420,
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
        <h1 className="bg-green-200 text-center py-3 font-semibold border-y-1 border-[var(--primary-color)] mx-[-20px] mb-4">
          Update Absensi Masuk & Pulang Mengajar
        </h1>
        <form onSubmit={handleUpdateAbsensi} className="flex flex-col gap-5">
          {/* Tahun Ajaran */}
          <TextField
            fullWidth
            size="small"
            name="tahunajaran_id"
            defaultValue={editingData?.tahunajaran_id}
            hidden
          />
          <TextField
            fullWidth
            size="small"
            label="Tahun Ajaran"
            name="tahunajaran"
            defaultValue={editingData?.ta}
            disabled
            sx={{ mb: 2 }}
          />

          {/* Nama Absensi */}
          <TextField
            fullWidth
            size="small"
            label="Hari"
            name="hari"
            defaultValue={editingData?.hari}
            disabled
            sx={{ mb: 2 }}
          />

          {/* Dari Waktu */}
          <div className="flex gap-4 mb-5">
            <div
              className={`w-1/2 flex border border-1 ${error === "waktuMasuk" ? "border-red-500" : "border-gray-800"} border-gray-800 p-2 rounded-lg`}
            >
              <div className="flex-col gap-2">
                <b className="w-full bg-green-100 px-2 py-1 text-sm ml-[-10px]">
                  Jam Masuk
                </b>
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
            <div
              className={`w-1/2 flex border border-1 ${error === "waktuKeluar" ? "border-red-500" : "border-gray-800"} border-gray-800 p-2 rounded-lg`}
            >
              <div className="flex-col gap-2">
                <b className="w-full bg-green-100 px-2 py-1 text-sm ml-[-10px]">
                  Jam pulang
                </b>
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

          <TextField
            fullWidth
            size="small"
            label="Toleransi Keterlambatan"
            name="toleransi_time"
            type="number"
            defaultValue={editingData?.toleransi_time}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">menit</InputAdornment>
              ),
            }}
          />

          {/* Button */}
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
              disabled={isLoading === "submitBtn1"}
              className="[background:var(--gradient-primary)] hover:[background:var(--primary-color)]"
            >
              {isLoading === "submitBtn1" ? (
                <div className="box-loader">
                  <div className="loader" />
                  <p>Loading...</p>
                </div>
              ) : (
                "Simpan"
              )}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};
export default ModalUpdateAbsensiMasuk;
