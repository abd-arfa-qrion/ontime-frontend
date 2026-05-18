import NewNcilPageView from "@/components/view/newncil";
import { CurrentPlan, Plan } from "@/type/Plan.type";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const NewNcilPage = ({ setToaster }: any) => {
  const [loadingFetch, setLoadingFetch] = useState("");
  const [currentPlan, setCurrentPlan] = useState<CurrentPlan[]>([]);
  const [listPlan, setListPlan] = useState<Plan[]>([]);
  const session: any = useSession();

  const getCurrentPlan = async () => {
    setLoadingFetch("currentPlan");
    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_ONTUITION_BASEURL}/api/package-installations/me?serviceName=ONTIME`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("tokenQMS")}`,
          },
        },
      );
      const res = await req.json();
      if (res.status !== 200) {
        console.error("Gagal mengambil data plan");
        return;
      }
      console.log(res.data);
      setCurrentPlan(res.data);
    } catch (error) {
      console.error("Get data jadwal akademik error:", error);
    } finally {
      setLoadingFetch("");
    }
  };

  const getPlan = async () => {
    setLoadingFetch("plan");
    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_ONTUITION_BASEURL}/api/subscription-plans?plan=ONTIME`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("tokenQMS")}`,
          },
        },
      );
      const res = await req.json();
      if (res.status !== 200) {
        console.error("Gagal mengambil data plan");
        return;
      }
      setListPlan(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Get data list plan error:", error);
    } finally {
      setLoadingFetch("");
    }
  };
  useEffect(() => {
    if (!session?.data?.accessToken) return;
    const loadData = async () => {
      await getCurrentPlan(); // tunggu selesai dulu
      await Promise.all([getPlan()]); // setelah itu baru jalankan paralel
    };

    if (session.status === "authenticated") {
      loadData();
    }
  }, [session.status]);

  return (
    <NewNcilPageView
      currentPlan={currentPlan}
      loadingFetch={loadingFetch}
      setLoadingFetch={setLoadingFetch}
      setToaster={setToaster}
      listPlan={listPlan}
    />
  );
};

export default NewNcilPage;
