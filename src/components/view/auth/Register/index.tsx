import { FormEvent, useEffect, useState } from "react";
import styles from "./Register.module.scss";
import { useRouter } from "next/router";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import AuthLayout from "@/components/layout/AuthLayout";
import ModalEmailConfirm from "./ModalEmailConfirm";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const RegisterView = ({ setToaster }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataReg, setDataReg] = useState<{
    nama: string;
    email: string;
    phone: string;
  }>({
    nama: "",
    email: "",
    phone: "",
  });
  const { push } = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const msg = sessionStorage.getItem("msg");
    if (msg) {
      setMsg(msg);
      sessionStorage.removeItem("msg"); // Hapus setelah ditampilkan
    }
  }, []);
  //handle button submit
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      // Pastikan reCAPTCHA dijalankan
      const recaptchaToken = await executeRecaptcha?.("register_action");
      if (!recaptchaToken) {
        setToaster({
          variant: "danger",
          message: "Gagal memvalidasi reCAPTCHA!",
        });
        setIsLoading(false);
        return;
      }
      if (confirm("Apakah anda yakin ingin mendaftar?")) {
        const form = event.target as HTMLFormElement;
        const data = {
          nama: form.fullname.value,
          email: form.email.value,
          phone: form.phone.value,
          recaptchaToken,
        };
        setDataReg(data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthLayout
        title="Register"
        link="/auth/login"
        linkText="anda telah memiliki akun? Silahkan login"
      >
        {msg && <p className="my-4 text-orange-600">{msg}</p>}
        <form onSubmit={handleSubmit}>
          <Input label="Email" type="email" name="email" required={true} />
          <Input
            label="Nama Lengkap"
            type="text"
            name="fullname"
            required={true}
          />

          <Input label="No HP/WA" type="number" name="phone" required={true} />
          <Button
            type="submit"
            className={styles.register__button}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="box-loader">
                <div className="loader" />
                <p>Loading...</p>
              </div>
            ) : (
              "Register"
            )}
          </Button>
        </form>
      </AuthLayout>
      {dataReg && dataReg.email !== "" && (
        <ModalEmailConfirm
          dataReg={dataReg}
          setDataReg={setDataReg}
          setToaster={setToaster}
        />
      )}
    </>
  );
};

export default RegisterView;
