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

import { useSession } from "next-auth/react";

import { TahunAjaran } from "@/type/Tahunajaran.type";
import { TargetAbsensi } from "@/type/TargetAbsensi.type";
import { Pengumuman } from "@/type/Pengumuman.type";

import taSmesterServices from "@/pages/api/services/tasmester";
import targetAbsensiServices from "@/pages/api/services/targetabsensi";
import pengumumanServices from "@/pages/api/services/pengumuman";

import Select from "@/components/ui/select";
import CalendarIcon from "@/components/icons/CalendarIcon";
import MSSTargetPengumuman from "@/components/ui/ontime/multiselect/mstargetpengumuman";

type Props = {
  open: boolean;
  onClose: () => void;
  setToaster: Dispatch<SetStateAction<any>>;
  editData: Pengumuman;
  setEditData: Dispatch<SetStateAction<any>>;
  setData: Dispatch<SetStateAction<Pengumuman[]>>;
  setEditModal: Dispatch<SetStateAction<boolean>>;
  isLoading: string;
  setIsLoading: Dispatch<SetStateAction<string>>;
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "95%",
    sm: "80%",
    md: "70%",
    lg: "50%",
  },
  maxWidth: 900,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

const ModalEditPengumuman = (props: Props) => {
  const {
    open,
    onClose,
    setToaster,
    editData,
    setData,
    setEditModal,
    isLoading,
    setIsLoading,
  } = props;

  const session: any = useSession();

  const [judul, setJudul] = useState("");
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isSchedule, setIsSchedule] = useState(false);

  const [selectedTarget, setSelectedTarget] = useState<(number | string)[]>([]);

  const [taData, setTaData] = useState<TahunAjaran[]>([]);
  const [targetAbsensi, setTargetAbsensi] = useState<TargetAbsensi[]>([]);

  const sessionData: any = useSession();

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    if (!sessionData?.data?.accessToken) return;

    const load = async () => {
      await getDataTA();
      await getDataTarget();
    };

    load();
  }, [sessionData?.data?.accessToken]);

  /* ================= SET FORM DATA ================= */

  useEffect(() => {
    if (!editData) return;

    setJudul(editData.title || "");
    setContent(editData.content || "");

    setStartDate(editData.start_date ? new Date(editData.start_date) : null);
    setEndDate(editData.end_date ? new Date(editData.end_date) : null);

    setIsSchedule(editData.status_publish === "schedule");

    if (editData.target) {
      const arrTarget = editData.target.split(",").map((t) => t.trim());

      const targetIds = targetAbsensi
        .filter((t) => arrTarget.includes(t.target))
        .map((t) => t.id);

      setSelectedTarget(targetIds);
    }
  }, [editData, targetAbsensi]);

  /* ================= GET DATA ================= */

  const getDataTA = async () => {
    try {
      const res = await taSmesterServices.getDataTA(
        { inst: sessionData.data.user.instansiId },
        sessionData.data.accessToken,
      );

      if (res.status === 200) {
        setTaData(res.data.data);
      }
    } catch {
      setToaster({
        variant: "danger",
        message: "Gagal mengambil data tahun ajaran",
      });
    }
  };

  const getDataTarget = async () => {
    try {
      const res = await targetAbsensiServices.getAllData(
        sessionData.data.accessToken,
      );

      if (res.status === 200) {
        setTargetAbsensi(res.data.data);
      }
    } catch {
      setToaster({
        variant: "danger",
        message: "Gagal mengambil target",
      });
    }
  };

  /* ================= UPDATE DATA ================= */

  const handleUpdatePengumuman = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading("submitBtn");

    const user = sessionData.data.user;
    const token = sessionData.data.accessToken;

    const targetString = selectedTarget
      .map((id) => targetAbsensi.find((t) => t.id === id)?.target)
      .filter(Boolean)
      .join(",");

    const data = {
      id: editData.id,
      inst: user.instansiId,
      title: judul,
      content: content,
      start_date: startDate
        ? new Date(startDate).toISOString()
        : editData.start_date,
      end_date: endDate ? new Date(endDate).toISOString() : null,
      target: targetString,
      status_publish: isSchedule ? "schedule" : "publish",
      institution_id: user.instansi,
      username: user.username,
    };

    try {
      const res = await pengumumanServices.UpdateData(data, token);

      if (res.status === 200) {
        setToaster({
          variant: "success",
          message: "Pengumuman berhasil diperbarui",
        });

        const resData = await pengumumanServices.getAllData(
          { inst: user.instansiId },
          token,
        );

        setData(resData.data.data);

        setEditModal(false);
        onClose();
      } else {
        setToaster({
          variant: "danger",
          message: res.data.message,
        });
      }
    } catch {
      setToaster({
        variant: "danger",
        message: "Terjadi kesalahan",
      });
    } finally {
      setIsLoading("");
    }
  };

  /* ================= UI ================= */

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <h1 className="bg-green-200 text-center py-3 font-semibold border-y border-[var(--primary-color)] mx-[-20px] mb-4">
          Edit Pengumuman
        </h1>

        <form onSubmit={handleUpdatePengumuman}>
          <Select
            className="w-full mb-4"
            label="Tahun Ajaran"
            name="tahunajaran"
            defaultValue={editData.tahunajaran_id}
            options={taData.map((dt) => ({
              value: dt.id.toString(),
              label: dt.name,
            }))}
          />

          <TextField
            fullWidth
            size="small"
            label="Judul Pengumuman"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Konten Pengumuman"
            multiline
            minRows={3}
            maxRows={8}
            fullWidth
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ mb: 2 }}
          />

          <MSSTargetPengumuman
            label="Target"
            placeholder="Cari target..."
            options={targetAbsensi}
            value={selectedTarget}
            onChange={setSelectedTarget}
            className="mb-5"
          />

          <div className="flex gap-4 mb-5 items-center justify-end">
            <FormControlLabel
              control={
                <Checkbox
                  checked={isSchedule}
                  onChange={() => setIsSchedule(!isSchedule)}
                />
              }
              label="Schedule"
            />

            <div className="flex-col">
              <div className="flex gap-2">
                <p className="text-sm">Dari Tanggal</p>
                <CalendarIcon />
              </div>

              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                className="w-full border border-gray-800 rounded px-2 py-1"
                disabled={!isSchedule}
              />
            </div>

            <div className="flex-col">
              <div className="flex gap-2">
                <p className="text-sm">Sampai Tanggal</p>
                <CalendarIcon />
              </div>

              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
                className="w-full border border-gray-800 rounded px-2 py-1"
              />
            </div>
          </div>

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
            {isLoading === "submitBtn" ? "Loading..." : "Update Pengumuman"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalEditPengumuman;
