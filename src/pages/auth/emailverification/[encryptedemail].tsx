import { useRouter } from "next/router";
import { useEffect } from "react";
import style from "./EmailVerif.module.scss";
import { CompareSecret } from "@/utils/emailVerif";
import { GenerateSignature } from "@/utils/signatureSupeapp";
import { encryptString } from "@/utils/encryptionstring";
import authService from "@/pages/api/services/auth";

export default function EmailVerificationPage({ setToaster }: any) {
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!router.isReady) return;

      const pathSegments = router.asPath.split("/");
      const lastSegment = pathSegments[pathSegments.length - 1]; // Ambil bagian terakhir
      // console.log("lastSegment:", lastSegment);

      if (lastSegment) {
        // split email dan secret key
        const emailEncript = lastSegment.split(":")[0];
        const secretKeyEncript = lastSegment.split(":")[1];

        // cocokkan secret key
        if (CompareSecret(secretKeyEncript) === "false") {
          setToaster({
            variant: "danger",
            message: "Verifikasi gagal, link Verifikasi salah!",
          });
          return;
        } else {
          try {
            const timestampStr = Date.now().toString();
            const methode = "POST";
            const data = {
              verifEmail: emailEncript,
              timeStamp: timestampStr,
            };

            const signatureRes = await fetch("/api/utils/generate-signature", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                methode,
                body: data,
              }),
            });

            const { signature, timestamp } = await signatureRes.json();
            console.log("ini signature: ", signature);
            console.log("ini timestamp: ", timestamp);
            const res = await authService.verificationEmail(
              data,
              signature,
              timestamp,
            );
            if (res.status === 200 && res.data.status_code === 200) {
              setTimeout(() => {
                setToaster({
                  variant: "success",
                  message: "Email berhasil diverifikasi",
                });

                const stringSessionMsg = `${res.data.data.email}:${res.data.data.nama}:${res.data.data.phone}:${res.data.data.createdAt}`;

                sessionStorage.setItem(
                  "sessMessage",
                  encryptString(stringSessionMsg),
                );
                router.replace("/auth/setnewpassword");
              }, 4000);
            } else {
              setTimeout(() => {
                setToaster({
                  variant: "danger",
                  message: `${res.data.message} Verifikasi gagal`,
                });
                router.replace("/auth/register");
              }, 4000);
            }
          } catch (error) {
            console.log(error);
            setTimeout(() => {
              setToaster({
                variant: "danger",
                message: "terjadi kesalahan, coba beberapa saat lagi!",
              });
              router.replace("/auth/register");
            }, 4000);
          }
        }
      }
    };
    verifyEmail(); // Jalankan fungsi
  }, [router.isReady]);

  return (
    <div className="flex flex-col gap-5 items-center justify-center h-screen w-full">
      <div className={style.loader}></div>
      <p>Verificating</p>
    </div>
  );
}
