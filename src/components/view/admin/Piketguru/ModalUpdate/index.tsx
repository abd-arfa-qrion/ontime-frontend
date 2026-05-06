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
  Typography,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
} from "@mui/material";

import "react-datepicker/dist/react-datepicker.css";
import { TahunAjaran } from "@/type/Tahunajaran.type";
import taSmesterServices from "@/pages/api/services/tasmester";
import Select from "@/components/ui/select";
import { JadwalMasuk } from "@/type/Jadwalmasuk.type";
import jadwalMasukServices from "@/pages/api/services/jadwalmasuk";
import { PiketGuru } from "@/type/Piketguru.type";
import SearchSelect from "@/components/ui/ontime/singleselectsearch";
import guruServices from "@/pages/api/services/guru";
import { Guru } from "@/type/Guru.type";
import piketGuruServices from "@/pages/api/services/piketguru";
import { getTahunAjaranWithSemester } from "@/utils/tasemester";

type Props = {
  open: boolean;
  onClose: () => void;
  setToaster: Dispatch<SetStateAction<{}>>;
  editingData: PiketGuru | null;
  isLoading: string;
  setIsLoading: Dispatch<SetStateAction<string>>;
  session: any;
  setData: Dispatch<SetStateAction<PiketGuru[]>>;
};

const ModalUpdatePiket = (props: Props) => {
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

  const [guruData, setGuruData] = useState<Guru[]>([]);
  const [error, setError] = useState<string>("");
  const [value, setValue] = useState<any>(null);

  const tasem = getTahunAjaranWithSemester();

  //state get data

  useEffect(() => {
    if (!session?.data?.accessToken) return;

    const loadData = async () => {
      await getDataGuru(); // tunggu selesai dulu
    };

    if (session.status === "authenticated") {
      loadData();
    }
  }, [session?.data?.accessToken]);

  const getDataGuru = async () => {
    const data = {
      inst: session.data?.user?.instansiId,
    };
    try {
      const res = await guruServices.getAllData(
        data,
        session.data?.accessToken,
      );
      if (res.status !== 200) {
        setToaster({
          variant: "danger",
          message: res.data.message,
        });
      } else {
        setGuruData(res.data.data);
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

  const handleUpdatePiket = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading("submitBtn2");
    const form: any = e.target as HTMLFormElement;
    const payload = {
      id: editingData?.id,
      inst: session.data?.user?.instansiId,
      tahunajaran_id: Number(form.tahunajaran_id.value),
      hari: form.hari.value,
      guru_id: Number(value?.value),
      institution_id: session.data?.user?.instansi,
    };
    console.log(payload);
    try {
      const resData = await piketGuruServices.UpdateData(
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
        tahunajaran: tasem.ta,
      };

      const res = await piketGuruServices.getAllData(
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
      setToaster({
        variant: "success",
        message: "Data berhasil diupdate",
      });
      setData(res.data.data);
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
          Form Edit Piket Guru
        </h1>
        <form onSubmit={handleUpdatePiket} className="flex flex-col gap-5">
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

          <SearchSelect
            label="Pilih Guru"
            options={guruData.map((item: any) => ({
              label: item.name,
              value: item.id,
            }))}
            value={value}
            onChange={(val) => setValue(val)}
            placeholder="Cari..."
          />

          {/* Jam Masuk */}
          <TextField
            fullWidth
            size="small"
            label="NIP"
            name="nip"
            value={
              guruData.find((item: any) => item.id === value?.value)?.nip || ""
            }
            sx={{ mb: 2 }}
          />

          {/* Button */}
          <Button
            variant="contained"
            fullWidth
            sx={{
              background: "var(--gradient-primary)",
              textTransform: "none",
            }}
            type="submit"
            disabled={isLoading === "submitBtn2"}
          >
            {isLoading === "submitBtn2" ? (
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
export default ModalUpdatePiket;
