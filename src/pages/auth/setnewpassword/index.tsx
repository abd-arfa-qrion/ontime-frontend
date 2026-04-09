import { useEffect, useState } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import {
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import { decryptString } from "@/utils/encryptionstring";
import { GenerateSignature } from "@/utils/signatureSupeapp";
import userService from "@/services/user";

const SetNewPassword = ({ setToaster }: any) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState("");
  const [sessMsg, setSessMsg] = useState("");
  const router = useRouter();
  // Syarat password
  const passwordRules = [
    { label: "Minimal 8 karakter", regex: /.{8,}/ },
    { label: "Mengandung huruf besar (A-Z)", regex: /[A-Z]/ },
    { label: "Mengandung huruf kecil (a-z)", regex: /[a-z]/ },
    { label: "Mengandung angka (0-9)", regex: /\d/ },
    { label: "Mengandung simbol (@$!%*?&)", regex: /[@$!%*?&]/ },
  ];

  // Cek apakah password memenuhi semua aturan
  const passwordChecks = passwordRules.map((rule) => ({
    label: rule.label,
    isValid: rule.regex.test(password),
  }));

  const isPasswordStrong = passwordChecks.every((check) => check.isValid);
  const isPasswordMatch = password.length > 0 && password === confirmPassword;
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading("btn");
    e.preventDefault();
    const decriptTextMsg = decryptString(sessMsg);
    const email = decriptTextMsg.split(":")[0];
    const nama = decriptTextMsg.split(":")[1];
    const phone = decriptTextMsg.split(":")[2];
    if (password === confirmPassword) {
      try {
        const timestampStr = Date.now().toString();
        const methode = "POST";
        const data = {
          email,
          phone,
          password,
          nama,
          username: email,
          roleId: "newncil",
          instansiId: "99999999-9999-9999-9999-999999999999",
          karyawanId: "00000000-0000-0000-0000-000000000000",
          status: "1",
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
        const res = await userService.addNewUser(data, signature, timestampStr);
        if (res.status === 200 && res.data.status_code === 200) {
          setToaster({
            variant: "success",
            message: "YEEEEYYY! " + res.data.message,
          });
          router.replace("/auth/login");
        } else {
          setToaster({
            variant: "danger",
            message: "Gagal Membuat User dan Password!" + res.data.message,
          });
        }
        setIsLoading("");
      } catch (error) {
        setToaster({
          variant: "danger",
          message: "Error Membuat User dan Password!" + error,
        });
        setIsLoading("");
      }
    } else {
      setToaster({
        variant: "danger",
        message: "Password dan Konfirmasi Password Tidak Sama!",
      });
      setIsLoading("");
    }
  };
  useEffect(() => {
    const message = sessionStorage.getItem("sessMessage");
    if (!message) {
      router.replace("/auth/login");
    } else {
      const textMsg = decryptString(message);
      if (Date.now() > parseInt(textMsg.split(":")[3]) + 150000) {
        sessionStorage.removeItem("sessMessage");
        sessionStorage.setItem(
          "msg",
          "Sesi pembuatan password berakhir! silahkan register kembali!"
        );
        router.replace("/auth/register");
      } else {
        setSessMsg(message);
      }
    }
  }, []);
  return (
    <AuthLayout
      title="Buat Password Baru Sob!"
      link="/auth/register"
      linkText="Pastikan buat password yang aman yah sob!"
    >
      <h1>Set New Password</h1>
      <form onSubmit={handleSubmit}>
        {/* Input Password */}
        <TextField
          type={showPassword ? "text" : "password"}
          label="Password"
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Informasi aturan password */}
        <Typography variant="body2" sx={{ mt: 1, mb: 1, fontWeight: "bold" }}>
          Password harus memenuhi kriteria berikut:
        </Typography>
        <Box sx={{ pl: 2 }}>
          {passwordChecks.map((check, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{
                display: "flex",
                alignItems: "center",
                color: check.isValid ? "success.main" : "error.main",
              }}
            >
              {check.isValid ? (
                <CheckCircle sx={{ mr: 1 }} color="success" />
              ) : (
                <Cancel sx={{ mr: 1 }} color="error" />
              )}
              {check.label}
            </Typography>
          ))}
        </Box>

        {/* Input Konfirmasi Password */}
        <TextField
          type={showConfirmPassword ? "text" : "password"}
          label="Confirm Password"
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Indikator kecocokan password */}
        {confirmPassword.length > 0 && (
          <Typography
            variant="body2"
            color={isPasswordMatch ? "success.main" : "error.main"}
            sx={{ display: "flex", alignItems: "center", mt: 1 }}
          >
            {isPasswordMatch ? (
              <CheckCircle sx={{ mr: 1 }} color="success" />
            ) : (
              <Cancel sx={{ mr: 1 }} color="error" />
            )}
            {isPasswordMatch ? "Password cocok" : "Password tidak cocok"}
          </Typography>
        )}

        {/* Tombol Submit */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={
            !isPasswordStrong || !isPasswordMatch || isLoading === "btn"
          }
        >
          {isLoading === "btn" ? <CircularProgress size={24} /> : "Confirm"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default SetNewPassword;
