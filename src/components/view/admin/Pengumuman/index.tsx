import AdminLayout from "@/components/layout/AdminLayout";
import HeadContent from "@/components/ui/headContent/headcontent";
import HeadContentRightBiasa from "@/components/ui/headContent/headcontentrightbiasa";
import { List } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import PengumumanList from "./ListPage";
import HeadContentRightPengumuman from "@/components/ui/headContent/headcontentrightpengumuman";
import ModalAddPengumuman from "./ModalAddPengumuman";
import { Pengumuman, PengumumanDefault } from "@/type/Pengumuman.type";
import ModalEditPengumuman from "./ModalEditPengumuman";

type Proptypes = {
  setToaster: Dispatch<SetStateAction<{}>>;
  session: any;
  data: Pengumuman[];
  setData: Dispatch<SetStateAction<Pengumuman[]>>;
  loadingFetch: boolean;
  setLoadingFetch: Dispatch<SetStateAction<boolean>>;
};

const PengumumanPageView = (props: Proptypes) => {
  const { setToaster, session, data, setData, loadingFetch, setLoadingFetch } =
    props;
  const [statusPublish, setStatusPublish] = useState<string>("publish"); // publish, draft, schedule
  const [addPengumuman, setAddPengumuman] = useState(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [editData, setEditData] = useState<Pengumuman>(PengumumanDefault);
  const [dataPengumuman, setDataPengumuman] = useState<Pengumuman[]>([]);
  const [isLoading, setIsLoading] = useState<string>("");

  useEffect(() => {
    if (!session?.data?.accessToken) return;
    setDataPengumuman(
      data.filter((item) => item.status_publish === statusPublish),
    );
  }, [session, data, statusPublish]);

  return (
    <>
      <AdminLayout>
        <div>
          <div className="bagian-head-content flex justify-between items-center">
            <HeadContent text="Pengumuman" />
            <HeadContentRightPengumuman
              statusPublish={statusPublish}
              setStatusPublish={setStatusPublish}
              setAddPengumuman={setAddPengumuman}
            />
          </div>
          <PengumumanList
            data={dataPengumuman}
            loadingFetch={loadingFetch}
            setEditModal={setEditModal}
            setEditData={setEditData}
          />
        </div>
      </AdminLayout>
      {addPengumuman && (
        <ModalAddPengumuman
          open={addPengumuman}
          onClose={() => setAddPengumuman(false)}
          setToaster={setToaster}
          setAddPengumuman={setAddPengumuman}
          setData={setData}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
      {Object.keys(editData).length > 0 && (
        <ModalEditPengumuman
          open={editModal}
          onClose={() => setEditModal(false)}
          editData={editData}
          setEditData={setEditData}
          setEditModal={setEditModal}
          setToaster={setToaster}
          setData={setData}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </>
  );
};

export default PengumumanPageView;
