import AdminLayout from "@/components/layout/AdminLayout";
import HeadContent from "@/components/ui/headContent/headcontent";
import HeadContentRightBiasa from "@/components/ui/headContent/headcontentrightbiasa";
import React, { Dispatch, SetStateAction } from "react";
import UploadLokasiPageView from "./UploadLokasi";
import { InstitutionArea } from "@/type/Institutionarea.type";

type Props = {
  setToaster: Dispatch<SetStateAction<{}>>;
  session: any;
  dataArea: InstitutionArea;
  setDataArea: Dispatch<SetStateAction<InstitutionArea>>;
};
const PengaturanPageView = (prop: Props) => {
  const { setToaster, session, dataArea, setDataArea } = prop;
  return (
    <AdminLayout>
      <div>
        <div className="bagian-head-content flex justify-between items-center">
          <HeadContent text="Pengaturan" />
          <HeadContentRightBiasa />
        </div>
        <div>
          <div className="w-full flex flex-col gap-2 bg-white">
            <div className="w-full shadow-md rounded-lg p-4 flex md:flex-row flex-col gap-4 items-center">
              <UploadLokasiPageView
                setToaster={setToaster}
                session={session}
                dataArea={dataArea}
                setDataArea={setDataArea}
              />

              <div className="max-w-[400px] items-left">
                {dataArea.id !== 0 ? (
                  <div>
                    <p className="flex items-center gap-2">
                      <i className="bx bx-check-circle text-green-700"></i>
                      <span className="text-green-700 text-md font-semibold">
                        Area kamu telah di atur pada
                      </span>
                    </p>
                    <p className="text-sm break-words">{dataArea.area}</p>
                  </div>
                ) : (
                  <div className="bg-orange-100 border border-orange-300 text-orange-700 p-3 rounded flex gap-2">
                    <i className="bx bx-error-circle text-xl"></i>
                    <div>
                      <p className="font-semibold">Area belum diatur</p>
                      <p className="text-sm">
                        Silakan atur area absen institusi terlebih dahulu.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PengaturanPageView;
