import { Button } from "@mui/material";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";

type Proptype = {
  setToaster: Dispatch<SetStateAction<{}>>;
  invoiceData: any;
};

const PaymentPageView = (prop: Proptype) => {
  const router = useRouter();

  const { setToaster, invoiceData } = prop;

  const [remainingTime, setRemainingTime] = useState(15 * 60);
  const [paymentStatus, setPaymentStatus] = useState("PENDING");
  const [isChecking, setIsChecking] = useState(false);

  const [loadingBtn, setLoadingBtn] = useState("");

  // =========================
  // Countdown 15 menit
  // =========================
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          // Hapus session storage
          sessionStorage.removeItem("invoice");

          setToaster({
            variant: "warning",
            message: "Waktu pembayaran telah habis",
          });

          // Redirect ke choose plan
          router.push("/newncil");

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, setToaster]);

  // =========================
  // Format Countdown
  // =========================
  const formattedCountdown = useMemo(() => {
    const minutes = Math.floor(remainingTime / 60)
      .toString()
      .padStart(2, "0");

    const seconds = (remainingTime % 60).toString().padStart(2, "0");

    return `${minutes}:${seconds}`;
  }, [remainingTime]);

  // =========================
  // Live Check Pembayaran
  // =========================
  useEffect(() => {
    if (!invoiceData?.referenceNumber) return;

    const checkPaymentStatus = async () => {
      try {
        setIsChecking(true);

        // =========================
        // CALL API CHECK STATUS
        // =========================
        console.log("check payment status");
        try {
          const req = await fetch(
            `${process.env.NEXT_PUBLIC_ONTUITION_BASEURL}/api/payment-gateway-logs/reference/${invoiceData?.referenceNumber}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("tokenQMS")}`,
              },
            },
          );
          const res = await req.json();
          console.log(res);
          if (res.status === 200 && res.data.gatewayStatus === "SUCCESS") {
            setToaster({
              variant: "success",
              message: "Pembayaran berhasil silahkan login kembali!",
            });
            setLoadingBtn("btnCancelPay");
            sessionStorage.removeItem("invoice");
            signOut();
          }
        } catch (error) {
          console.log(error);
        }

        // CONTOH RESPONSE
        // const result = await api...

        const result = {
          status: "PENDING",
        };

        setPaymentStatus(result.status);

        // =========================
        // JIKA SUDAH PAID
        // =========================
        if (result.status === "PAID") {
          sessionStorage.removeItem("invoice");

          setToaster({
            variant: "success",
            message: "Pembayaran berhasil",
          });

          // Redirect
          router.push("/auth/login");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsChecking(false);
      }
    };

    // First hit
    checkPaymentStatus();

    // Polling tiap 30 detik
    const interval = setInterval(() => {
      checkPaymentStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, [invoiceData, router, setToaster]);

  const isExpired = remainingTime <= 0;
  const handleCancel = () => {
    setLoadingBtn("btnCancelPay");
    sessionStorage.removeItem("invoice");
    setLoadingBtn("");
    router.push("/newncil");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 flex justify-center items-center p-5">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-green-100 overflow-hidden">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-600 to-teal-500 text-white p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold">Pembayaran Tagihan</h1>
              <p className="text-sm text-green-100 mt-1">
                Silahkan selesaikan pembayaran sebelum waktu habis
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl text-center min-w-[120px]">
              <p className="text-xs text-white/80 mb-1">Expired Dalam</p>
              <p
                className={`text-3xl font-bold tracking-wider ${
                  isExpired ? "text-red-200" : "text-white"
                }`}
              >
                {formattedCountdown}
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-5">
          {/* STATUS & NO VA */}
          <div className="flex justify-between bg-gray-50 border rounded-2xl p-4">
            <div>
              <p className="text-sm text-gray-500">
                {invoiceData?.paymentMethodName} {invoiceData?.channel}
              </p>
              <p className="text-3xl font-bold">{invoiceData?.paymentCode}</p>
            </div>
            <div>
              <div>
                <p className="text-sm text-gray-500">Status Pembayaran</p>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      paymentStatus === "PAID"
                        ? "bg-green-500"
                        : paymentStatus === "EXPIRED"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                    }`}
                  />
                  <p className="font-semibold text-lg">{paymentStatus}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-400">
                  Auto refresh setiap 30 detik
                </p>
                <div className="flex items-center justify-end gap-2 mt-1">
                  {isChecking && (
                    <>
                      <div className="w-3 h-3 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-green-600">Checking...</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* DETAIL TAGIHAN */}
          <div className="border rounded-2xl overflow-hidden">
            <div className="bg-green-50 px-5 py-3 border-b">
              <h3 className="font-semibold text-green-800">Detail Tagihan</h3>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <p className="text-gray-500">Invoice ID</p>
                <p className="font-semibold break-all text-right">
                  {invoiceData?.referenceNumber || "-"}
                </p>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <p className="text-gray-500">Nama Pembayaran</p>
                <p className="font-semibold text-right">
                  {invoiceData?.title || "Tagihan Pembayaran Ontime"}
                </p>
              </div>

              <div className="flex justify-between items-center border-b pb-3">
                <p className="text-gray-500">Metode Pembayaran</p>
                <p className="font-semibold text-right">
                  {invoiceData.paymentMethodName === "VA"
                    ? "Virtual Account"
                    : invoiceData.paymentMethodName}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl p-5">
                <div className="flex justify-between items-center pb-3 border-b border-green-100">
                  <p className="text-gray-500 text-sm">Subtotal</p>

                  <p className="font-medium text-gray-700">
                    Rp{" "}
                    {Number(invoiceData?.amount || 0).toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-green-100">
                  <p className="text-gray-500 text-sm">
                    Pajak ({invoiceData?.taxPercent || 0}%)
                  </p>

                  <p className="font-medium text-gray-700">
                    Rp{" "}
                    {Number(invoiceData?.taxAmount || 0).toLocaleString(
                      "id-ID",
                    )}
                  </p>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-green-100">
                  <p className="text-gray-500 text-sm">Biaya Pembayaran</p>

                  <p className="font-medium text-gray-700">
                    Rp{" "}
                    {Number(
                      invoiceData?.totalPayment - invoiceData?.totalAmount || 0,
                    ).toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Pembayaran</p>
                    <p className="text-xs text-gray-400">
                      Termasuk pajak dan biaya layanan
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-700">
                      Rp{" "}
                      {Number(invoiceData?.totalPayment || 0).toLocaleString(
                        "id-ID",
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QRIS */}
          {invoiceData?.qrImage && (
            <div className="flex flex-col items-center border rounded-2xl p-5 bg-gray-50">
              <img
                src={invoiceData.qrImage}
                alt="QRIS"
                className="w-64 h-64 object-contain"
              />

              <p className="text-sm text-gray-500 mt-4 text-center">
                Scan QRIS menggunakan aplikasi E-Wallet atau Mobile Banking
              </p>
            </div>
          )}

          {/* EXPIRED */}
          {isExpired && paymentStatus !== "PAID" && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 flex gap-3 items-start">
              <i className="bx bx-error-circle text-2xl" />
              <div>
                <p className="font-semibold">Pembayaran Expired</p>
                <p className="text-sm mt-1">
                  Waktu pembayaran telah habis. Silahkan buat transaksi baru.
                </p>
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {paymentStatus === "PAID" && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 flex gap-3 items-start">
              <i className="bx bx-check-circle text-2xl" />
              <div>
                <p className="font-semibold">Pembayaran Berhasil</p>
                <p className="text-sm mt-1">
                  Pembayaran telah diterima dan transaksi selesai.
                </p>
              </div>
            </div>
          )}
          <div className="mt-14 flex justify-center">
            <button
              disabled={loadingBtn === "btnCancelPay"}
              onClick={handleCancel}
              className="rounded-2xl bg-gradient-to-r from-gray-500 to-gray-100 px-10 py-4 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:scale-[1.02] hover:opacity-90"
            >
              {loadingBtn === "btnCancelPay" ? (
                <div className="box-loader">
                  <div className="loader" />
                  <p>Loading...</p>
                </div>
              ) : (
                "Cancel"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPageView;
