import AdminLayout from "@/components/layout/AdminLayout";
import HeadContent from "@/components/ui/headContent/headcontent";
import HeadContentRightBiasa from "@/components/ui/headContent/headcontentrightbiasa";
import React, { Dispatch, SetStateAction } from "react";
import UploadLokasiPageView from "./UploadLokasi";
import { InstitutionArea } from "@/type/Institutionarea.type";
import Link from "next/link";

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
                <div>
                  <div className="flex flex-col gap-4 mb-4 bg-yellow-100 border border-yellow-300 text-orange-700 p-3 rounded ">
                    <div className="flex gap-2">
                      <i className="bx bx-error-circle text-xl"></i>
                      <div>
                        <p className="font-semibold">Area belum diatur?</p>
                        <p className="text-sm">
                          Untuk menentukan area, kamu harus mengupload lokasi
                          dan mendapatkan file .kml. Untuk mendapatkan file
                          .kml, ikuti link di bawah ini
                        </p>
                      </div>
                    </div>
                    <a
                      href="https://www.google.com/maps/d/"
                      className="text-[var(--primary-color)] hover:text-[var(--primary-light)] flex items-center gap-1"
                      target="_blank"
                    >
                      <i className="bx bx-map text-xl"></i>
                      Arahkan ke akun google map sekarang
                      <i className="bx bx-right-arrow-alt text-xl"></i>
                    </a>
                  </div>
                  <p className="flex items-center gap-2">
                    <i className="bx bx-check-circle text-green-700"></i>
                    <span className="text-green-700 text-md font-semibold">
                      Area kamu telah di atur pada
                    </span>
                  </p>
                  <p className="text-sm break-words">{dataArea.area}</p>
                </div>
              </div>
              <div className="max-w-[400px] flex flex-col gap-4">
                <p className="font-semibold">Bagaimana cara menentukan area?</p>
                <Link
                  href="https://drive.google.com/file/d/1nqAvGH_OAKv6Ezy29cHxbMs2OvHSLptA/view?usp=sharing"
                  target="_blank"
                  className="text-[var(--primary-color)] hover:text-[var(--primary-light)] flex items-center gap-1"
                >
                  <i className="bx bx-book text-xl"></i>
                  klik disini
                  <i className="bx bx-right-arrow-alt text-xl"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PengaturanPageView;
