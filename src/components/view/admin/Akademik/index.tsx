import AdminLayout from "@/components/layout/AdminLayout";
import HeadContent from "@/components/ui/headContent/headcontent";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import AcademicCalendar from "./CalendarPage";
import HeadContentRightAkademik from "@/components/ui/headContent/headcontentrightakdm";
import DataTableKaldik from "@/components/ui/ontime/datatable/datatablekaldik";
import { Kaldik } from "@/type/Kaldik.type";
import ModalAddKaldik from "./ModalAddData";
import { DownloadKaldik } from "./Download";

type Proptypes = {
  setToaster: Dispatch<SetStateAction<{}>>;
  session: any;
  data: Kaldik[];
  setData: Dispatch<SetStateAction<Kaldik[]>>;
  loadingFetch: boolean;
  setLoadingFetch: Dispatch<SetStateAction<boolean>>;
  filterTA: string;
  setFilterTA: Dispatch<SetStateAction<string>>;
};

const AkademikPageView = (props: Proptypes) => {
  const {
    setToaster,
    session,
    data,
    setData,
    loadingFetch,
    setLoadingFetch,
    filterTA,
    setFilterTA,
  } = props;

  const [switchBtn, setSwitchBtn] = useState<string>("list");
  const [addJadwal, setAddJadwal] = useState(false);

  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownload = async () => {
    if (exporting) return; // ❗ prevent double click

    setExporting(true);
    setProgress(5);

    try {
      setProgress(20);

      await DownloadKaldik(data, (p: number) => {
        setProgress(p);
      });

      setProgress(100);
    } catch (err) {
      console.error(err);
      setToaster({
        type: "error",
        message: "Gagal export kalender akademik",
      });
    } finally {
      setTimeout(() => {
        setExporting(false);
        setProgress(0);
      }, 400);
    }
  };

  return (
    <>
      <AdminLayout>
        <div>
          <div className="flex justify-between items-center">
            <HeadContent text="Kalender Akademik" />

            <HeadContentRightAkademik
              setAddJadwal={setAddJadwal}
              switchBtn={switchBtn}
              setSwitchBtn={setSwitchBtn}
              setFilterTA={setFilterTA}
              filterTA={filterTA}
              handleDownload={handleDownload}
              exporting={exporting} // ⬅️ penting (disable button)
              progress={progress} // ⬅️ optional UI progress
            />
          </div>

          <div>
            {switchBtn === "list" ? (
              <DataTableKaldik
                data={data}
                setData={setData}
                setToaster={setToaster}
                loadingFetch={loadingFetch}
                setLoadingFetch={setLoadingFetch}
                session={session}
              />
            ) : (
              <AcademicCalendar
                data={data}
                setData={setData}
                setToaster={setToaster}
              />
            )}
          </div>
        </div>
      </AdminLayout>

      {addJadwal && (
        <ModalAddKaldik
          open={addJadwal}
          onClose={() => setAddJadwal(false)}
          setToaster={setToaster}
          setAddJadwal={setAddJadwal}
          setData={setData}
        />
      )}
    </>
  );
};

export default AkademikPageView;
