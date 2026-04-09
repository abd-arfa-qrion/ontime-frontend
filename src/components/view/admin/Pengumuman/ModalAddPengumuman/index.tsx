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
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TahunAjaran } from "@/type/Tahunajaran.type";
import { useSession } from "next-auth/react";
import taSmesterServices from "@/pages/api/services/tasmester";
import Select from "@/components/ui/select";
import CalendarIcon from "@/components/icons/CalendarIcon";
import targetAbsensiServices from "@/pages/api/services/targetabsensi";
import { TargetAbsensi } from "@/type/TargetAbsensi.type";
import { JadwalUmum } from "@/type/Jadwalumum.type";
import { formatTimestamp } from "@/utils/formatdate";
import MSSTargetPengumuman from "@/components/ui/ontime/multiselect/mstargetpengumuman";
import pengumumanServices from "@/pages/api/services/pengumuman";
import { Pengumuman } from "@/type/Pengumuman.type";

type Props = {
  open: boolean;
  onClose: () => void;
  setToaster: Dispatch<SetStateAction<{}>>;
  setAddPengumuman: Dispatch<SetStateAction<boolean>>;
  setData: Dispatch<SetStateAction<Pengumuman[]>>;
  isLoading: string;
  setIsLoading: Dispatch<SetStateAction<string>>;
};
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "95%", // mobile
    sm: "80%", // tablet kecil
    md: "70%", // tablet besar
    lg: "50%", // desktop
  },
  maxWidth: 900,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};
const ModalAddPengumuman = (props: Props) => {
  const {
    open,
    onClose,
    setToaster,
    setAddPengumuman,
    setData,
    isLoading,
    setIsLoading,
  } = props;

  const session: any = useSession();
  const [judul, setJudul] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [taData, setTaData] = useState<TahunAjaran[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<(number | string)[]>([]);

  const [isSchedule, setIsSchedule] = useState<boolean>(false);
  const [isDraft, setIsDraft] = useState<boolean>(false);

  //state get data
  const [targetAbsensi, setTargetAbsensi] = useState<TargetAbsensi[]>([]);

  useEffect(() => {
    if (!session?.data?.accessToken) return;

    const loadData = async () => {
      await getDataTA(); // tunggu selesai dulu
      await Promise.all([getDataTarget()]); // setelah itu baru jalankan paralel
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

  const getDataTarget = async () => {
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

  const handleAddPengumuman = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading("publishBtn");

    const form = e.currentTarget;
    const user = session.data?.user;
    const token = session.data?.accessToken;

    const tglMulai = startDate
      ? new Date(startDate).toISOString()
      : new Date().toISOString();

    const tglSelesai = endDate ? new Date(endDate).toISOString() : null;

    const statPublish = isSchedule ? "schedule" : isDraft ? "draft" : "publish";

    const targetString = selectedTarget
      .map((id) => targetAbsensi.find((t) => t.id === id)?.target)
      .filter(Boolean)
      .join(",");

    const data = {
      inst: user?.instansiId,
      tahunajaran_id: Number(form.tahunajaran?.value),
      title: judul,
      content: form.content?.value,
      start_date: tglMulai,
      end_date: tglSelesai,
      target: targetString,
      status_publish: statPublish,
      institution_id: user?.instansi,
      username: user?.username,
    };

    try {
      const res = await pengumumanServices.AddData(data, token);

      if (res.status === 200 && res.data.status_code === 200) {
        setToaster({
          variant: "success",
          message: "Tambah Jadwal Umum berhasil!",
        });

        const resData = await pengumumanServices.getAllData(
          { inst: user?.instansiId },
          token,
        );

        setData(resData.data.data);
        setAddPengumuman(false);
        onClose();
      } else {
        setToaster({
          variant: "danger",
          message: res.data.message,
        });
      }
    } catch (error) {
      setToaster({
        variant: "danger",
        message: "Terjadi kesalahan",
      });
    } finally {
      setIsLoading("");
    }
  };

  const handleSchdBox = () => {
    if (isSchedule) {
      setIsSchedule(false);
    } else {
      setIsSchedule(true);
    }
    setStartDate(null);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <h1 className="bg-green-200 text-center py-3 font-semibold border-y-1 border-[var(--primary-color)] mx-[-20px] mb-4">
          Tambah Pengumuman
        </h1>
        <form onSubmit={handleAddPengumuman}>
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
            label="Judul Pengumuman"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Kontent Pengumuman"
            name="content"
            multiline
            minRows={3}
            maxRows={8}
            fullWidth
            sx={{ mb: 2 }}
          />

          <MSSTargetPengumuman
            label="Target Absensi"
            placeholder="Cari target..."
            options={targetAbsensi}
            value={selectedTarget}
            onChange={setSelectedTarget}
            className="mb-5"
          />

          <div className="flex gap-4 mb-5 items-center justify-end">
            <FormControlLabel
              control={<Checkbox name="schedule" onChange={handleSchdBox} />}
              label="Schedule"
            />
            {/* Dari Tanggal */}

            {/* ############### DATE PICKER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
              {/* Dari Tanggal */}
              <div className="flex flex-col gap-1 w-full">
                <label
                  className={`text-sm font-medium ${!isSchedule ? "text-gray-200" : ""}`}
                >
                  Dari Tanggal
                </label>

                <div className="relative w-full">
                  <DatePicker
                    required
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Pilih tanggal"
                    wrapperClassName="w-full"
                    className={`w-full border ${!isSchedule ? "bg-gray-200" : "border-gray-800"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />

                  <CalendarIcon
                    className={`${!isSchedule ? "text-gray-200" : ""} absolute right-3 top-2.5 text-gray-400 w-4 h-4 pointer-events-none`}
                  />
                </div>
              </div>

              {/* Sampai Tanggal */}
              <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium text-gray-700">
                  Sampai Tanggal
                </label>

                <div className="relative w-full">
                  <DatePicker
                    required
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Pilih tanggal"
                    wrapperClassName="w-full"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />

                  <CalendarIcon className="absolute right-3 top-2.5 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
          {/* Button */}
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "var(--primary-color)",
              textTransform: "none",
            }}
            type="submit"
            disabled={isLoading === "submitBtn"}
          >
            {isLoading === "submitBtn" ? (
              <div className="box-loader">
                <div className="loader" />
                <p>Loading...</p>
              </div>
            ) : (
              "Publish"
            )}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};
export default ModalAddPengumuman;
