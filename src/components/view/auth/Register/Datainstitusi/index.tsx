import React, { useState } from "react";

type Props = {
  dataInstitusi: {
    npsn: string;
    sekolah: string;
    kecamatan: string;
    kabupaten_kota: string;
    provinsi: string;
    alamat: string;
    status: string;
  };

  setDataInstitusi: React.Dispatch<
    React.SetStateAction<{
      npsn: string;
      sekolah: string;
      kecamatan: string;
      kabupaten_kota: string;
      provinsi: string;
      alamat: string;
      status: string;
    }>
  >;
};

const DataInstitusiView = ({ dataInstitusi, setDataInstitusi }: Props) => {
  const [bagBawah, setBagBawah] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // SEARCH NPSN
  const handleSearchNPSN = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    if (!dataInstitusi.npsn) return;

    try {
      setIsLoading(true);

      setBagBawah("");

      const res = await fetch(
        `https://api-sekolah-indonesia.vercel.app/sekolah?npsn=${dataInstitusi.npsn}`,
      );

      const result = await res.json();

      console.log("RESULT:", result);

      if (result.status !== "success") {
        alert("Kegagalan dalam pengambilan data sekolah!");
        return;
      }

      // DATA DITEMUKAN
      if (result.dataSekolah.length > 0) {
        const sekolah = result.dataSekolah[0];

        setDataInstitusi({
          npsn: sekolah.npsn || "",
          sekolah: sekolah.sekolah || "",
          kecamatan: sekolah.kecamatan || "",
          kabupaten_kota: sekolah.kabupaten_kota || "",
          provinsi: sekolah.propinsi || "",
          alamat: sekolah.alamat_jalan || "",
          status: sekolah.status || "N",
        });

        setBagBawah("ada");
      } else {
        // FORM MANUAL
        setBagBawah("tidak");

        setDataInstitusi((prev) => ({
          ...prev,
          sekolah: "",
          kecamatan: "",
          kabupaten_kota: "",
          provinsi: "",
          alamat: "",
          status: "N",
        }));
      }
    } catch (error) {
      console.log(error);

      alert("Terjadi kesalahan saat mengambil data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 flex flex-col gap-2">
      {/* NPSN */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-2">NPSN / NSPP</p>

        <div className="relative">
          <i className="bx bx-search absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-400"></i>

          {isLoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <input
            type="text"
            required
            value={dataInstitusi.npsn}
            onChange={(e) =>
              setDataInstitusi((prev) => ({
                ...prev,
                npsn: e.target.value,
              }))
            }
            onKeyDown={handleSearchNPSN}
            placeholder="Masukkan NPSN lalu tekan Enter"
            className="w-full h-[58px] rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-14 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition-all"
          />
        </div>

        <p className="text-xs text-slate-500 mt-2">
          Tekan Enter untuk mencari data sekolah
        </p>
      </div>

      {/* DATA SEKOLAH DITEMUKAN */}
      {bagBawah === "ada" && (
        <div className="rounded-2xl bg-cyan-50 border border-cyan-100 p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <i className="bx bx-buildings text-cyan-600 text-2xl"></i>

            <p className="font-bold text-cyan-700">{dataInstitusi.sekolah}</p>
          </div>

          <p className="text-sm text-cyan-700">{dataInstitusi.alamat}</p>

          <div className="flex flex-wrap gap-2 mt-2">
            <div className="px-3 py-1 rounded-full bg-white text-sm text-cyan-700 border border-cyan-200">
              {dataInstitusi.kecamatan}
            </div>

            <div className="px-3 py-1 rounded-full bg-white text-sm text-cyan-700 border border-cyan-200">
              {dataInstitusi.kabupaten_kota}
            </div>

            <div className="px-3 py-1 rounded-full bg-white text-sm text-cyan-700 border border-cyan-200">
              {dataInstitusi.provinsi}
            </div>

            <div className="px-3 py-1 rounded-full bg-white text-sm text-cyan-700 border border-cyan-200">
              {dataInstitusi.status === "N" ? "Negeri" : "Swasta"}
            </div>
          </div>
        </div>
      )}

      {/* FORM MANUAL */}
      {bagBawah === "tidak" && (
        <div className="flex flex-col gap-5 animate-fadeIn">
          {/* NAMA */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">
              Nama Sekolah
            </p>

            <div className="relative">
              <i className="bx bx-buildings absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-400"></i>

              <input
                type="text"
                required
                value={dataInstitusi.sekolah}
                onChange={(e) =>
                  setDataInstitusi((prev) => ({
                    ...prev,
                    sekolah: e.target.value,
                  }))
                }
                placeholder="Masukkan nama sekolah"
                style={{ textTransform: "uppercase" }}
                className="w-full h-[58px] rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-4 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition-all"
              />
            </div>
          </div>

          {/* KECAMATAN */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">
              Kecamatan
            </p>

            <input
              type="text"
              required
              value={dataInstitusi.kecamatan}
              onChange={(e) =>
                setDataInstitusi((prev) => ({
                  ...prev,
                  kecamatan: e.target.value,
                }))
              }
              placeholder="Masukkan kecamatan"
              className="w-full h-[58px] rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition-all"
            />
          </div>

          {/* KABUPATEN */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">
              Kabupaten / Kota
            </p>

            <input
              type="text"
              required
              value={dataInstitusi.kabupaten_kota}
              onChange={(e) =>
                setDataInstitusi((prev) => ({
                  ...prev,
                  kabupaten_kota: e.target.value,
                }))
              }
              placeholder="Masukkan kabupaten/kota"
              className="w-full h-[58px] rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition-all"
            />
          </div>

          {/* PROVINSI */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">
              Provinsi
            </p>

            <input
              type="text"
              required
              value={dataInstitusi.provinsi}
              onChange={(e) =>
                setDataInstitusi((prev) => ({
                  ...prev,
                  provinsi: e.target.value,
                }))
              }
              placeholder="Masukkan provinsi"
              className="w-full h-[58px] rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition-all"
            />
          </div>

          {/* ALAMAT */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Alamat</p>

            <textarea
              rows={4}
              value={dataInstitusi.alamat}
              onChange={(e) =>
                setDataInstitusi((prev) => ({
                  ...prev,
                  alamat: e.target.value,
                }))
              }
              placeholder="Masukkan alamat lengkap sekolah nama Jalan, RT, RW, atau kodepos"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 outline-none resize-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition-all"
            />
          </div>

          {/* STATUS */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-3">
              Status Sekolah
            </p>

            <div className="flex gap-4">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  value="N"
                  checked={dataInstitusi.status === "N"}
                  onChange={(e) =>
                    setDataInstitusi((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="peer hidden"
                />

                <div className="px-6 py-4 rounded-2xl border-2 border-slate-200 peer-checked:border-cyan-500 peer-checked:bg-cyan-50 transition-all">
                  <p className="font-semibold text-slate-700">Negeri</p>
                </div>
              </label>

              <label className="cursor-pointer">
                <input
                  type="radio"
                  value="S"
                  checked={dataInstitusi.status === "S"}
                  onChange={(e) =>
                    setDataInstitusi((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="peer hidden"
                />

                <div className="px-6 py-4 rounded-2xl border-2 border-slate-200 peer-checked:border-cyan-500 peer-checked:bg-cyan-50 transition-all">
                  <p className="font-semibold text-slate-700">Swasta</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataInstitusiView;
