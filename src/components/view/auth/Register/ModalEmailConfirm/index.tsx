import Modal from "@/components/ui/modal";
import authService from "@/services/auth";
import { GeneratePublicCsrfToken } from "@/utils/publicCsrfToken";
import { Button, TextField } from "@mui/material";
import { useRouter } from "next/router";
import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

type Proptype = {
  dataReg: {
    email: string;
    phone: string;
    nama: string;
  };
  setDataReg: Dispatch<
    React.SetStateAction<{ email: string; phone: string; nama: string }>
  >;
  setToaster: Dispatch<SetStateAction<{}>>;
};
const ModalEmailConfirm = (prop: Proptype) => {
  const { dataReg, setDataReg, setToaster } = prop;
  const [error, setError] = useState("");
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState("");
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoading("tombol");
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    try {
      const recaptchaToken = await executeRecaptcha?.("register_action");
      if (!recaptchaToken) {
        setError("token recaptcha tidak ditemukan");
        return;
      }
      const emailConfirm = form.emailconfirm.value;
      if (emailConfirm === dataReg.email) {
        const data = {
          email: dataReg.email,
          phone: dataReg.phone,
          nama: dataReg.nama,
        };
        const encryptedText = GeneratePublicCsrfToken();

        try {
          const res = await authService.registerAccount(data, encryptedText);
          if (res.status === 200) {
            if (res.data.status_code === 200) {
              setToaster({
                variant: "success",
                message:
                  "Register Berhasil! buka email anda untuk verifikasi akun - " +
                  res.data.message,
              });
              setDataReg({ email: "", phone: "", nama: "" });
              form.reset();
              router.push("/auth/login");
              setIsLoading("");
            } else {
              setError(res.data.message);
              setToaster({
                variant: "warning",
                message: res.data.message,
              });
              setIsLoading("");
            }
          }
        } catch (error) {
          setError("register error");
          setIsLoading("");
        }
      } else {
        setError("email tidak cocok!");
        form.reset();
        setIsLoading("");
      }
    } catch (error) {
      setError("recaptcha tidak ditemukan");
      setIsLoading("");
    }
  };
  return (
    <Modal onClose={() => setDataReg({ email: "", phone: "", nama: "" })}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          label="Masukkan Email Kembali!"
          name="emailconfirm"
          variant="outlined"
        />
        {error !== "" && <p className="text-red-500">{error}</p>}
        <Button
          variant="contained"
          type="submit"
          disabled={isLoading === "tombol"}
        >
          {isLoading === "tombol" ? (
            <div className="box-loader">
              <div className="loader" />
              <p>Loading...</p>
            </div>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Modal>
  );
};

export default ModalEmailConfirm;
