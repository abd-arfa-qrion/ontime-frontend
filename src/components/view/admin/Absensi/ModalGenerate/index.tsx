import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Modal, Box, Button, Typography } from "@mui/material";

import "react-datepicker/dist/react-datepicker.css";
import { TahunAjaran } from "@/type/Tahunajaran.type";
import taSmesterServices from "@/pages/api/services/tasmester";
import { useTahunAjaranStore } from "@/store/tahunAjaranStore";

type Props = {
  open: boolean;
  onClose: () => void;
  setToaster: Dispatch<SetStateAction<{}>>;
  session: any;
  handleGenerate: (data: any) => void;
  isLoading: string;
  setIsLoading: Dispatch<SetStateAction<string>>;
};

const ModalGenerate = (props: Props) => {
  const {
    open,
    onClose,
    setToaster,
    session,
    handleGenerate,
    isLoading,
    setIsLoading,
  } = props;

  const [tahunAjaran, setTahunAjaran] = useState<string>("");
  const [taData, setTaData] = useState<TahunAjaran[]>([]);
  const [errorTa, setErrorTa] = useState<boolean>(false);

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

  const handleGenerates = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading("submitBtn");

    const form: any = e.target as HTMLFormElement;

    if (!form.tahunajaran.value) {
      setIsLoading("");
      setToaster({
        variant: "danger",
        message: "Maaf Tahun Ajaran wajib diisi!",
      });
      setErrorTa(true);
      return;
    }
    const data = {
      inst: session.data?.user?.instansiId,
      institution_id: session.data?.user?.instansi,
      tahunajaran_id: Number(form.tahunajaran.value),
    };
    console.log(data);
    handleGenerate(data);
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
          Silahkan Pilih Tahun Ajaran!
        </h1>
        <form onSubmit={handleGenerates}>
          {/* Tahun Ajaran */}
          <div className="border-b border-gray-800 py-2 mb-4 flex gap-4 items-center">
            <Typography className="text-[var(--primary-color)] whitespace-nowrap">
              Tahun Ajaran
            </Typography>

            <b>{activeTahunAjaran?.name}</b>
          </div>
          {/* Button */}
          <Button
            variant="contained"
            fullWidth
            sx={{
              py: 1,
              background: "var(--gradient-primary)",
              textTransform: "none",
              boxShadow: "none",

              "&:hover": {
                background: "var(--gradient-primary)",
                filter: "brightness(1.05)",
                boxShadow: "none",
              },
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
              "Generate"
            )}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};
export default ModalGenerate;
