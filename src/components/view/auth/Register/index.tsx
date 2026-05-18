import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/button";
import ModalEmailConfirm from "./ModalEmailConfirm";
import DataInstitusiView from "./Datainstitusi";
import DataUserView from "./Datauser";
import { PositionPegawai } from "@/type/Position.type";
import { DataUser, DataUserDefault } from "@/type/Register.type";
import AdminFooter from "@/components/fragments/adminfooter";
import Link from "next/link";

type Proptype = {
  dataPosition: PositionPegawai[];
  setToaster: any;
};
const RegisterView = (prop: Proptype) => {
  const { dataPosition, setToaster } = prop;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [selectPosition, setSelectPosition] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);

  // =========================
  // DATA USER
  // =========================
  const [dataUser, setDataUser] = useState<DataUser>(DataUserDefault);

  // =========================
  // DATA INSTITUSI
  // =========================
  const [dataInstitusi, setDataInstitusi] = useState({
    npsn: "",
    sekolah: "",
    kecamatan: "",
    kabupaten_kota: "",
    provinsi: "",
    alamat: "",
    status: "N",
  });

  useEffect(() => {
    const msg = sessionStorage.getItem("msg");

    if (msg) {
      setMsg(msg);
      sessionStorage.removeItem("msg");
    }
  }, []);

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError("");
      const payload = {
        institutionCode: dataInstitusi.npsn,
        institutionName: dataInstitusi.sekolah,
        district: dataInstitusi.kecamatan,
        city: dataInstitusi.kabupaten_kota,
        statusNegeri: dataInstitusi.status === "N",
        name: dataUser.nama,
        telephone: `62${dataUser.phone}`,
        email: dataUser.email,
        positionId: selectPosition,
        regOrigins: "ontime",
      };

      console.log("FINAL PAYLOAD:", payload);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ONTUITION_BASEURL}/api/auth/register-service`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await res.json();

      console.log("RESULT REGISTER:", result);

      if (!res.ok || result.status !== 200) {
        setError(result?.message || "Gagal melakukan registrasi");
        setToaster({
          variant: "danger",
          message: result?.message || "Gagal melakukan registrasi",
        });
        return;
      }

      setShowModal(true);
    } catch (err: any) {
      console.log(err);
      setToaster({
        variant: "danger",
        message: err.message,
      });
      setError("Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-emerald-50 flex items-center justify-center p-5">
        <div className="w-full max-w-7xl">
          <div className="relative overflow-hidden rounded-[32px] bg-white shadow-2xl border border-slate-200">
            <div className="absolute -top-20 -right-20 w-52 h-52 bg-emerald-200 rounded-full blur-3xl opacity-40" />
            <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-teal-200 rounded-full blur-3xl opacity-40" />

            <div className="relative p-8">
              {/* HEADER */}
              <div className="flex flex-col items-center text-center mb-8">
                <Image
                  src="/assets/logo/logo.svg"
                  width={200}
                  height={140}
                  alt="logo"
                />

                <p className="text-slate-500 mt-2">
                  Mulai daftar untuk menggunakan sistem Ontime
                </p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col xl:flex-row gap-6">
                  {/* DATA USER */}
                  <div className="flex-1">
                    <div className="rounded-[32px] border border-slate-200 bg-white shadow-xl overflow-hidden">
                      <div className="border-b border-slate-100 p-6 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                          <i className="bx bx-user text-3xl text-white"></i>
                        </div>

                        <div>
                          <h1 className="font-bold text-xl text-slate-800">
                            Data Pribadi
                          </h1>

                          <p className="text-sm text-slate-500">
                            Informasi administrator
                          </p>
                        </div>
                      </div>

                      <div className="p-6">
                        <DataUserView
                          dataUser={dataUser}
                          setDataUser={setDataUser}
                          dataPosition={dataPosition}
                          selectPosition={selectPosition}
                          setSelectPosition={setSelectPosition}
                        />
                      </div>
                    </div>
                  </div>

                  {/* DATA INSTITUSI */}
                  <div className="flex-1">
                    <div className="rounded-[32px] border border-slate-200 bg-white shadow-xl overflow-hidden">
                      <div className="border-b border-slate-100 p-6 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                          <i className="bx bx-buildings text-3xl text-white"></i>
                        </div>

                        <div>
                          <h1 className="font-bold text-xl text-slate-800">
                            Data Institusi
                          </h1>

                          <p className="text-sm text-slate-500">
                            Informasi sekolah / lembaga
                          </p>
                        </div>
                      </div>

                      <div className="p-6">
                        <DataInstitusiView
                          dataInstitusi={dataInstitusi}
                          setDataInstitusi={setDataInstitusi}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SUBMIT */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full !h-[58px] !rounded-2xl !bg-gradient-to-r !from-emerald-500 !to-teal-500 !text-white !font-semibold"
                >
                  {isLoading ? "Loading..." : "Register"}
                </Button>
              </form>
              {/* REGISTER CARD */}
              <div className="mt-7">
                <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-40" />

                  <div className="relative flex flex-col items-center text-center gap-3">
                    <div>
                      <p className="text-slate-700 font-bold">
                        sudah memiliki akun?
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        Daftar sekarang dan mulai gunakan sistem
                      </p>
                    </div>

                    <Link
                      href="/auth/login"
                      className="group inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    >
                      <span>Login</span>

                      <i className="bx bx-right-arrow-alt text-2xl transition-transform duration-300 group-hover:translate-x-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <AdminFooter />
          <div className="flex w-auto items-center justify-center mt-5 border-gray-500 border py-1 pl-1 pr-2 rounded-2xl">
            <i className="bx bx-lock-alt text-[32px]"></i>
            <div className="flex flex-col leading-none">
              <p className="font-bold text-md">S E C U R E</p>
              <p className="text-[10px] text-green-600">SSL ENCRYPTION</p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <ModalEmailConfirm
          setToaster={setToaster}
          dataReg={dataUser}
          setDataReg={setDataUser}
        />
      )}
    </>
  );
};

export default RegisterView;
