import { Button } from "@mui/material";
import TextWriter from "../writereffect";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
// import ypoSvg from '@/assets/ypo.svg'
const HomeView = () => {
  const { data }: any = useSession();
  const [isLoading, setIsLoading] = useState<string>("");
  const nav = useRouter();
  const handleBtnLogin = async () => {
    setIsLoading("btnLogin");

    // Fungsi untuk membuat delay
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    if (data) {
      await signOut({
        callbackUrl: process.env.NEXTAUTH_URL,
      });
      setIsLoading("");
    } else {
      // Tambahkan delay 2 detik sebelum login
      await delay(1500);
      await signIn();
      setIsLoading("");
    }
  };
  const handleBtnRegister = async () => {
    setIsLoading("btnReg");

    // Fungsi untuk membuat delay
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1500);
    nav.push("/auth/register");
    setIsLoading("");
  };
  return (
    <div className="top-0 left-0 w-full text-center min-h-screen flex">
      <div className="w-[60%] flex flex-col items-center justify-center  bg-secondary">
        <h1 className="text-2xl font-bold text-white">
          Selamat Datang di Rampay
        </h1>
        <h3 className="text-md text-white">
          Payment Gateway Kekinian Mudah Diintegrasikan
        </h3>
        <div className="mt-8 text-lg text-white">
          <TextWriter
            texts={[
              "Payment Gateway Terbaik",
              "Simpel dan Mudah diintegrasikan",
              "Mari Kita Coba!",
              "rampay... growth your business with easy pay!",
            ]}
            typingSpeed={150}
            pauseTime={2000}
          />
        </div>
      </div>
      <div className="w-[40%] flex flex-col items-center justify-center">
        <div className="w-full flex items-center justify-center gap-4 mt-24">
          <Button
            type="button"
            onClick={handleBtnRegister}
            variant="outlined"
            className="rounded-full text-lg w-1/3 py-3"
            disabled={isLoading === "btnReg"}
          >
            {isLoading === "btnReg" ? (
              <div className="box-loader">
                <div className="sm-loader" />
              </div>
            ) : (
              "Mulai Daftar"
            )}
          </Button>
          <Button
            type="button"
            onClick={handleBtnLogin}
            variant="contained"
            className="rounded-full text-lg w-1/3 py-3"
            disabled={isLoading === "btnLogin"}
          >
            {isLoading === "btnLogin" ? (
              <div className="box-loader">
                <div className="sm-loader" />
              </div>
            ) : (
              "Log In"
            )}
          </Button>
        </div>
        <i className="text-sm mt-20">
          This site is protected by{" "}
          <span className="text-blue-300">reCAPTCHA</span> and the Google
          Privacy Policy and Terms of Service apply.
        </i>
        <div className="flex w-auto items-center justify-center mt-5 border-gray-500 border py-1 pl-1 pr-2 rounded-2xl">
          <i className="bx bx-lock-alt text-[32px]"></i>
          <div className="flex flex-col leading-none">
            <p className="font-bold text-md">S E C U R E</p>
            <p className="text-[10px] text-green-600">SSL ENCRYPTION</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
