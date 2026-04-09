import { millisToDate, millisToDateTime } from "@/utils/formatdate";
import React from "react";

type ExcelTemplateProps = {
  data: any[];
};

const ExportDataTransaksiTemplate = ({ data }: ExcelTemplateProps) => {
  return (
    <table
      style={{
        borderCollapse: "collapse",
        width: "100%",
        border: "1px solid black",
      }}
    >
      <tr>
        <td colSpan={22} className="font-bold text-center">
          Data Transaksi Rampay
        </td>
      </tr>
      <tr>
        <td colSpan={22}></td>
      </tr>
      <thead>
        <tr>
          <td className="font-bold">No</td>
          <td className="font-bold">Id Transaksi</td>
          <td className="font-bold">Kode Transaksi</td>
          <td className="font-bold">Account Number</td>
          <td className="font-bold">Customer Name</td>
          <td className="font-bold">Customer Acc Number</td>
          <td className="font-bold">Id Instansi</td>
          <td className="font-bold">Nama Instansi</td>
          <td className="font-bold">Norek Instansi</td>
          <td className="font-bold">Namarek Instansi</td>
          <td className="font-bold">Id Channel</td>
          <td className="font-bold">Tgl Inquiry</td>
          <td className="font-bold">Tgl Transaksi</td>
          <td className="font-bold">Amount</td>
          <td className="font-bold">Id Trx Bank</td>
          <td className="font-bold">Id Trx Rampay</td>
          <td className="font-bold">Deskripsi Transaksi</td>
          <td className="font-bold">Status Trx</td>
          <td className="font-bold">Status Trx Desc</td>
          <td className="font-bold">Noref</td>
          <td className="font-bold">Tgl Terima</td>
          <td className="font-bold">Tgl Kirim</td>
          <td className="font-bold">Notify Url</td>
          <td className="font-bold">Id Terminal</td>
          <td className="font-bold">Create Data</td>
          <td className="font-bold">Update Data</td>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.id}</td>
            <td>{item.kode_transaksi}</td>
            <td>{item.account_number}</td>
            <td>{item.customer_name}</td>
            <td>{item.customer_account_number}</td>
            <td>{item.instansi_id}</td>
            <td>{item.instansi_name}</td>
            <td>{item.account_number_instansi}</td>
            <td>{item.account_name_instansi}</td>
            <td>{item.id_channel}</td>
            <td>{millisToDateTime(item.tgl_inquiry)}</td>
            <td>{millisToDateTime(item.tgl_transaksi)}</td>
            <td>{item.amount}</td>
            <td>{item.id_trx_bank}</td>
            <td>{item.id_trx_rampai}</td>
            <td>{item.description}</td>
            <td>{item.tx_status}</td>
            <td>{item.tx_status_desc}</td>
            <td>{item.noref}</td>
            <td>{item.tanggal_terima}</td>
            <td>{item.tanggal_kirim}</td>
            <td>{item.notify_url}</td>
            <td>{item.id_terminal}</td>
            <td>{millisToDateTime(item.created_at)}</td>
            <td>{millisToDateTime(item.updated_at)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExportDataTransaksiTemplate;
