import React, { Dispatch, SetStateAction } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { millisToDateTime } from "@/utils/formatdate";
import { Transaksi } from "@/type/Transaksi.type";
import TxSukses from "../status/txsukses";
import TxGagal from "../status/txgagal";
import renotifServices from "@/services/renotif";

type Proptype = {
  data: Transaksi;
  setData: Dispatch<SetStateAction<Transaksi>>;
  setToaster: Dispatch<SetStateAction<{}>>;
  session: any;
};
const DataTabelTrxDetail = (prop: Proptype) => {
  const { data, setData, setToaster, session } = prop;
  const [btnRenotifLoading, setBtnRenotifLoading] = React.useState(false);
  const handleRenotif = async () => {
    setBtnRenotifLoading(true);
    const currentMillis: number = Date.now();
    const todayMidnightMillis = new Date().setHours(0, 0, 0, 0);
    const today01Millis = new Date().setHours(1, 0, 0, 0);

    const dataRenotif = {
      account_number: data.account_number,
      noref: data.noref,
      nominal: String(data.amount),
      idChannel: data.id_channel,
      kodeTransaksi: data.kode_transaksi,
      keterangan: data.description,
      idTrx: data.id,
      rcAwal: data.tx_status,
      tglTransaksi: Number(data.tgl_transaksi),
      tanggalTerima: data.tanggal_terima,
      tanggalKirim: data.tanggal_kirim,
    };

    try {
      let req;
      if (
        currentMillis > todayMidnightMillis &&
        currentMillis < today01Millis
      ) {
        req = await renotifServices.renotif(
          dataRenotif,
          session.data?.accessToken
        );
        console.log("masuk renotif jam 00:00 s.d 01:00");
      } else {
        if (data.tgl_transaksi <= todayMidnightMillis) {
          req = await renotifServices.renotifBackdate(
            dataRenotif,
            session.data?.accessToken
          );
          console.log("masuk renotif backdate");
        } else {
          req = await renotifServices.renotif(
            dataRenotif,
            session.data?.accessToken
          );
          console.log("masuk renotif");
        }
      }
      if (req.status === 200 && req.data.status_code === 200) {
        setToaster({
          variant: "success",
          message: req.data.message,
        });

        // Tambahkan delay agar toaster sempat tampil
        setTimeout(() => {
          window.location.reload();
        }, 500); // delay 1 detik
        setBtnRenotifLoading(false);
      } else {
        setToaster({
          variant: "danger",
          message: req.data.message,
        });
        setBtnRenotifLoading(false);
      }
    } catch (error) {
      setToaster({
        variant: "danger",
        message: `Data Error! ${error}`,
      }); 
      setBtnRenotifLoading(false);
    }
  };

  return (
    <Paper>
      {/* Field Search dengan Icon */}

      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Status Transaksi</TableCell>
            <TableCell>:</TableCell>
            <TableCell>{data.tx_status_desc}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Kode Status</TableCell>
            <TableCell>:</TableCell>
            <TableCell>
              {data.tx_status === "00" || data.tx_status === "88" ? (
                <TxSukses text={data.tx_status} />
              ) : (
                <TxGagal text={data.tx_status} />
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Account Number</TableCell>
            <TableCell>:</TableCell>
            <TableCell>{data.account_number}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Nama Account</TableCell>
            <TableCell>:</TableCell>
            <TableCell>{data.customer_name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Nama Sekolah</TableCell>
            <TableCell>:</TableCell>
            <TableCell>
              <b>{data.instansi_name}</b>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Kode Instansi</TableCell>
            <TableCell>:</TableCell>
            <TableCell>{data.instansi_id}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Account Number Instansi</TableCell>
            <TableCell>:</TableCell>
            <TableCell>{data.account_number_instansi}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Nama Instansi</TableCell>
            <TableCell>:</TableCell>
            <TableCell>
              <b>{data.instansi_name}</b>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Id Transaksi Rampai</TableCell>
            <TableCell>:</TableCell>
            <TableCell>{data.id_trx_rampai}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Id Transaksi Bank</TableCell>
            <TableCell>:</TableCell>
            <TableCell>{data.id_trx_bank}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Noref</TableCell>
            <TableCell>:</TableCell>
            <TableCell>{data.noref}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Tanggal Inquiry</TableCell>
            <TableCell>:</TableCell>
            <TableCell>{millisToDateTime(data.tgl_inquiry)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Tanggal Terima</TableCell>
            <TableCell>:</TableCell>
            <TableCell>{data.tanggal_terima}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Tanggal Kirim</TableCell>
            <TableCell>:</TableCell>
            <TableCell>{data.tanggal_kirim}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Notify Url</TableCell>
            <TableCell>:</TableCell>
            <TableCell>{data.notify_url}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Id Channel</TableCell>
            <TableCell>:</TableCell>
            <TableCell>{data.id_channel}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Id Terminal</TableCell>
            <TableCell>:</TableCell>
            <TableCell>{data.id_terminal}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Created At</TableCell>
            <TableCell>:</TableCell>
            <TableCell>{millisToDateTime(data.created_at)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Updated At</TableCell>
            <TableCell>:</TableCell>
            <TableCell>{millisToDateTime(data.updated_at)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3}>
              {data.tx_status === "99" || data.tx_status === "68" ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleRenotif}
                  disabled={btnRenotifLoading}
                >
                  {btnRenotifLoading ? (
                    <i className="bx bx-loader bx-spin"></i>
                  ) : (
                    "Renotif"
                  )}
                </Button>
              ) : null}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};

export default DataTabelTrxDetail;
