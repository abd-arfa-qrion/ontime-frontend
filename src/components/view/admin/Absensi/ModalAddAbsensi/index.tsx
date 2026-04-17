import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { Typography } from "@mui/material";
import Select from "@/components/ui/select";
import jadwalAkademikServices from "@/pages/api/services/jadwalakademik";
import taSmesterServices from "@/pages/api/services/tasmester";
import { TahunAjaran } from "@/type/Tahunajaran.type";
import guruServices from "@/pages/api/services/guru";
import hariServices from "@/pages/api/services/hari";
import { Hari } from "@/type/Hari.type";
import { Guru } from "@/type/Guru.type";
import { Semester } from "@/type/Semester.type";
import Loader from "@/components/ui/loader";
import mapelServices from "@/pages/api/services/mapel";
import { Mapel } from "@/type/Mapel.type";
import { Kelas } from "@/type/Kelas.type";
import { JadwalAkademik } from "@/type/Jadwalakademik.type";
type Proptypes = {
  setToaster: Dispatch<SetStateAction<{}>>;
  setAddAbsensi: Dispatch<SetStateAction<boolean>>;
  setDataJdwlAkdmk: Dispatch<SetStateAction<JadwalAkademik[]>>;
  isLoading: string;
  setIsLoading: Dispatch<SetStateAction<string>>;
  kelasData: Kelas[];
};
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);

