import Modal from "@/components/ui/modal";
import { DataUser, DataUserDefault } from "@/type/Register.type";
import { encryptString } from "@/utils/encryptionstring";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";

type Proptypes = {
  dataReg: DataUser;
  setDataReg: Dispatch<SetStateAction<DataUser>>;
  setToaster: Dispatch<SetStateAction<{}>>;
};
const ModalEmailConfirm = (prop: Proptypes) => {
  const router = useRouter();

  const { dataReg, setDataReg, setToaster } = prop;
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoading("tombol");
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ONTUITION_BASEURL}/api/auth/verify-otp?teleph
one=62${dataReg.phone}&otp=${form.otp.value}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            telephone: `62${dataReg.phone}`,
            otp: form.otp.value,
          }),
        },
      );
      const result = await res.json();
      console.log("ini reponse token confirmed", result);
      if (result.status !== 200) {
        setToaster({
          variant: "danger",
          message: result.message,
        });
        return;
      }
      const token = result.data.token;
      console.log("ini token", token);
      const now = new Date();
      const stringSessionMsg = `${dataReg.email}:${dataReg.nama}:${dataReg.phone}:${now}`;
      sessionStorage.setItem("sessMessage", encryptString(stringSessionMsg));
      sessionStorage.setItem("sessToken", token);

      setToaster({
        variant: "success",
        message: "Registrasi berhasil!",
      });
      router.replace("/auth/setnewpassword");
    } catch (error) {
      setError("kesalahan saat konfirm OTP");
    } finally {
      setIsLoading("");
    }
  };

  const handleResendOTP = async () => {
    setIsLoading("tombolResendOTP");
    const payload = {
      telephone: `62${dataReg.phone}`,
    };
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ONTUITION_BASEURL}/api/auth/resend-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );
      const result = await res.json();
      if (result.status !== 200) {
        setToaster({
          variant: "danger",
          message: result.message,
        });
        return;
      }
      setToaster({
        variant: "success",
        message: "OTP berhasil dikirim ulang",
      });
    } catch (error) {
      setError("terjadi kegagalan dalam resend OTP");
    } finally {
      setIsLoading("");
    }
  };
  return (
    <Modal onClose={() => {}}>
      <div className="relative overflow-hidden rounded-[32px] bg-white shadow-2xl border border-slate-200 w-full max-w-md">
        {/* ORNAMEN */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-200 rounded-full blur-3xl opacity-40"></div>

        <div className="relative p-7">
          {/* HEADER */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl">
              <i className="bx bx-shield-quarter text-4xl text-white"></i>
            </div>

            <h1 className="text-2xl font-bold text-slate-800 mt-4">
              Verifikasi OTP
            </h1>

            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              Masukkan kode OTP yang telah dikirim ke WhatsApp Anda untuk
              melanjutkan proses registrasi
            </p>
          </div>

          {/* INFO NUMBER */}
          <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <i className="bx bxl-whatsapp text-2xl text-emerald-500"></i>
            </div>

            <div>
              <p className="text-xs text-emerald-600">Kode dikirim ke</p>

              <p className="font-semibold text-emerald-700">
                +62{dataReg.phone}
              </p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* OTP INPUT */}
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">
                Kode OTP
              </p>

              <div className="relative">
                <i className="bx bx-lock-alt absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-400"></i>

                <input
                  type="text"
                  name="otp"
                  required
                  maxLength={6}
                  placeholder="Masukkan kode OTP"
                  className="w-full h-[60px] rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-4 text-center tracking-[3px] text-md font-semibold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                />
              </div>

              <p className="text-xs text-slate-500 mt-2">Contoh: 123456</p>
            </div>

            {/* ERROR */}
            {error !== "" && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* BUTTON */}
            <Button
              type="submit"
              disabled={isLoading === "tombol"}
              className="!h-[58px] !rounded-2xl !bg-gradient-to-r !from-emerald-500 !to-teal-500 hover:!opacity-90 !shadow-xl !font-semibold !flex !items-center !justify-center"
            >
              {isLoading === "tombol" ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                  <span>Memverifikasi...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-yellow-50">
                  <span>Verifikasi OTP</span>

                  <i className="bx bx-check-circle text-2xl"></i>
                </div>
              )}
            </Button>

            {/* RESEND */}
            <button
              type="button"
              className="text-sm text-slate-500 hover:text-emerald-600 transition-all"
              onClick={handleResendOTP}
              disabled={isLoading === "tombolResendOTP"}
            >
              {isLoading === "tombolResendOTP" ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Mengirim ulang...</span>
                </div>
              ) : (
                <p>Tidak menerima kode? Kirim ulang OTP</p>
              )}
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default ModalEmailConfirm;
