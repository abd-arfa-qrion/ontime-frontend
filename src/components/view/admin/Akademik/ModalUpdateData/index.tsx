import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TahunAjaran } from "@/type/Tahunajaran.type";
import { useSession } from "next-auth/react";
import taSmesterServices from "@/pages/api/services/tasmester";
import Select from "@/components/ui/select";
import CalendarIcon from "@/components/icons/CalendarIcon";
import { Kaldik } from "@/type/Kaldik.type";
import ColorPickerField from "@/components/ui/colorPickerField";
import kaldikServices from "@/pages/api/services/kaldik";

type Props = {
  open: boolean;
  onClose: () => void;
  setToaster: Dispatch<SetStateAction<{}>>;
  setData: Dispatch<SetStateAction<Kaldik[]>>;
  setModalUpdate: Dispatch<SetStateAction<boolean>>;
  editingData: Kaldik;
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
    lg: "35%", // desktop
  },
  maxWidth: 900,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};
const ModalUpdateKaldik = (props: Props) => {
  const { open, onClose, setToaster, setData, editingData } = props;

  const session: any = useSession();
  //list parameter tahun ajaran
  const [taData, setTaData] = useState<TahunAjaran[]>([]);

  const [kegiatan, setKegiatan] = useState<string>(editingData.keterangan);
  const [startDate, setStartDate] = useState<Date>(editingData.tgl_awal);
  const [endDate, setEndDate] = useState<Date>(editingData.tgl_akhir);

  const [error, setError] = useState<string>("");
  const [colorLabel, setColorLabel] = useState(editingData.label);

  const [isLoading, setIsLoading] = useState("");

  //state get data

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

  const handleUpdateJadwal = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading("submitAddKaldik");

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (formData.get("kegiatan") === "") {
      setError("kegiatan");
      return;
    }

    const user = session.data?.user;

    const tglMulai = startDate
      ? new Date(startDate).toISOString()
      : new Date().toISOString();

    const tglSelesai = endDate ? new Date(endDate).toISOString() : null;
    const masuk = form.jamMasuk.value + ":" + form.menitMasuk.value + ":00";
    const keluar = form.jamKeluar.value + ":" + form.menitKeluar.value + ":59";

    const data = {
      id: editingData.id,
      inst: user?.instansiId,
      tahunajaran_id: Number(form.tahunajaran?.value),
      keterangan: formData.get("kegiatan"),
      tgl_awal: tglMulai,
      tgl_akhir: tglSelesai,
      start_time: masuk,
      end_time: keluar,
      label: colorLabel,
      institution_id: user?.instansi,
    };
    console.log(data);

    try {
      const res = await kaldikServices.UpdateData(
        data,
        session.data?.accessToken,
      );

      if (res.status !== 200 && res.data.status_code !== 200) {
        setToaster({
          variant: "danger",
          message: res.data.message,
        });
        return;
      }

      const resData = await kaldikServices.getAllData(
        { inst: user?.instansiId },
        session.data?.accessToken,
      );
      setToaster({
        variant: "success",
        message: res.data.message,
      });
      setData(resData.data.data);
      onClose();
    } catch (error) {
      setToaster({
        variant: "danger",
        message: "Terjadi kesalahan",
      });
    } finally {
      setIsLoading("");
    }
  };
  const handleClickColor = (color: string) => {
    setColorLabel(color);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <h1 className="bg-green-200 text-center py-3 font-semibold border-y-1 border-[var(--primary-color)] mx-[-20px] mb-4">
          Tambah Data Kegiatan Kalender Akademik (KALDIK)
        </h1>
        <form onSubmit={handleUpdateJadwal}>
          {/* ############### TAHUN AJARAN */}
          <Select
            required
            className="w-full mb-4"
            label="Tahun Ajaran"
            name="tahunajaran"
            defaultValue={editingData.tahunajaran_id}
            options={
              taData &&
              taData.map((dt) => ({
                value: dt.id.toString(),
                label: dt.name,
              }))
            }
          />

          {/* ############### NAMA ABSENSI */}
          <TextField
            required
            fullWidth
            size="medium"
            label="Kegiatan"
            name="kegiatan"
            value={kegiatan}
            onChange={(e) => {
              setKegiatan(e.target.value);
              setError("");
              setIsLoading("");
            }}
            sx={{ mb: 2 }}
          />
          <span className="text-red-600">
            {error === "kegiatan" ? "Kegiatan harus diisi!" : ""}
          </span>

          {/* ############### DATE PICKER */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
            {/* Dari Tanggal */}
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium text-gray-700">
                Dari Tanggal
              </label>

              <div className="relative w-full">
                <DatePicker
                  required
                  selected={startDate}
                  onChange={(date) => {
                    if (date) {
                      setStartDate(date);
                    }
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Pilih tanggal"
                  wrapperClassName="w-full"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <CalendarIcon className="absolute right-3 top-2.5 text-gray-400 w-4 h-4 pointer-events-none" />
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
                  onChange={(date) => {
                    if (date) {
                      setEndDate(date);
                    }
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Pilih tanggal"
                  wrapperClassName="w-full"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <CalendarIcon className="absolute right-3 top-2.5 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ################### Time picker */}
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
                    required
                    className="w-full mb-4"
                    label="Jam"
                    name="jamMasuk"
                    defaultValue={editingData.start_time.substring(0, 2)}
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
                    required
                    className="w-full mb-4"
                    label="Menit"
                    name="menitMasuk"
                    defaultValue={editingData.start_time.substring(3, 5)}
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
                    required
                    className="w-full mb-4"
                    label="Jam"
                    name="jamKeluar"
                    defaultValue={editingData.end_time.substring(0, 2)}
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
                    required
                    className="w-full mb-4"
                    label="Menit"
                    name="menitKeluar"
                    defaultValue={editingData.end_time.substring(3, 5)}
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
          {/* ################### LABEL WARNA */}
          <div className="flex gap-2 justify-between mb-5">
            <div className="flex gap-1">
              <p
                className="w-[40px] h-[40px] bg-[#950606] px-2 py-1 text-sm cursor-pointer"
                onClick={() => handleClickColor("#950606")}
              ></p>
              <p
                className="w-[40px] h-[40px] bg-[#d3d82d] px-2 py-1 text-sm cursor-pointer"
                onClick={() => handleClickColor("#d3d82d")}
              ></p>
              <p
                className="w-[40px] h-[40px] bg-[#0a0dc7] px-2 py-1 text-sm cursor-pointer"
                onClick={() => handleClickColor("#0a0dc7")}
              ></p>
              <p
                className="w-[40px] h-[40px] bg-[#17ad23] px-2 py-1 text-sm cursor-pointer"
                onClick={() => handleClickColor("#17ad23")}
              ></p>
            </div>
            <div className="w-72">
              <ColorPickerField value={colorLabel} onChange={setColorLabel} />
            </div>
          </div>
          {/* ################### BUTTON SUBMIT */}
          {/* Button */}
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "var(--primary-color)",
              textTransform: "none",
              py: 1.5,
              fontSize: "12pt",
            }}
            type="submit"
            disabled={isLoading === "submitAddKaldik"}
          >
            {isLoading === "submitAddKaldik" ? (
              <div className="box-loader">
                <div className="loader" />
                <p>Loading...</p>
              </div>
            ) : (
              "Simpan"
            )}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};
export default ModalUpdateKaldik;
