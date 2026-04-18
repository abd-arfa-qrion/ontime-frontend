import { FormEvent, useEffect } from "react";
import styles from "./Login.module.scss";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import Button from "@/components/ui/button";
import AuthLayout from "@/components/layout/AuthLayout";
import { InputAdornment, TextField, Typography } from "@mui/material";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

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

      console.log("START SIGNIN");

      const res = await signIn("credentials", {
        redirect: false,
        username: form.username.value,
        password: form.password.value,
        recaptchaToken,
        callbackUrl,
      });

      console.log("SIGNIN RESULT:", res);

      if (!res?.error && res?.ok && res?.status === 200) {
        setIsLoading(false);
        form.reset();
        setToaster({
          variant: "success",
          message: "Login sukses!",
        });
        push(callbackUrl);
      } else {
        setIsLoading(false);
        setToaster({
          variant: "danger",
          message: "Username / Password salah!",
        });
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
    <AuthLayout
      title="Login"
      link="/auth/register"
      linkText="Anda belum memiliki akun? Silahkan register"
    >
      {error && <p className={styles.auth__error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username/Email"
          name="username"
          placeholder="username / email"
          required={true}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Typography variant="caption">
                  <i className="bx bx-user-circle text-3xl"></i>
                </Typography>
              </InputAdornment>
            ),
            sx: {
              borderRadius: "20px",
              textAlign: "center", // Placeholder dan teks input dipusatkan
              // width: "100%",
              // marginTop: "20px",
            },
          }}
          inputProps={{
            style: {
              textAlign: "center", // Placeholder berada di tengah
            },
          }}
          sx={{ width: "100%", marginTop: "20px" }}
        />

        <TextField
          className={styles.login__textfield}
          label="Password"
          name="password"
          type="password"
          placeholder="password"
          required={true}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Typography variant="caption">
                  <i className="bx bx-key text-3xl"></i>
                </Typography>
              </InputAdornment>
            ),
            sx: {
              borderRadius: "20px",
              textAlign: "center", // Placeholder dan teks input dipusatkan
            },
          }}
          inputProps={{
            style: {
              textAlign: "center", // Placeholder berada di tengah
            },
          }}
          sx={{ width: "100%", marginTop: "20px" }}
        />

        <Button
          type="submit"
          variant="primary"
          className={styles.login__button}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="box-loader">
              <div className="loader" />
              <p>Loading...</p>
            </div>
          ) : (
            "Login"
          )}
        </Button>
      </form>

      <div className={styles.login__devider}>
        <Button
          disabled
          type="button"
          onClick={() => signIn("google", { callbackUrl, redirect: false })}
          className={styles.login__devider__button}
        >
          <GoogleIcon style={{ color: "#496feb" }} />
          <p>Login with Google</p>
        </Button>
      </div>
    </AuthLayout>
  );
};

export default LoginView;
