import NewncilLayout from "@/components/layout/NewNcilLayout";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  CheckCircleRounded,
  WorkspacePremiumRounded,
} from "@mui/icons-material";
import { CurrentPlan, Plan } from "@/type/Plan.type";
import CardsSkeleton from "@/components/ui/skeleton/card";
import { useRouter } from "next/router";

type Proptypes = {
  currentPlan: CurrentPlan[];
  listPlan: Plan[];
  loadingFetch: string;
  setLoadingFetch: Dispatch<SetStateAction<string>>;
  setToaster: Dispatch<SetStateAction<any>>;
};

const NewNcilPageView = (prop: Proptypes) => {
  const { currentPlan, listPlan, loadingFetch, setToaster, setLoadingFetch } =
    prop;

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loadingBtn, setLoadingBtn] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    setLoadingBtn("submitPlan");
    if (!selectedPlan) {
      setToaster({
        variant: "error",
        message: "Silakan pilih plan terlebih dahulu",
      });

      return;
    }

    console.log("PLAN TERPILIH :", selectedPlan);

    const payload = {
      planId: selectedPlan.id,
      channelId: 1,
      addons: [],
      paymentType: "va",
      serviceId: selectedPlan.serviceId,
    };

    console.log("kirim payload :", payload);
    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_ONTUITION_BASEURL}/api/transaction-business`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("tokenQMS")}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const res = await req.json();
      console.log("response pembuatan invoice :", res);
      if (res.status === 201) {
        sessionStorage.setItem("invoice", JSON.stringify(res.data));
        router.push("/newncil/payment");
        setToaster({
          variant: "success",
          message: `Plan ${selectedPlan.name} berhasil dipilih, lakukan pembayaran`,
        });
      } else {
        console.error("Pembuatan invoice gagal");
        setToaster({
          variant: "danger",
          message: res.message,
        });
        return;
      }
    } catch (error) {
      console.error("Get data jadwal akademik error:", error);
      setToaster({
        variant: "danger",
        message: `Plan ${selectedPlan.name} gagal dipilih`,
      });
    } finally {
      setLoadingBtn("");
    }

    // TODO:
    // lanjutkan ke payment / checkout / api request
  };

  return (
    <NewncilLayout>
      <div className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          {/* CURRENT PLAN */}
          <div className="mb-12 rounded-3xl bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 p-8 text-white shadow-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur">
              <WorkspacePremiumRounded className="!text-[18px]" />
              Current Active Plan
            </div>

            {loadingFetch === "currentPlan" ? (
              <CardsSkeleton />
            ) : currentPlan.length > 0 ? (
              currentPlan.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div>
                    <h1 className="text-4xl font-bold">{item.name} Plan</h1>

                    <p className="mt-3 text-white/80">
                      Paket aktif yang sedang digunakan sekolah Anda saat ini.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                      <p className="text-sm text-white/70">Status</p>

                      <h3 className="mt-2 text-xl font-semibold">
                        {item.status}
                      </h3>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                      <p className="text-sm text-white/70">Expired Date</p>

                      <h3 className="mt-2 text-xl font-semibold">
                        {new Date(item.expDate).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </h3>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                      <p className="text-sm text-white/70">Capacity</p>

                      <h3 className="mt-2 text-xl font-semibold">
                        {item.kuota}
                      </h3>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-xl text-orange-100">
                    Belum ada Active Plan.
                  </h1>
                </div>
              </div>
            )}
          </div>

          {/* HEADER */}
          <div className="mb-14 text-center">
            <h1 className="text-4xl font-bold text-gray-800">
              Choose Your Plan
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
              Pilih paket terbaik untuk mendukung digitalisasi presensi sekolah
              Anda dengan sistem Smart School Presensi Management.
            </p>
          </div>

          {/* PLAN CARDS */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {listPlan.map((plan, index) => {
              const isPopular = plan.price === 12000000;
              const isSelected = selectedPlan?.id === plan.id;

              return (
                <div
                  key={index}
                  onClick={() => setSelectedPlan(plan)}
                  className={`group relative cursor-pointer overflow-hidden rounded-[32px] border bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                    isSelected
                      ? "border-teal-500 ring-4 ring-teal-100 shadow-2xl shadow-teal-100"
                      : isPopular
                        ? "border-teal-500 shadow-teal-100"
                        : "border-gray-200"
                  }`}
                >
                  {/* SELECTED BADGE */}
                  {isSelected && (
                    <div className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 text-white shadow-lg">
                      <CheckCircleRounded />
                    </div>
                  )}

                  {/* Glow */}
                  <div className="absolute right-0 top-0 h-40 w-40 translate-x-10 -translate-y-10 rounded-full bg-teal-100/40 blur-3xl transition-all duration-500 group-hover:scale-125" />

                  <div className="relative z-10">
                    {/* BADGE */}
                    {isPopular ? (
                      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-teal-200">
                        <i className="bx bxs-star text-base"></i>
                        Most Popular
                      </div>
                    ) : (
                      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm font-medium text-gray-500">
                        <i className="bx bx-leaf text-base"></i>
                        Starter Plan
                      </div>
                    )}

                    {/* PLAN HEADER */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-800">
                          {plan.name}
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                          {plan.category}
                        </p>
                      </div>

                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                          isSelected || isPopular
                            ? "bg-teal-500 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <i className="bx bx-buildings text-3xl"></i>
                      </div>
                    </div>

                    {/* PRICE */}
                    <div className="mt-8">
                      <div className="flex items-end gap-2">
                        <span className="text-5xl font-black tracking-tight text-gray-900">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(plan.price)}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-gray-400">
                        Flexible pricing for your institution
                      </p>
                    </div>

                    {/* FEATURES */}
                    <div className="mt-8 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                          <i className="bx bx-check text-lg"></i>
                        </div>

                        <div className="text-gray-700">
                          Kuota Maksimal{" "}
                          {plan.kuota ? (
                            <span className="font-semibold text-gray-900">
                              {plan.kuota}
                            </span>
                          ) : (
                            <i className="bx bx-infinite text-xl"></i>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                          <i className="bx bx-check text-lg"></i>
                        </div>

                        <p className="text-gray-700">Full Access Dashboard</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                          <i className="bx bx-check text-lg"></i>
                        </div>

                        <p className="text-gray-700">
                          Smart Attendance Monitoring
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                          <i className="bx bx-check text-lg"></i>
                        </div>

                        <p className="text-gray-700">
                          Free Mobile APP Teacher for Smart Attendance
                        </p>
                      </div>
                    </div>

                    {/* BUTTON */}
                    <button
                      className={`mt-10 w-full rounded-2xl py-4 text-sm font-semibold tracking-wide transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-200 hover:opacity-90"
                          : "border border-gray-200 bg-white text-gray-700 hover:border-teal-400 hover:text-teal-600"
                      }`}
                    >
                      {isSelected ? "Selected Plan" : "Choose Plan"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SUBMIT BUTTON */}
          {selectedPlan && (
            <div className="mt-14 flex justify-center">
              <button
                disabled={loadingBtn === "submitPlan"}
                onClick={handleSubmit}
                className="rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 px-10 py-4 text-sm font-semibold tracking-wide text-white shadow-xl shadow-teal-200 transition-all duration-300 hover:scale-[1.02] hover:opacity-90"
              >
                {loadingBtn === "submitPlan" ? (
                  <div className="box-loader">
                    <div className="loader" />
                    <p>Loading...</p>
                  </div>
                ) : (
                  "Lanjutkan Berlangganan"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </NewncilLayout>
  );
};

export default NewNcilPageView;