const ModalAddAbsensi = (props: Proptypes) => {
  const {
    setToaster,
    setAddAbsensi,
    isLoading,
    setIsLoading,
    setDataJdwlAkdmk,
    kelasData,
  } = props;
  const session: any = useSession();
  const [taData, setTaData] = useState<TahunAjaran[]>([]);
  const [semesterData, setSemesterData] = useState<Semester[]>([]);
  const [hariData, setHariData] = useState<Hari[]>([]);
  const [guruData, setGuruData] = useState<Guru[]>([]);
  const [mapelData, setMapelData] = useState<Mapel[]>([]);
  const [load, setLoad] = useState<string>("");

  useEffect(() => {
    if (!session?.data?.accessToken) return;

    const loadData = async () => {
      await getDataTA(); // tunggu selesai dulu
      await Promise.all([getDataGuru(), getHari(), getDataMapel()]); // setelah itu baru jalankan paralel
    };

    if (session.status === "authenticated") {
      loadData();
    }
  }, [session?.data?.accessToken]);

  const getDataTA = async () => {
    const data = {
      inst: session.data?.user?.instansiId,
    };
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
  };

  const getDataGuru = async () => {
    const data = {
      inst: session.data?.user?.instansiId,
    };
    const res = await guruServices.getAllData(data, session.data?.accessToken);
    if (res.status !== 200) {
      setToaster({
        variant: "danger",
        message: res.data.message,
      });
    } else {
      setGuruData(res.data.data);
    }
    console.log(res);
  };
  const getDataMapel = async () => {
    const data = {
      inst: session.data?.user?.instansiId,
    };
    const res = await mapelServices.getAllData(data, session.data?.accessToken);
    if (res.status !== 200) {
      setToaster({
        variant: "danger",
        message: res.data.message,
      });
    } else {
      setMapelData(res.data.data);
    }
    console.log(res);
  };

  const getHari = async () => {
    const res = await hariServices.getAllData(session.data?.accessToken);
    if (res.status !== 200) {
      setToaster({
        variant: "danger",
        message: res.data.message,
      });
    } else {
      setHariData(res.data.data);
    }
    console.log(res);
  };
  const handleGetSemester = async (e: number) => {
    setLoad("semester");
    console.log("ambil data semester dengan Id TA: " + e);
    const data = {
      inst: session.data?.user?.instansiId,
      ta_id: Number(e),
    };
    const res = await taSmesterServices.getDataSemester(
      data,
      session.data?.accessToken,
    );
    if (res.status !== 200) {
      setLoad("");
      setToaster({
        variant: "danger",
        message: res.data.message,
      });
    } else {
      setLoad("");
      setSemesterData(res.data.data);
    }
    console.log(data);
    console.log(res);
  };
  const handleAddAbsensi = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading("btnSubmitAkademik");
    const form: any = e.target as HTMLFormElement;
    const masuk = form.jamMasuk.value + ":" + form.menitMasuk.value + ":00";
    const keluar = form.jamKeluar.value + ":" + form.menitKeluar.value + ":59";
    const data = {
      inst: session.data?.user?.instansiId,
      tahunajaran_id: Number(form.tahunajaran.value),
      semester_id: Number(form.semester.value),
      hari: form.hari.value,
      kelas_id: Number(form.kelas.value),
      mapel_id: Number(form.mapel.value),
      guru_id: Number(form.guru.value),
      start_time: masuk,
      end_time: keluar,
      institution_id: session.data?.user?.instansi,
    };
    console.log(data);
    const result = await jadwalAkademikServices.AddData(
      data,
      session.data?.accessToken,
    );
    if (result.status === 200) {
      if (result.data.status_code === 200) {
        setToaster({
          variant: "success",
          message: "Tambah Jadwal Akademik berhasil!",
        });
        console.log(result);
        const dataInst = {
          inst: session.data?.user?.instansiId,
        };

        // fetch ulang seluruh data user
        const resData = await jadwalAkademikServices.getAllData(
          dataInst,
          session.data?.accessToken,
        );
        console.log(resData);
        setDataJdwlAkdmk(resData.data.data);
        setIsLoading("");
        setAddAbsensi(false);
      } else {
        setToaster({
          variant: "danger",
          message: result.data.message,
        });
        setIsLoading("");
      }
    } else {
      setIsLoading("");
    }
  };

  return (
    <>
      <Modal width="min-w-[500px]" onClose={() => setAddAbsensi(false)}>
        <h1 className="bg-green-200 text-center py-3 font-semibold border-y-1 border-[var(--primary-color)] mx-[-20px] mb-4">
          Tambah Data Absensi Mata Pelajaran
        </h1>
        <form onSubmit={handleAddAbsensi}>
          <div className="border-b border-gray-800 py-2 mb-4 flex gap-4 items-center">
            <Typography className="text-[var(--primary-color)] whitespace-nowrap">
              Tahun Ajaran
            </Typography>

            <Select
              name="tahunajaran"
              onChange={handleGetSemester}
              options={
                taData &&
                taData.map((data: any) => ({
                  value: data.id,
                  label: data.name,
                }))
              }
            />
          </div>
          {load === "semester" && (
            <Loader size={24} color="var(--secondary-color)" align="center" />
          )}
          {semesterData && semesterData.length > 0 && (
            <>
              <Select
                className="w-full mb-4"
                label="Semester"
                name="semester"
                options={
                  semesterData &&
                  semesterData.map((data: any) => ({
                    value: data.id,
                    label: data.name,
                  }))
                }
              />

              <Select
                className="w-full mb-4"
                label="Hari"
                name="hari"
                options={
                  hariData &&
                  hariData.map((data: any) => ({
                    value: data.nama_hari,
                    label: data.nama_hari,
                  }))
                }
              />

              <Select
                className="w-full mb-4"
                label="Kelas"
                name="kelas"
                options={
                  kelasData &&
                  kelasData.map((data: any) => ({
                    value: data.id,
                    label: data.code + " - " + data.name,
                  }))
                }
              />

              <Select
                className="w-full mb-4"
                label="Mata Pelajaran"
                name="mapel"
                options={
                  mapelData &&
                  mapelData.map((data: any) => ({
                    value: data.id,
                    label: data.name,
                  }))
                }
              />

              <Select
                className="w-full mb-4"
                label="Nama Guru"
                name="guru"
                options={
                  guruData &&
                  guruData.map((data: any) => ({
                    value: data.id,
                    label: data.name,
                  }))
                }
              />
              <div className="flex gap-4 mb-5">
                <div className="w-1/2 flex border border-1 border-gray-800 p-2 rounded-lg">
                  <div className="flex-col gap-2">
                    <b className="w-full bg-green-100 px-5 py-1">Jam Mulai</b>
                    <div className="flex gap-2 items-center">
                      <Select
                        className="w-full mb-4"
                        label="Jam"
                        name="jamMasuk"
                        options={
                          hours &&
                          hours.map((jam) => ({
                            value: jam,
                            label: jam,
                          }))
                        }
                      />
                      <p>:</p>
                      <Select
                        className="w-full mb-4"
                        label="Menit"
                        name="menitMasuk"
                        options={
                          minutes &&
                          minutes.map((mnt) => ({
                            value: mnt,
                            label: mnt,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="w-1/2 flex border border-1 border-gray-800 p-2 rounded-lg">
                  <div className="flex-col gap-2">
                    <b className="w-full bg-green-100 px-5 py-1">Jam Selesai</b>
                    <div className="flex gap-2 items-center">
                      <Select
                        className="w-full mb-4"
                        label="Jam"
                        name="jamKeluar"
                        options={
                          hours &&
                          hours.map((jam) => ({
                            value: jam,
                            label: jam,
                          }))
                        }
                      />
                      <p>:</p>
                      <Select
                        className="w-full mb-4"
                        label="Menit"
                        name="menitKeluar"
                        options={
                          minutes &&
                          minutes.map((mnt) => ({
                            value: mnt,
                            label: mnt,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading === "btnSubmitAkademik"}
              >
                {isLoading === "btnSubmitAkademik" ? (
                  <div className="box-loader">
                    <div className="loader" />
                    <p>Loading...</p>
                  </div>
                ) : (
                  "Simpan"
                )}
              </Button>
            </>
          )}
        </form>
      </Modal>
    </>
  );
};

export default ModalAddAbsensi;
