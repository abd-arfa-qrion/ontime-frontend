import Loader from "@/components/ui/loader";
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
import { Box, Typography, Modal, ButtonBase } from "@mui/material";
import Select from "@/components/ui/select";
import React, {
  act,
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Button from "@/components/ui/button";
import { useTahunAjaranStore } from "@/store/tahunAjaranStore";

type Proptypes = {
  open: boolean;
  onClose: () => void;
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
    open,
    onClose,
    updateJadwal,
    setUpdateJadwal,
    setToaster,
    session,
    setData,
    kelasData,
    isLoading,
    setIsLoading,
  } = props;

  // const [taData, setTaData] = useState<TahunAjaran[]>([]);
  const [semesterData, setSemesterData] = useState<Semester[]>([]);
  const [hariData, setHariData] = useState<Hari[]>([]);
  const [guruData, setGuruData] = useState<Guru[]>([]);
  const [mapelData, setMapelData] = useState<Mapel[]>([]);

  const [valueGuru, setValueGuru] = useState<any>(null);
  const [valueMapel, setValueMapel] = useState<any>(null);
  const [valueHari, setValueHari] = useState<any>(null);
  const [valueSem, setValueSem] = useState<any>(null);
  const [valueKelas, setValueKelas] = useState<any>(null);

  const activeTahunAjaran = useTahunAjaranStore(
    (state) => state.activeTahunAjaran,
  );
  const handleUpdateJadwalAkademik = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsLoading("updtJAka");

    const form: any = event.target as HTMLFormElement;

    const masuk = form.jamMasuk.value + ":" + form.menitMasuk.value + ":00";
    const keluar = form.jamKeluar.value + ":" + form.menitKeluar.value + ":59";

    if (
      Number(form.tahunajaran.value) === updateJadwal.tahunajaran_id &&
      Number(valueSem.value) === updateJadwal.semester_id &&
      valueHari.value === updateJadwal.hari &&
      Number(valueKelas.value) === updateJadwal.kelas_id &&
      Number(valueMapel.value) === updateJadwal.mapel_id &&
      Number(valueGuru.value) === updateJadwal.guru_id &&
      masuk === updateJadwal.start_time &&
      keluar === updateJadwal.end_time
    ) {
      setIsLoading("");
      setToaster({
        variant: "warning",
        message: "Tidak ada perubahan data",
      });
      return;
    }

    const data = {
      id: updateJadwal.id,
      inst: session.data?.user?.instansiId,
      tahunajaran_id: Number(updateJadwal.tahunajaran_id),
      semester_id: Number(valueSem.value),
      hari: valueHari.value,
      kelas_id: Number(valueKelas.value),
      mapel_id: Number(valueMapel.value),
      guru_id: Number(valueGuru.value),
      start_time: masuk,
      end_time: keluar,
      institution_id: session.data?.user?.instansi,
    };

    console.log("data yang akan diupdate:", data);
    try {
      const result = await jadwalAkademikServices.updateData(
        data,
        session.data?.accessToken,
      );
      if (result.status !== 200 || result.data.status_code !== 200) {
        setIsLoading("");
        setToaster({
          variant: "warning",
          message: result.data.message,
        });
      } else {
        setIsLoading("");
        form.reset();
        setIsLoading("");
        setUpdateJadwal({});
        setToaster({
          variant: "success",
          message: "Update Jadwal Pelajaran Berhasil!",
        });
        // feth ulang seluruh data user
        const payload = {
          inst: session.data?.user?.instansiId,
          tahunajaran: activeTahunAjaran?.name,
        };
        const { data } = await jadwalAkademikServices.getAllData(
          payload,
          session.data?.accessToken,
        );
        setData(data.data);
      }
    } catch (error) {
      setToaster({
        variant: "danger",
        message: "Terjadi kesalahan",
      });
      setIsLoading("");
    }
  };

  useEffect(() => {
    if (!session?.data?.accessToken) return;
    const loadData = async () => {
      await getSemester(); // tunggu selesai dulu
      await Promise.all([getDataGuru(), getHari(), getDataMapel()]); // setelah itu baru jalankan paralel
    };

    if (session.status === "authenticated") {
      loadData();
      console.log("data editing: ", updateJadwal);
    }
  }, [session?.data?.accessToken]);

  // Setting Nilai Awal dari editingData
  useEffect(() => {
    if (!updateJadwal || semesterData.length === 0) return;
    const found = semesterData.find((k) => k.id === updateJadwal.semester_id);
    if (found) {
      setValueSem({
        label: found.name,
        value: found.id,
      });
    }
  }, [updateJadwal, semesterData]);

  useEffect(() => {
    if (!updateJadwal || hariData.length === 0) return;
    const found = hariData.find((k) => k.nama_hari === updateJadwal.hari);
    if (found) {
      setValueHari({
        label: found.nama_hari,
        value: found.nama_hari,
      });
    }
  }, [updateJadwal, hariData]);

  useEffect(() => {
    if (!updateJadwal || kelasData.length === 0) return;
    const found = kelasData.find((k) => k.id === updateJadwal.kelas_id);
    if (found) {
      setValueKelas({
        label: found.name,
        value: found.id,
      });
    }
  }, [updateJadwal, kelasData]);

  useEffect(() => {
    if (!updateJadwal || mapelData.length === 0) return;
    const found = mapelData.find((k) => k.id === updateJadwal.mapel_id);
    if (found) {
      setValueMapel({
        label: found.name,
        value: found.id,
      });
    }
  }, [updateJadwal, mapelData]);

  useEffect(() => {
    if (!updateJadwal || guruData.length === 0) return;
    const found = guruData.find((k) => k.id === updateJadwal.guru_id);
    if (found) {
      setValueGuru({
        label: found.name,
        value: found.id,
      });
    }
  }, [updateJadwal, guruData]);
  // END Setting awal

  // const getDataTA = async () => {
  //   const data = {
  //     inst: session.data?.user?.instansiId,
  //   };
  //   const res = await taSmesterServices.getDataTA(
  //     data,
  //     session.data?.accessToken,
  //   );
  //   if (res.status !== 200) {
  //     setToaster({
  //       variant: "danger",
  //       message: res.data.message,
  //     });
  //   } else {
  //     setTaData(res.data.data);
  //   }
  //   console.log(res);
  // };

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
  const getSemester = async () => {
    try {
      const data = {
        inst: session.data?.user?.instansiId,
        ta_id: updateJadwal.tahunajaran_id,
      };
      const res = await taSmesterServices.getDataSemester(
        data,
        session.data?.accessToken,
      );
      if (res.status !== 200 && res.data.status_code !== 200) {
        setToaster({
          variant: "danger",
          message: res.data.message,
        });
        console.log(res);
      } else {
        setSemesterData(res.data.data);
      }
    } catch (error) {
      setToaster({
        variant: "danger",
        message: "Terjadi kesalahan",
      });
      console.log(error);
    } finally {
      setIsLoading("");
    }
  };
  // const handleGetSemester = async (e: number) => {
  //   setIsLoading("semesterUpdt");
  //   console.log("ambil data semester dengan Id TA: " + e);
  //   const data = {
  //     inst: session.data?.user?.instansiId,
  //     ta_id: Number(e),
  //   };
  //   const res = await taSmesterServices.getDataSemester(
  //     data,
  //     session.data?.accessToken,
  //   );
  //   if (res.status !== 200) {
  //     setIsLoading("");
  //     setToaster({
  //       variant: "danger",
  //       message: res.data.message,
  //     });
  //   } else {
  //     setIsLoading("");
  //     setSemesterData(res.data.data);
  //   }
  //   console.log(data);
  //   console.log(res);
  // };
  const startTime = updateJadwal?.start_time
    ? updateJadwal.start_time.split(":")
    : ["", ""];
  const endTime = updateJadwal?.end_time
    ? updateJadwal.end_time.split(":")
    : ["", ""];

  const jamMasukDefault = startTime[0];
  const menitMasukDefault = startTime[1];
  const jamPulangDefault = endTime[0];
  const menitPulangDefault = endTime[1];

  return (
    <Modal open={open} onClose={() => setUpdateJadwal({})}>
      <Box
        sx={{
          width: 600,
          bgcolor: "#fff",
          borderRadius: 2,
          p: 3,
          mx: "auto",
          mt: "10%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <div className=" flex justify-between items-center bg-green-200 text-center p-3 border-y-1 border-[var(--primary-color)] mx-[-20px] mb-4">
          <h1 className="font-semibold">Update Data Absensi Mata Pelajaran</h1>
          <ButtonBase onClick={onClose}>
            <i className="bx bx-x text-2xl"></i>
          </ButtonBase>
        </div>

        <form onSubmit={handleUpdateJadwalAkademik}>
          <div className="border-b border-gray-800 py-2 mb-4 flex gap-4 items-center">
            <Typography className="text-[var(--primary-color)] whitespace-nowrap">
              Tahun Ajaran
            </Typography>

            <b>{updateJadwal.ta}</b>
          </div>
          {isLoading === "semesterUpdt" ||
          !semesterData ||
          !hariData ||
          !kelasData ||
          !mapelData ||
          !guruData ? (
            <Loader size={24} color="var(--secondary-color)" align="center" />
          ) : null}

          <div>
            <div className="my-2 flex flex-col gap-4">
              <SearchSelect
                label="Semester"
                options={
                  semesterData &&
                  semesterData.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))
                }
                value={valueSem}
                onChange={(val) => setValueSem(val)}
                size="medium"
                className="rounded-lg"
                placeholder="Cari..."
              />

              <SearchSelect
                label="Hari"
                options={
                  hariData &&
                  hariData.map((item) => ({
                    label: item.nama_hari,
                    value: item.nama_hari,
                  }))
                }
                value={valueHari}
                onChange={(val) => setValueHari(val)}
                size="medium"
                className="rounded-lg"
                placeholder="Cari..."
              />

              <SearchSelect
                label="Kelas"
                options={
                  kelasData &&
                  kelasData.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))
                }
                value={valueKelas}
                onChange={(val) => setValueKelas(val)}
                size="medium"
                className="rounded-lg"
                placeholder="Cari..."
              />

              <SearchSelect
                label="Mata Pelajaran"
                options={
                  mapelData &&
                  mapelData.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                  }))
                }
                value={valueMapel}
                onChange={(val) => setValueMapel(val)}
                size="medium"
                className="rounded-lg"
                placeholder="Cari..."
              />

              <SearchSelect
                label="Pilih Guru"
                options={
                  guruData &&
                  guruData.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                  }))
                }
                value={valueGuru}
                onChange={(val) => setValueGuru(val)}
                placeholder="Cari..."
              />
            </div>
            <div className="flex gap-4 mb-5">
              <div className="w-1/2 flex border border-1 border-gray-800 p-2 rounded-lg">
                <div className="flex-col gap-2">
                  <b className="w-full bg-green-100 px-5 py-1">Jam Mulai</b>
                  <div className="flex gap-2 items-center">
                    <Select
                      className="w-full mb-4"
                      label="Jam"
                      name="jamMasuk"
                      defaultValue={jamMasukDefault}
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
                      defaultValue={menitMasukDefault}
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
                      defaultValue={jamPulangDefault}
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
                      defaultValue={menitPulangDefault}
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
            <div className="flex gap-4 w-[70%] ml-auto mt-10">
              <Button
                type="button"
                className="[background:var(--gradient-secondary)] hover:[background:var(--secondary-dark)]"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading === "updtJAka"}
                className="[background:var(--gradient-primary)] hover:[background:var(--primary-color)]"
              >
                {isLoading === "updtJAka" ? (
                  <div className="box-loader">
                    <div className="loader" />
                    <p>Loading...</p>
                  </div>
                ) : (
                  "Simpan"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalUpdateAbsensiAkademik;
