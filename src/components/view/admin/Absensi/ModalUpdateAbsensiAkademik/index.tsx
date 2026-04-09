import Button from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import Modal from "@/components/ui/modal";
import SearchSelect from "@/components/ui/ontime/singleselectsearch";
import guruServices from "@/pages/api/services/guru";
import hariServices from "@/pages/api/services/hari";
import jadwalAkademikServices from "@/pages/api/services/jadwalakademik";
import mapelServices from "@/pages/api/services/mapel";
import taSmesterServices from "@/pages/api/services/tasmester";
import { Guru } from "@/type/Guru.type";
import { Hari } from "@/type/Hari.type";
import { JadwalAkademik } from "@/type/Jadwalakademik.type";
import { Kelas } from "@/type/Kelas.type";
import { Mapel } from "@/type/Mapel.type";
import { Semester } from "@/type/Semester.type";
import { TahunAjaran } from "@/type/Tahunajaran.type";
import { Typography } from "@mui/material";
import Select from "@/components/ui/select";
import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";

type Proptypes = {
  updateJadwal: JadwalAkademik | any;
  setUpdateJadwal: Dispatch<SetStateAction<{}>>;
  setToaster: Dispatch<SetStateAction<{}>>;
  session: any;
  setData: Dispatch<SetStateAction<JadwalAkademik[]>>;
  kelasData: Kelas[];
  isLoading: string;
  setIsLoading: Dispatch<SetStateAction<string>>;
};
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);
const ModalUpdateAbsensiAkademik = (props: Proptypes) => {
  const {
    updateJadwal,
    setUpdateJadwal,
    setToaster,
    session,
    setData,
    kelasData,
    isLoading,
    setIsLoading,
  } = props;

  const [taData, setTaData] = useState<TahunAjaran[]>([]);
  const [semesterData, setSemesterData] = useState<Semester[]>([]);
  const [hariData, setHariData] = useState<Hari[]>([]);
  const [guruData, setGuruData] = useState<Guru[]>([]);
  const [mapelData, setMapelData] = useState<Mapel[]>([]);

  const [valueGuru, setValueGuru] = useState<any>(null);
  const [valueMapel, setValueMapel] = useState<any>(null);
  const [valueHari, setValueHari] = useState<any>(null);
  const [valueSem, setValueSem] = useState<any>(null);
  const [valueKelas, setValueKelas] = useState<any>(null);
  const handleUpdateJadwalAkademik = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsLoading("updtJAka");

    const form: any = event.target as HTMLFormElement;

    const data = {
      id: 11,
      nst: "1b3a0703-4f4e-435f-9949-ece26bf78df5",
      tahunajaran_id: 10,
      semester_id: 2,
      hari: form.name.value,
      kelas_id: 53,
      mapel_id: 2,
      guru_id: 12,
      start_time: "08:45:00",
      end_time: "10:00:59",
    };

    console.log(data);
    const result = await jadwalAkademikServices.updateData(
      data,
      session.data?.accessToken,
    );
    if (result.status === 200) {
      form.reset();
      setIsLoading("updtJAka");
      setUpdateJadwal({});
      setToaster({
        variant: "success",
        message: "Update Jasa berhasil!",
      });
      // feth ulang seluruh data user
      const payload = {
        inst: session.data?.user?.instansiId,
      };
      const { data } = await jadwalAkademikServices.getAllData(
        payload,
        session.data?.accessToken,
      );
      setData(data.data);
    } else {
      setIsLoading("updtJAka");
    }
  };

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
    setIsLoading("semesterUpdt");
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
      setIsLoading("");
      setToaster({
        variant: "danger",
        message: res.data.message,
      });
    } else {
      setIsLoading("");
      setSemesterData(res.data.data);
    }
    console.log(data);
    console.log(res);
  };
  return (
    <Modal width="min-w-[500px]" onClose={() => setUpdateJadwal({})}>
      <h1 className="bg-green-200 text-center py-3 font-semibold border-y-1 border-[var(--primary-color)] mx-[-20px] mb-4">
        Tambah Data Absensi Mata Pelajaran
      </h1>
      <form onSubmit={handleUpdateJadwalAkademik}>
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
        {isLoading === "semesterUpdt" && (
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

            <SearchSelect
              label="Hari"
              options={hariData.map((item: any) => ({
                label: item.name,
                value: item.id,
              }))}
              value={valueHari}
              onChange={(val) => setValueHari(val)}
              placeholder="Cari..."
            />

            <SearchSelect
              label="Kelas"
              options={kelasData.map((item: any) => ({
                label: item.name,
                value: item.id,
              }))}
              value={valueKelas}
              onChange={(val) => setValueKelas(val)}
              placeholder="Cari..."
            />

            <SearchSelect
              label="Mata Pelajaran"
              options={mapelData.map((item: any) => ({
                label: item.name,
                value: item.id,
              }))}
              value={valueMapel}
              onChange={(val) => setValueMapel(val)}
              placeholder="Cari..."
            />

            <SearchSelect
              label="Pilih Guru"
              options={guruData.map((item: any) => ({
                label: item.name,
                value: item.id,
              }))}
              value={valueGuru}
              onChange={(val) => setValueGuru(val)}
              placeholder="Cari..."
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

            <Button type="submit" disabled={isLoading === "updtJAka"}>
              {isLoading === "updtJAka" ? (
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
  );
};

export default ModalUpdateAbsensiAkademik;
