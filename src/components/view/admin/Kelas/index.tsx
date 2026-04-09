import AdminLayout from "@/components/layout/AdminLayout";
import HeadContent from "@/components/ui/headContent/headcontent";
import { Card } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

type Proptype = {
  setToaster: Dispatch<SetStateAction<{}>>;
  session: any;
};
const KelasPageView = (prop: Proptype) => {
  const { setToaster, session } = prop;

  return (
    <AdminLayout>
      <HeadContent text="Pantau Kelas" />

      <h3 className="mb-2 mt-5">
        Kelas Yang Akan Datang{" "}
        <span className="text-green-500 text-sm">( Hari Ini )</span>
      </h3>
      <div className="flex gap-2 flex-wrap grid grid-cols-4">
        <Card className="p-3 w-full rounded-lg">
          <div className="header flex justify-between items-center">
            <h4>Matematika Minat</h4>
            <p className="text-xs text-red-500">. Akan Datang</p>
          </div>
          <div className="content text-sm">
            <table>
              <body>
                <tr>
                  <td width={50}>Kelas</td>
                  <td width={10}>:</td>
                  <td>10 IPA</td>
                </tr>
                <tr>
                  <td>Guru</td>
                  <td>:</td>
                  <td>Kusmini Mpd</td>
                </tr>
              </body>
            </table>
            <p>09:00 - 10:00</p>
          </div>
        </Card>
        <Card className="p-3 w-full rounded-lg">
          <div className="header flex justify-between items-center">
            <h4>Matematika Minat</h4>
            <p className="text-xs text-red-500">. Akan Datang</p>
          </div>
          <div className="content text-sm">
            <table>
              <body>
                <tr>
                  <td width={50}>Kelas</td>
                  <td width={10}>:</td>
                  <td>10 IPA</td>
                </tr>
                <tr>
                  <td>Guru</td>
                  <td>:</td>
                  <td>Kusmini Mpd</td>
                </tr>
              </body>
            </table>
            <p>09:00 - 10:00</p>
          </div>
        </Card>
        <Card className="p-3 w-full rounded-lg">
          <div className="header flex justify-between items-center">
            <h4>Matematika Minat</h4>
            <p className="text-xs text-red-500">. Akan Datang</p>
          </div>
          <div className="content text-sm">
            <table>
              <body>
                <tr>
                  <td width={50}>Kelas</td>
                  <td width={10}>:</td>
                  <td>10 IPA</td>
                </tr>
                <tr>
                  <td>Guru</td>
                  <td>:</td>
                  <td>Kusmini Mpd</td>
                </tr>
              </body>
            </table>
            <p>09:00 - 10:00</p>
          </div>
        </Card>
      </div>
      <h3 className="mb-2 mt-5">
        Kelas Yang Sedang Berlangsung{" "}
        <span className="text-green-500 text-sm">( Hari Ini )</span>
      </h3>
      <div className="flex gap-2 flex-wrap grid grid-cols-4">
        <Card className="p-3 w-full rounded-lg">
          <div className="header flex justify-between items-center">
            <h4>Matematika Minat</h4>
            <p className="text-xs text-green-500">. Sedang Berlangsug</p>
          </div>
          <div className="content text-sm">
            <table>
              <body>
                <tr>
                  <td width={50}>Kelas</td>
                  <td width={10}>:</td>
                  <td>10 IPA</td>
                </tr>
                <tr>
                  <td>Guru</td>
                  <td>:</td>
                  <td>Kusmini Mpd</td>
                </tr>
              </body>
            </table>
            <p>09:00 - 10:00</p>
          </div>
        </Card>
        <Card className="p-3 w-full rounded-lg">
          <div className="header flex justify-between items-center">
            <h4>Matematika Minat</h4>
            <p className="text-xs text-green-500">. Sedang Berlangsug</p>
          </div>
          <div className="content text-sm">
            <table>
              <body>
                <tr>
                  <td width={50}>Kelas</td>
                  <td width={10}>:</td>
                  <td>10 IPA</td>
                </tr>
                <tr>
                  <td>Guru</td>
                  <td>:</td>
                  <td>Kusmini Mpd</td>
                </tr>
              </body>
            </table>
            <p>09:00 - 10:00</p>
          </div>
        </Card>
        <Card className="p-3 w-full rounded-lg">
          <div className="header flex justify-between items-center">
            <h4>Matematika Minat</h4>
            <p className="text-xs text-green-500">. Sedang Berlangsug</p>
          </div>
          <div className="content text-sm">
            <table>
              <body>
                <tr>
                  <td width={50}>Kelas</td>
                  <td width={10}>:</td>
                  <td>10 IPA</td>
                </tr>
                <tr>
                  <td>Guru</td>
                  <td>:</td>
                  <td>Kusmini Mpd</td>
                </tr>
              </body>
            </table>
            <p>09:00 - 10:00</p>
          </div>
        </Card>
        <Card className="p-3 w-full rounded-lg">
          <div className="header flex justify-between items-center">
            <h4>Matematika Minat</h4>
            <p className="text-xs text-green-500">. Sedang Berlangsug</p>
          </div>
          <div className="content text-sm">
            <table>
              <body>
                <tr>
                  <td width={50}>Kelas</td>
                  <td width={10}>:</td>
                  <td>10 IPA</td>
                </tr>
                <tr>
                  <td>Guru</td>
                  <td>:</td>
                  <td>Kusmini Mpd</td>
                </tr>
              </body>
            </table>
            <p>09:00 - 10:00</p>
          </div>
        </Card>
      </div>
      <h3 className="mb-2 mt-5">
        Kelas Yang Telah Berakhir{" "}
        <span className="text-green-500 text-sm">( Hari Ini )</span>
      </h3>
      <div className="flex gap-2 flex-wrap grid grid-cols-4">
        <Card className="p-3 w-full rounded-lg">
          <div className="header flex justify-between items-center">
            <h4>Matematika Minat</h4>
            <p className="text-xs text-gray-500">. Selesai</p>
          </div>
          <div className="content text-sm">
            <table>
              <body>
                <tr>
                  <td width={50}>Kelas</td>
                  <td width={10}>:</td>
                  <td>10 IPA</td>
                </tr>
                <tr>
                  <td>Guru</td>
                  <td>:</td>
                  <td>Kusmini Mpd</td>
                </tr>
              </body>
            </table>
            <p>09:00 - 10:00</p>
          </div>
        </Card>
        <Card className="p-3 w-full rounded-lg">
          <div className="header flex justify-between items-center">
            <h4>Matematika Minat</h4>
            <p className="text-xs text-gray-500">. Selesai</p>
          </div>
          <div className="content text-sm">
            <table>
              <body>
                <tr>
                  <td width={50}>Kelas</td>
                  <td width={10}>:</td>
                  <td>10 IPA</td>
                </tr>
                <tr>
                  <td>Guru</td>
                  <td>:</td>
                  <td>Kusmini Mpd</td>
                </tr>
              </body>
            </table>
            <p>09:00 - 10:00</p>
          </div>
        </Card>
        <Card className="p-3 w-full rounded-lg">
          <div className="header flex justify-between items-center">
            <h4>Matematika Minat</h4>
            <p className="text-xs text-gray-500">. Selesai</p>
          </div>
          <div className="content text-sm">
            <table>
              <body>
                <tr>
                  <td width={50}>Kelas</td>
                  <td width={10}>:</td>
                  <td>10 IPA</td>
                </tr>
                <tr>
                  <td>Guru</td>
                  <td>:</td>
                  <td>Kusmini Mpd</td>
                </tr>
              </body>
            </table>
            <p>09:00 - 10:00</p>
          </div>
        </Card>
        <Card className="p-3 w-full rounded-lg">
          <div className="header flex justify-between items-center">
            <h4>Matematika Minat</h4>
            <p className="text-xs text-gray-500">. Selesai</p>
          </div>
          <div className="content text-sm">
            <table>
              <body>
                <tr>
                  <td width={50}>Kelas</td>
                  <td width={10}>:</td>
                  <td>10 IPA</td>
                </tr>
                <tr>
                  <td>Guru</td>
                  <td>:</td>
                  <td>Kusmini Mpd</td>
                </tr>
              </body>
            </table>
            <p>09:00 - 10:00</p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default KelasPageView;
