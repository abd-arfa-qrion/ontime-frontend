import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Modal, Box, TextField, Button, CircularProgress } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TahunAjaran } from "@/type/Tahunajaran.type";
import { useSession } from "next-auth/react";
import taSmesterServices from "@/pages/api/services/tasmester";
import Select from "@/components/ui/select";
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

type Props = {
  open: boolean;
  onClose: () => void;
  setToaster: Dispatch<SetStateAction<{}>>;
  setAddAbsensiUmum: Dispatch<SetStateAction<boolean>>;
  setDataJdwlUmum: Dispatch<SetStateAction<JadwalUmum[]>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
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
      setIsLoading(false);
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
      setIsLoading(false);
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
      setIsLoading(false);
    }
  };
  const handleAddAbsensi = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

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
      setIsLoading(false);
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
      tahunajaran_id: Number(form.tahunajaran.value),
      absensi_name: namaAbsensi,
      tgl_mulai: startDate?.toLocaleDateString("en-CA"),
      tgl_selesai: endDate?.toLocaleDateString("en-CA"),
      start_time: masuk,
      end_time: keluar,
      targets_absensi: selectedTarget,
      methodes_absensi: selectedMethode,
      institution_id: session.data?.user?.instansi,
    };
    console.log(data);
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
          <Select
            className="w-full mb-4"
            label="Tahun Ajaran"
            name="tahunajaran"
            options={
              taData &&
              taData.map((dt) => ({
                value: dt.id.toString(),
                label: dt.name,
              }))
            }
          />

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
                  <Select
                    className="w-full mb-4"
                    label="Jam"
                    name="jamMasuk"
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
                  <Select
                    className="w-full mb-4"
                    label="Jam"
                    name="jamKeluar"
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
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "var(--primary-color)",
              textTransform: "none",
            }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={20} /> : "Simpan"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};
export default ModalAddAbsensiUmum;
