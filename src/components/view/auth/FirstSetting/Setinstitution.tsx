import { decryptString } from "@/utils/encryptionstring";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const SetInstitutionView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sessMsg, setSessMsg] = useState("");

  const [nama, setNama] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const router = useRouter();

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
          "Sesi pembuatan password berakhir! silahkan register kembali!",
        );
        router.replace("/auth/register");
      } else {
        setEmail(textMsg.split(":")[0]);
        setNama(textMsg.split(":")[1]);
        setPhone(textMsg.split(":")[2]);
        setSessMsg(message);
      }
    }
  }, []);

  const [formData, setFormData] = useState({
    institutionCode: "",
    institutionName: "",
    district: "",
    city: "",
    statusNegeri: true,
    name: "",
    telephone: "628",
    email: "",
    positionId: 1,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "radio"
          ? value === "true"
          : name === "positionId"
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // validasi no hp
    if (!formData.telephone.startsWith("628")) {
      alert("Nomor telephone wajib menggunakan format 628xxxx");
      return;
    }

    try {
      setIsLoading(true);

      console.log("PAYLOAD:", formData);

      // contoh API
      // await axios.post("/api/institution", formData);

      alert("Institusi berhasil ditambahkan");
    } catch (error) {
      console.log(error);
      alert("Gagal menambahkan institusi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full max-w-5xl mx-auto">
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-2xl overflow-hidden">
          {/* HEADER */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />

            <div className="relative px-8 py-7 flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center border border-white/20">
                <i className="bx bx-buildings text-5xl text-white"></i>
              </div>

              <div className="text-white">
                <h1 className="text-3xl font-bold">Tambah Institusi Baru</h1>

                <p className="text-emerald-50 mt-1">
                  Lengkapi informasi institusi dengan benar
                </p>
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className="p-8 flex flex-col gap-8">
            {/* DATA INSTITUSI */}
            <div>
              <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-800">
                  Data Institusi
                </h2>

                <p className="text-slate-500 text-sm mt-1">
                  Informasi utama institusi
                </p>
              </div>

              <div className="grid grid-cols-2 gap-5">
                {/* KODE */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Kode Institusi
                  </label>

                  <div className="relative">
                    <i className="bx bx-barcode absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-400"></i>

                    <input
                      type="text"
                      name="institutionCode"
                      value={formData.institutionCode}
                      onChange={handleChange}
                      placeholder="SCH0077XXXX"
                      required
                      className="w-full h-[58px] rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                    />
                  </div>
                </div>

                {/* NAMA */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Nama Institusi
                  </label>

                  <div className="relative">
                    <i className="bx bx-buildings absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-400"></i>

                    <input
                      type="text"
                      name="institutionName"
                      value={formData.institutionName}
                      onChange={handleChange}
                      placeholder="SMK Negeri ..."
                      required
                      className="w-full h-[58px] rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                    />
                  </div>
                </div>

                {/* KECAMATAN */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Kecamatan
                  </label>

                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="Teluk Kuantan"
                    required
                    className="w-full h-[58px] rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                  />
                </div>

                {/* KOTA */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Kota / Kabupaten
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Kuantan Singingi"
                    required
                    className="w-full h-[58px] rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                  />
                </div>

                {/* STATUS */}
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-slate-700 mb-3 block">
                    Status Institusi
                  </label>

                  <div className="flex gap-4">
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="statusNegeri"
                        value="true"
                        checked={formData.statusNegeri === true}
                        onChange={handleChange}
                        className="peer hidden"
                      />

                      <div className="px-6 py-4 rounded-2xl border-2 border-slate-200 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 transition-all">
                        <p className="font-semibold text-slate-700">Negeri</p>
                      </div>
                    </label>

                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="statusNegeri"
                        value="false"
                        checked={formData.statusNegeri === false}
                        onChange={handleChange}
                        className="peer hidden"
                      />

                      <div className="px-6 py-4 rounded-2xl border-2 border-slate-200 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 transition-all">
                        <p className="font-semibold text-slate-700">Swasta</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* DATA PIC */}
            <div>
              <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-800">
                  Data Penanggung Jawab
                </h2>

                <p className="text-slate-500 text-sm mt-1">
                  Informasi pengguna utama institusi
                </p>
              </div>

              <div className="grid grid-cols-2 gap-5">
                {/* NAMA */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Nama PIC
                  </label>

                  <input
                    type="text"
                    name="name"
                    defaultValue={nama}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nama lengkap"
                    required
                    className="w-full h-[58px] rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                  />
                </div>

                {/* PHONE */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    No WhatsApp
                  </label>

                  <input
                    type="text"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="628xxxxxxxxxx"
                    required
                    className="w-full h-[58px] rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    required
                    className="w-full h-[58px] rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                  />
                </div>

                {/* POSITION */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Jabatan
                  </label>

                  <select
                    name="positionId"
                    value={formData.positionId}
                    onChange={handleChange}
                    className="w-full h-[58px] rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                  >
                    <option value={1}>Administrator</option>
                    <option value={2}>Operator</option>
                    <option value={3}>Kepala Sekolah</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ACTION */}
            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                className="h-[54px] px-7 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="h-[54px] px-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-white font-semibold shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <i className="bx bx-save text-2xl"></i>
                    <span>Simpan Institusi</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SetInstitutionView;
