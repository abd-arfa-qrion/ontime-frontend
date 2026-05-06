"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import HeadContent from "@/components/ui/headContent/headcontent";
import HeadContentRightMonkel from "@/components/ui/headContent/headcontentrightmonkel";
import CardsSkeleton from "@/components/ui/skeleton/card";
import kelasServices from "@/pages/api/services/kelas";
import { Kelas, MonitoringKelas } from "@/type/Kelas.type";
import { formatDateFullID, formatDateShortID } from "@/utils/formatdate";
import { Card } from "@mui/material";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";

type Proptype = {
  data: MonitoringKelas[];
  setToaster: Dispatch<SetStateAction<any>>;
  session: any;
  loadingFetch: boolean;
};

const KelasPageView = (prop: Proptype) => {
  const { setToaster, session, data, loadingFetch } = prop;

  const [kelasData, setKelasData] = useState<Kelas[]>([]);
  const [selectedKelas, setSelectedKelas] = useState<number | null>(null);
  const [now, setNow] = useState(new Date());

  // ======================
  // FILTER
  // ======================
  const handleFilterbyKelas = (kelas: number | null) => {
    setSelectedKelas(kelas);
  };

  const displayData = useMemo(() => {
    if (selectedKelas === null) return data;
    return data.filter((item) => item.kelas_id === selectedKelas);
  }, [data, selectedKelas]);

  // ======================
  // GET KELAS
  // ======================
  useEffect(() => {
    if (!session?.data?.accessToken) return;

    const loadData = async () => {
      const res = await kelasServices.getAllData(
        { inst: session.data?.user?.instansiId },
        session.data?.accessToken,
      );

      if (res.status === 200) {
        setKelasData(res.data.data);
      }
    };

    if (session.status === "authenticated") {
      loadData();
    }
  }, [session?.data?.accessToken]);

  // ======================
  // STATUS
  // ======================
  const getStatusKelas = (start: string, end: string) => {
    const current = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
    );

    const today = current.toISOString().split("T")[0];

    const startTime = new Date(`${today}T${start}`);
    const endTime = new Date(`${today}T${end}`);

    if (current < startTime) return "akan_datang";
    if (current >= startTime && current <= endTime) return "berlangsung";
    return "selesai";
  };

  // ======================
  // PROGRESS
  // ======================
  const getProgress = (start: string, end: string) => {
    const current = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
    );

    const today = current.toISOString().split("T")[0];

    const startTime = new Date(`${today}T${start}`);
    const endTime = new Date(`${today}T${end}`);

    if (current <= startTime) return 0;
    if (current >= endTime) return 100;

    const total = endTime.getTime() - startTime.getTime();
    const passed = current.getTime() - startTime.getTime();

    return Math.floor((passed / total) * 100);
  };

  // ======================
  // COUNTDOWN
  // ======================
  const getRemainingTime = (end: string) => {
    const current = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
    );

    const today = current.toISOString().split("T")[0];
    const endTime = new Date(`${today}T${end}`);

    const diff = endTime.getTime() - current.getTime();

    if (diff <= 0) return "Selesai";

    const minutes = Math.floor(diff / 60000);
    return `${minutes} menit lagi`;
  };

  // ======================
  // GROUP
  // ======================
  const groupedKelas = useMemo(() => {
    const result = {
      akan_datang: [] as MonitoringKelas[],
      berlangsung: [] as MonitoringKelas[],
      selesai: [] as MonitoringKelas[],
    };

    displayData.forEach((item) => {
      const status = getStatusKelas(item.start_time, item.end_time);
      result[status].push(item);
    });

    return result;
  }, [displayData, now]);

  // ======================
  // CARD
  // ======================
  const KelasCard = ({
    item,
    status,
  }: {
    item: MonitoringKelas;
    status: "akan_datang" | "berlangsung" | "selesai";
  }) => {
    const progress = getProgress(item.start_time, item.end_time);

    const statusConfig = {
      akan_datang: { text: "Akan Datang", color: "text-red-500" },
      berlangsung: { text: "Sedang Berlangsung", color: "text-green-500" },
      selesai: { text: "Selesai", color: "text-gray-500" },
    };

    return (
      <Card
        className={`p-3 rounded-lg ${
          status === "berlangsung" ? "ring-2 ring-green-400" : ""
        }`}
      >
        <div className="flex justify-between items-center">
          <h4>{item.mapel_name}</h4>
          <p className={`text-xs ${statusConfig[status].color}`}>
            . {statusConfig[status].text}
          </p>
        </div>

        <div className="text-sm mt-2">
          <table>
            <tbody>
              <tr>
                <td width={50}>Kelas</td>
                <td width={10}>:</td>
                <td>{item.kelas_name}</td>
              </tr>
              <tr>
                <td>Guru</td>
                <td>:</td>
                <td>{item.guru_name}</td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-between items-center">
            <p>
              {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}
            </p>
            <div className="flex gap-2">
              <p className="text-xs text-right mt-1 text-gray-500">
                Progress {progress}%
              </p>
              {status === "berlangsung" && (
                <p className="text-xs text-green-500 mt-1">
                  ⏳ {getRemainingTime(item.end_time)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                backgroundColor:
                  status === "berlangsung"
                    ? "#22c55e"
                    : status === "akan_datang"
                      ? "#ef4444"
                      : "#9ca3af",
              }}
            />
          </div>
        </div>
      </Card>
    );
  };

  // ======================
  // AUTO REFRESH
  // ======================
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // ======================
  // RENDER SECTION
  // ======================
  const renderSection = (
    title: string,
    data: MonitoringKelas[],
    status: "akan_datang" | "berlangsung" | "selesai",
  ) => (
    <>
      <h3 className="mt-6 mb-2">
        {title} <span className="text-xs text-green-500">(Hari Ini)</span>
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {data.length === 0 ? (
          <p className="text-gray-400 text-sm">Tidak ada data</p>
        ) : (
          data.map((item, i) => (
            <KelasCard key={i} item={item} status={status} />
          ))
        )}
      </div>
    </>
  );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center">
        <HeadContent text="Pantau Kelas" />
        <HeadContentRightMonkel
          kelasData={kelasData}
          setKelasData={setKelasData}
          handleFilterbyKelas={handleFilterbyKelas}
        />
      </div>

      <p className="text-xs text-gray-400">
        Total {displayData.length} Jadwal Hari Ini Tanggal{" "}
        <span className="text-[var(--secondary-dark)]">
          {formatDateFullID(new Date())}
        </span>
      </p>

      {loadingFetch ? (
        <CardsSkeleton columns={4} rows={3} />
      ) : (
        <>
          {renderSection(
            "Kelas Yang Akan Datang",
            groupedKelas.akan_datang,
            "akan_datang",
          )}
          {renderSection(
            "Kelas Yang Sedang Berlangsung",
            groupedKelas.berlangsung,
            "berlangsung",
          )}
          {renderSection("Kelas Yang Selesai", groupedKelas.selesai, "selesai")}
        </>
      )}
    </AdminLayout>
  );
};

export default KelasPageView;
