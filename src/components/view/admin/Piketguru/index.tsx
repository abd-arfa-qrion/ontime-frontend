import AdminLayout from "@/components/layout/AdminLayout";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import HeadContent from "@/components/ui/headContent/headcontent";
import { PiketGuru } from "@/type/Piketguru.type";
import DataTablePiketGuru from "@/components/ui/ontime/datatable/datatablepiketguru";
import HeadContentRightBiasa from "@/components/ui/headContent/headcontentrightbiasa";

type Proptypes = {
  dataPiketGuru: PiketGuru[];
  setToaster: Dispatch<SetStateAction<{}>>;
  loadingFetch: boolean;
  setLoadingFetch: Dispatch<SetStateAction<boolean>>;
  session: any;
};
const PiketGuruPageView = (props: Proptypes) => {
  const { dataPiketGuru, setToaster, session, loadingFetch, setLoadingFetch } =
    props;
  const [piketData, setPiketData] = useState<PiketGuru[]>([]);

  // modal
  const [updatePiket, setUpdatePiket] = useState<PiketGuru | {}>({});
  const [deletedPiket, setDeletedPiket] = useState<PiketGuru | {}>({});

  useEffect(() => {
    setPiketData(dataPiketGuru);
  }, [dataPiketGuru]);

  return (
    <>
      <AdminLayout>
        <div>
          <div className="bagian-head-content flex justify-between items-center">
            <HeadContent text="Manajemen Piket" />
            <HeadContentRightBiasa />
          </div>

          <DataTablePiketGuru
            data={piketData}
            setData={setPiketData}
            setToaster={setToaster}
            session={session}
            loadingFetch={loadingFetch}
            setLoadingFetch={setLoadingFetch}
          />
        </div>
      </AdminLayout>
    </>
  );
};

export default PiketGuruPageView;
