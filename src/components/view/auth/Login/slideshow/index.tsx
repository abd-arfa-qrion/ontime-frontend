// components/fragments/AuthSlideshow/index.tsx

import { useEffect, useState } from "react";

const slides = [
  {
    icon: "bx bx-time-five",
    title: "Presensi Digital Real-Time",
    desc: "Smart School Presensi Management System (SMPSM) membantu Kelola kehadiran siswa dan guru secara otomatis, cepat, dan akurat dalam satu platform terintegrasi.",
  },
  {
    icon: "bx bx-line-chart",
    title: "Monitoring Kehadiran Lebih Mudah",
    desc: "Pantau Semua Aktivitas Presensi Dalam Satu Dashboard dengan sistem aplikasi yang unggul dan mudah digunakan.",
  },
  {
    icon: "bx bx-user-check",
    title: "Tingkatkan Disiplin & Komunikasi",
    desc: "Solusi Presensi Pintar untuk Sekolah Digital. Mulai Digitalisasi Presensi Sekolah Anda Sekarang!",
  },
];

const AuthSlideshow = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:flex flex-1 relative overflow-hidden min-h-[560px]">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600" />

      {/* ORNAMEN */}
      <div className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full bg-white/10 blur-3xl" />

      <div className="absolute bottom-[-100px] left-[-100px] w-[320px] h-[320px] rounded-full bg-cyan-300/10 blur-3xl" />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col justify-between w-full p-12 text-white">
        {/* TOP */}
        <div>
          <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md px-5 py-3 border border-white/10">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
              <i className="bx bx-shield-quarter text-3xl"></i>
            </div>

            <div>
              <p className="font-bold text-lg">Ontime Education</p>

              <p className="text-sm text-white/80">
                Smart School Presensi Management
              </p>
            </div>
          </div>
        </div>

        {/* CENTER */}
        <div className="flex flex-col items-center justify-center text-center px-10">
          {/* ICON */}
          <div className="w-36 h-36 rounded-[40px] bg-white/10 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-2xl">
            <i
              className={`${slides[activeSlide].icon} text-[90px] text-white`}
            />
          </div>

          {/* TEXT */}
          <div className="mt-10">
            <h1 className="text-3xl font-bold leading-tight">
              {slides[activeSlide].title}
            </h1>

            <p className="mt-5 text-lg text-white/85 leading-relaxed">
              {slides[activeSlide].desc}
            </p>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="flex items-center justify-between">
          {/* DOT */}
          <div className="flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  activeSlide === index
                    ? "w-10 h-3 bg-white"
                    : "w-3 h-3 bg-white/40"
                }`}
              />
            ))}
          </div>

          {/* STATUS */}
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md px-4 py-3 border border-white/10">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-emerald-600">
              <i className="bx bx-check-shield text-2xl"></i>
            </div>

            <div>
              <p className="font-semibold">Secure System</p>

              <p className="text-xs text-white/70">SSL Protected & Encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSlideshow;
