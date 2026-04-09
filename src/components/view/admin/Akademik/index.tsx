import AdminLayout from "@/components/layout/AdminLayout";
import HeadContent from "@/components/ui/headContent/headcontent";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import AcademicCalendar from "./CalendarPage";
import HeadContentRightAkademik from "@/components/ui/headContent/headcontentrightakdm";
import DataTableKaldik from "@/components/ui/ontime/datatable/datatablekaldik";
import { Kaldik } from "@/type/Kaldik.type";
import ModalAddKaldik from "./ModalAddData";

type Proptypes = {
  setToaster: Dispatch<SetStateAction<{}>>;
  session: any;
  data: Kaldik[];
  setData: Dispatch<SetStateAction<Kaldik[]>>;
  loadingFetch: boolean;
  setLoadingFetch: Dispatch<SetStateAction<boolean>>;
};

const AkademikPageView = (props: Proptypes) => {
  const { setToaster, session, data, setData, loadingFetch, setLoadingFetch } =
    props;

  //state untuk Calender Akademik
  const [switchBtn, setSwitchBtn] = useState<string>("list"); // publish, draft, schedule
  const [addJadwal, setAddJadwal] = useState(false);

  return (
    <>
      <AdminLayout>
        <div>
          <div className="bagian-head-content flex justify-between items-center">
            <HeadContent text="Kalender Akademik" />
            <HeadContentRightAkademik
              setAddJadwal={setAddJadwal}
              switchBtn={switchBtn}
              setSwitchBtn={setSwitchBtn}
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
              <AcademicCalendar />
            )}
          </div>
        </div>
      </AdminLayout>
      {addJadwal && (
        <ModalAddKaldik
          open={addJadwal}
          onClose={() => {
            setAddJadwal(false);
          }}
          setToaster={setToaster}
          setAddJadwal={setAddJadwal}
          setData={setData}
        />
      )}
    </>
  );
};

export default AkademikPageView;
