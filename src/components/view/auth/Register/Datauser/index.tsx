import { PositionPegawai } from "@/type/Position.type";
import { DataUser } from "@/type/Register.type";
import { Autocomplete, Chip, TextField } from "@mui/material";
import { SetStateAction, useState } from "react";

type Props = {
  dataUser: DataUser;
  setDataUser: React.Dispatch<SetStateAction<DataUser>>;
  dataPosition: PositionPegawai[];
  setSelectPosition: (e: any) => void;
  selectPosition: number | null;
};

const DataUserView = (prop: Props) => {
  const {
    dataUser,
    setDataUser,
    dataPosition,
    setSelectPosition,
    selectPosition,
  } = prop;

  const selectedOption =
    dataPosition.find((opt) => opt.id === selectPosition) || null;

  return (
    <div className="space-y-6 flex flex-col gap-2">
      {/* EMAIL */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-2">Email</p>

        <div className="relative">
          <i className="bx bx-envelope absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-400"></i>

          <input
            type="email"
            required
            value={dataUser.email}
            onChange={(e) =>
              setDataUser((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            placeholder="Masukkan email"
            className="w-full h-[58px] rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
          />
        </div>
      </div>

      {/* FULLNAME */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-2">
          Nama Lengkap
        </p>

        <div className="relative">
          <i className="bx bx-user absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-400"></i>

          <input
            type="text"
            required
            value={dataUser.nama}
            onChange={(e) =>
              setDataUser((prev) => ({
                ...prev,
                nama: e.target.value,
              }))
            }
            placeholder="Masukkan nama lengkap"
            className="w-full h-[58px] rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
          />
        </div>
      </div>

      {/* PHONE */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-2">
          No HP / WhatsApp
        </p>

        <div className="relative flex items-center">
          <div className="absolute left-4 flex items-center gap-2 text-slate-400">
            <i className="bx bx-phone text-2xl"></i>

            <div className="w-px h-6 bg-slate-300"></div>

            <span className="font-semibold text-slate-600 text-sm">+62</span>
          </div>

          <input
            type="tel"
            required
            value={dataUser.phone}
            onChange={(e) =>
              setDataUser((prev) => ({
                ...prev,
                phone: e.target.value.replace(/^0+/, ""),
              }))
            }
            placeholder="85234569876"
            className="w-full h-[58px] rounded-2xl border border-slate-200 bg-slate-50 pl-[120px] pr-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
          />
        </div>

        <p className="text-xs text-orange-600 mt-2">
          Gunakan format tanpa angka 0 di depan
        </p>
      </div>

      {/* PHONE */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-2">
          Posisi Sebagai
        </p>
        <Autocomplete
          options={dataPosition}
          value={selectedOption}
          getOptionLabel={(option) => option.positionName}
          isOptionEqualToValue={(option, val) => option.id === val.id}
          onChange={(event, newValue) => {
            setSelectPosition(newValue?.id || null);
          }}
          renderInput={(params) => (
            <TextField {...params} placeholder="Pilih posisi" />
          )}
        />
      </div>

      {/* INFO */}
      <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 flex gap-3">
        <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
          <i className="bx bxl-whatsapp text-2xl text-emerald-500"></i>
        </div>

        <div>
          <p className="font-semibold text-emerald-700 text-sm">
            Verifikasi Whatsapp
          </p>

          <p className="text-sm text-emerald-600 mt-1">
            Kode OTP akan dikirim ke Whatsapp kamu!
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataUserView;
