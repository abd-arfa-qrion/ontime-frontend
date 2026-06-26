import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  Modal,
  Box,
  TextField,
  CircularProgress,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  MenuItem,
  Typography,
} from "@mui/material";
import Button from "@/components/ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TahunAjaran } from "@/type/Tahunajaran.type";
import { useSession } from "next-auth/react";
import taSmesterServices from "@/pages/api/services/tasmester";
import SelectCustom from "@/components/ui/select";
import CalendarIcon from "@/components/icons/CalendarIcon";
import targetAbsensiServices from "@/pages/api/services/targetabsensi";
import methodeAbsensiServices from "@/pages/api/services/methodeabsensi";
import { TargetAbsensi } from "@/type/TargetAbsensi.type";
import { MethodeAbsensi } from "@/type/MethodeAbsensi.type";
import MSSTargetAbsensi from "@/components/ui/ontime/multiselect/mstargetabsensi";
import MSSMethodeAbsensi from "@/components/ui/ontime/multiselect/msmethodeabsensi";
import jadwalUmumServices from "@/pages/api/services/jadwalumum";
import { JadwalUmum } from "@/type/Jadwalumum.type";
import Validate from "@/utils/validation";
import { getTahunAjaranWithSemester } from "@/utils/tasemester";
import { useTahunAjaranStore } from "@/store/tahunAjaranStore";

