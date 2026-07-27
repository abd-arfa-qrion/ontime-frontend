import { FormEvent, useEffect } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Button from "@/components/ui/button";
import { InputAdornment, TextField, Typography } from "@mui/material";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import Link from "next/link";
import Image from "next/image";
import AdminFooter from "@/components/fragments/adminfooter";
import AuthSlideshow from "./slideshow";

const LoginView = ({ setToaster }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { push, query } = useRouter();
  //handle button submit

  const { executeRecaptcha } = useGoogleReCaptcha(); // Hook Google reCAPTCHA
  const callbackUrl: any = "/authenticated";
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    console.log("sedang login");

    event.preventDefault();
    setIsLoading(true);
    setError("");

    const form = event.target as HTMLFormElement;

    try {
      console.log("executeRecaptcha:", executeRecaptcha);

      const recaptchaToken = await executeRecaptcha?.("login_action");

      if (!recaptchaToken) {
        console.error("reCAPTCHA token kosong");
        setToaster({
          variant: "danger",
          message: "Gagal memvalidasi reCAPTCHA!",
        });
        setIsLoading(false);
        return;
      }

      console.log("berhasil recaptcha:", recaptchaToken);

      //ini request auth ke qms
      const resAuth = await fetch(
        `${process.env.NEXT_PUBLIC_ONTUITION_BASEURL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userIdentity: form.username.value,
            password: form.password.value,
          }),
        },
      );

      const resAuthJson = await resAuth.json();

      if (resAuthJson.success === true) {
        sessionStorage.setItem("tokenQMS", resAuthJson.data.token);
        sessionStorage.setItem(
          "refreshTokenQMS",
          resAuthJson.data.refreshToken,
        );
        console.log("success login qms");
      }

      console.log("START SIGNIN");
      const res = await signIn("credentials", {
        redirect: false,
        username: form.username.value,
        password: form.password.value,
        recaptchaToken,
        callbackUrl,
      });

      if (!res?.error && res?.ok && res?.status === 200) {
        setIsLoading(false);
        form.reset();
        setToaster({
          variant: "success",
          message: "Login sukses!",
        });
        console.log("berhasil login ontime");
        push(callbackUrl);
      } else {
        setIsLoading(false);
        setToaster({
          variant: "danger",
          message: "Username / Password salah!",
        });
        console.log("gagal login ontime");
      }
    } catch (error: any) {
      console.error("LOGIN ERROR FULL:", error);

      setIsLoading(false);

      setError(
        "Something went wrong: " + (error?.message || JSON.stringify(error)),
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-white to-emerald-50">
      <div className="w-full min-h-screen flex flex-col lg:flex-row">
        {/* ================= LOGIN ================= */}
        <div className="w-full lg:w-[560px] xl:w-[640px] relative z-10">
          <div className="h-full min-h-screen relative overflow-hidden bg-white shadow-2xl border-r border-slate-200">
            {/* BACKGROUND EFFECT */}
            <div className="absolute -top-20 -right-20 w-52 h-52 bg-emerald-200 rounded-full blur-3xl opacity-40" />
            <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-teal-200 rounded-full blur-3xl opacity-40" />

            <div className="relative p-8 md:p-10 h-full min-h-screen flex flex-col justify-center">
              {/* LOGO / HEADER */}
              <div className="flex flex-col items-center text-center mb-8">
                <Image
                  src="/assets/logo/logo.svg"
                  width={200}
                  height={140}
                  loading="lazy"
                  alt="logo"
                  className="mt-2"
                />

                <p className="text-slate-500 mt-3">
                  Silahkan login untuk melanjutkan
                </p>
              </div>

              {/* ERROR */}
              {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* USERNAME */}
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">
                    Username / Email
                  </p>

                  <TextField
                    name="username"
                    placeholder="Masukkan username / email"
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <i className="bx bx-user text-2xl text-slate-400"></i>
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: "18px",
                        backgroundColor: "#f8fafc",
                        height: "58px",
                        fontSize: "15px",
                      },
                    }}
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-700">
                      Password
                    </p>

                    <button
                      type="button"
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Lupa Password?
                    </button>
                  </div>

                  <TextField
                    name="password"
                    type="password"
                    placeholder="Masukkan password"
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <i className="bx bx-lock-alt text-2xl text-slate-400"></i>
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: "18px",
                        backgroundColor: "#f8fafc",
                        height: "58px",
                        fontSize: "15px",
                      },
                    }}
                  />
                </div>

                {/* LOGIN BUTTON */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="!mt-2 !h-[56px] !rounded-2xl !bg-gradient-to-r !from-emerald-500 !to-teal-500 hover:!opacity-90 !shadow-xl !text-base !font-semibold !flex !items-center !justify-center"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Login</span>
                      <i className="bx bx-right-arrow-alt text-2xl"></i>
                    </div>
                  )}
                </Button>
              </form>

              {/* REGISTER CARD */}
              <div className="mt-7">
                <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-40" />

                  <div className="relative flex flex-col items-center text-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                      <i className="bx bx-user-plus text-3xl text-white"></i>
                    </div>

                    <div>
                      <p className="text-slate-700 font-bold">
                        Belum memiliki akun?
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        Daftar sekarang dan mulai gunakan sistem
                      </p>
                    </div>

                    <Link
                      href="/auth/register"
                      className="group inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    >
                      <span>Daftar Sekarang</span>

                      <i className="bx bx-right-arrow-alt text-2xl transition-transform duration-300 group-hover:translate-x-1"></i>
                    </Link>
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="mt-7 flex flex-col items-center gap-5">
                <AdminFooter />

                <div className="flex items-center justify-center border border-slate-300 py-1 pl-1 pr-3 rounded-2xl bg-white">
                  <i className="bx bx-lock-alt text-[32px] text-emerald-600"></i>

                  <div className="flex flex-col leading-none">
                    <p className="font-bold text-md text-slate-700">
                      S E C U R E
                    </p>

                    <p className="text-[10px] text-green-600">SSL ENCRYPTION</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SLIDESHOW ================= */}
        <div className="hidden lg:flex flex-1 min-h-screen">
          <AuthSlideshow />
        </div>
      </div>
    </div>
  );
};

export default LoginView;