type Props = {
  open: boolean;
  onClose: () => void;
  setToaster: Dispatch<SetStateAction<{}>>;
  setAddAbsensiUmum: Dispatch<SetStateAction<boolean>>;
  setDataJdwlUmum: Dispatch<SetStateAction<JadwalUmum[]>>;
  isLoading: string;
  setIsLoading: Dispatch<SetStateAction<string>>;
};
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);
const ModalAddAbsensiUmum = (props: Props) => {
  const {
    open,
    onClose,
    setToaster,
    setAddAbsensiUmum,
    setDataJdwlUmum,
    isLoading,
    setIsLoading,
  } = props;

  const session: any = useSession();
  const [namaAbsensi, setNamaAbsensi] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [taData, setTaData] = useState<TahunAjaran[]>([]);
  const [error, setError] = useState<string>("");

  const [selectedTarget, setSelectedTarget] = useState<(number | string)[]>([]);
  const [selectedMethode, setSelectedMethode] = useState<(number | string)[]>(
    [],
  );

  //state get data
  const [methodeAbsensi, setMethodeAbsensi] = useState<MethodeAbsensi[]>([]);
  const [targetAbsensi, setTargetAbsensi] = useState<TargetAbsensi[]>([]);

  const activeTahunAjaran = useTahunAjaranStore(
    (state) => state.activeTahunAjaran,
  );
  // const tasem = getTahunAjaranWithSemester();

  useEffect(() => {
    if (!session?.data?.accessToken) return;

    const loadData = async () => {
      await getDataTA(); // tunggu selesai dulu
      await Promise.all([getDataMethodeAbsensi(), getDataTargetAbsensi()]); // setelah itu baru jalankan paralel
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
  const handleAddAbsensi = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading("btnSubmitUmum");

    const form: any = e.target as HTMLFormElement;
    const validations = [
      {
        condition: !form.jamMasuk.value || !form.menitMasuk.value,
        error: "waktuMasuk",
        message: "Maaf, Jam Masuk wajib diisi!",
      },
      {
        condition: !form.jamKeluar.value || !form.menitKeluar.value,
        error: "waktuKeluar",
        message: "Maaf, Jam Keluar wajib diisi!",
      },
      {
        condition: !namaAbsensi,
        error: "namaAbsensi",
        message: "Maaf, Nama Absensi wajib diisi!",
      },
      {
        condition: !startDate,
        error: "tglMulai",
        message: "Maaf, Tanggal Mulai wajib diisi!",
      },
      {
        condition: !endDate,
        error: "tglSelesai",
        message: "Maaf, Tanggal Selesai wajib diisi!",
      },
      {
        condition: !selectedMethode.length,
        error: "methode",
        message: "Maaf, Metode wajib diisi!",
      },
      {
        condition: !selectedTarget.length,
        error: "target",
        message: "Maaf, Target wajib diisi!",
      },
    ];
    const error = Validate(validations);

    if (error) {
      setError(error.error);
      setIsLoading("");
      setToaster({
        variant: "danger",
        message: error.message,
      });
      return;
    }

    const masuk = form.jamMasuk.value + ":" + form.menitMasuk.value + ":00";
    const keluar = form.jamKeluar.value + ":" + form.menitKeluar.value + ":59";
    const data = {
      inst: session.data?.user?.instansiId,
      tahunajaran_id: Number(activeTahunAjaran?.id),
      absensi_name: namaAbsensi,
      tgl_mulai: startDate?.toLocaleDateString("en-CA"),
      tgl_selesai: endDate?.toLocaleDateString("en-CA"),
      start_time: masuk,
      end_time: keluar,
      targets_absensi: selectedTarget,
      methodes_absensi: selectedMethode,
      institution_id: session.data?.user?.instansi,
    };
    console.log("ini data yang akan diinput: ", data);
    try {
      const res = await jadwalUmumServices.AddData(
        data,
        session.data?.accessToken,
      );
      if (res.status === 200) {
        if (res.data.status_code === 200) {
          setToaster({
            variant: "success",
            message: "Tambah Jadwal Umum berhasil!",
          });
          console.log(res);
          const dataInst = {
            inst: session.data?.user?.instansiId,
            tahunajaran: activeTahunAjaran?.name,
          };

          // fetch ulang seluruh data user
          const resData = await jadwalUmumServices.getAllData(
            dataInst,
            session.data?.accessToken,
          );
          console.log(resData);
          setDataJdwlUmum(resData.data.data);
          setAddAbsensiUmum(false);
        } else {
          setToaster({
            variant: "danger",
            message: res.data.message,
          });
        }
      }
    } catch (error) {
      setToaster({
        variant: "danger",
        message: "Terjadi kesalahan",
      });
    }
    onClose();
  };

  const jamMasukDefault = "00";
  const menitMasukDefault = "00";
  const jamPulangDefault = "00";
  const menitPulangDefault = "00";
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
        }}
      >
        <h1 className="bg-green-200 text-center py-3 font-semibold border-y-1 border-[var(--primary-color)] mx-[-20px] mb-4">
          Tambah Data Absensi Umum
        </h1>
        <form onSubmit={handleAddAbsensi}>
          {/* Tahun Ajaran */}
          <div className="border-b border-gray-800 py-2 mb-4 flex gap-4 items-center">
            <Typography className="text-[var(--primary-color)] whitespace-nowrap">
              Tahun Ajaran
            </Typography>

            <b>{activeTahunAjaran?.name}</b>
          </div>

          {/* Nama Absensi */}
          <TextField
            fullWidth
            label="Nama Absensi"
            name="namaAbsensi"
            value={namaAbsensi}
            onChange={(e) => setNamaAbsensi(e.target.value)}
            error={error === "namaAbsensi"}
            helperText={
              error === "namaAbsensi" ? "Nama absensi wajib diisi" : ""
            }
            sx={{ mb: 2 }}
          />

          {/* Dari Tanggal */}
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
                className={`w-full border rounded px-2 py-1 ${error === "tglMulai" ? "border-red-500" : "border-gray-800"}`}
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
          {(error === "waktuMasuk" || error === "waktuKeluar") && (
            <span className="text-red-500 text-sm">
              Jam Masuk & Jam Keluar Wajib di Isi!
            </span>
          )}
          <div className="flex gap-4 mb-5">
            <div
              className={`w-1/2 flex border border-1 ${error === "waktuMasuk" ? "border-red-500" : "border-gray-800"} border-gray-800 p-2 rounded-lg`}
            >
              <div className="flex-col gap-2">
                <b className="w-full bg-green-100 px-2 py-1 text-sm ml-[-10px]">
                  Jam Mulai
                </b>
                <div className="flex gap-2 items-center">
                  <SelectCustom
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
                  <SelectCustom
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
                  Jam Selesai
                </b>
                <div className="flex gap-2 items-center">
                  <SelectCustom
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
                  <SelectCustom
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
              disabled={isLoading === "btnSubmitUmum"}
              className="[background:var(--gradient-primary)] hover:[background:var(--primary-color)]"
            >
              {isLoading === "btnSubmitUmum" ? (
                <CircularProgress size={20} />
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
export default ModalAddAbsensiUmum;
