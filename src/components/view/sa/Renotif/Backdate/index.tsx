import SaLayout from "@/components/layout/SaLayout";
import DataTabelTrx from "@/components/ui/datatabeltrx";
import transaksiServices from "@/services/transaksi";
import { Transaksi } from "@/type/Transaksi.type";
import { Search } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { useSession } from "next-auth/react";
import React, { Dispatch, SetStateAction, useState } from "react";

type Proptypes = {
  setToaster: Dispatch<SetStateAction<{}>>;
};
const RenotifBackdateView = (prop: Proptypes) => {
  const { setToaster } = prop;
  const [data, setData] = useState<Transaksi[]>([]);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const session: any = useSession();
  const getDataKodeBill = async (kdBill: string) => {
    setLoadingFetch(true);
    try {
      const res = await transaksiServices.getTrxPassKdBill(
        kdBill,
        session.data?.accessToken
      );
      console.log(res);
      if (res.status === 200 && res.data.status_code === 200) {
        if (res.data.data.length === 0) {
          setToaster({
            variant: "warning",
            message: "data tidak ditemukan!",
          });
        } else {
          setData(res.data.data);
          setToaster({
            variant: "success",
            message: "data berhasil ditampilkan!",
          });
        }
      } else {
        setToaster({
          variant: "danger",
          message: res.data.message,
        });
      }
    } catch (error) {
      console.log(error);
      setToaster({
        variant: "danger",
        message: `Data Error! ${error}`,
      });
    } finally {
      setLoadingFetch(false);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const form = e.target as HTMLFormElement;
      const searchValue = form.value;
      if (searchValue !== "") {
        console.log(searchValue);
        getDataKodeBill(searchValue);
      }
    }
  };
  const handleSubmitKodeBill = (e: any) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const searchValue = form.kodeBill.value;
    if (searchValue !== "") {
      console.log(searchValue);
      getDataKodeBill(searchValue);
    }
  };
  return (
    <SaLayout>
      <form onSubmit={handleSubmitKodeBill} className="flex">
        <TextField
          required
          autoFocus
          id="outlined-basic"
          label="Kode Bill/ virtual Token"
          variant="outlined"
          name="kodeBill"
          placeholder="ketik Kode Bill/ virtual Token"
          onKeyDown={handleKeyDown}
        />
        <Button type="submit" className="ml-2 rounded-md bg-blue-100">
          <Search />
        </Button>
      </form>
      {data.length > 0 && (
        <DataTabelTrx
          data={data}
          setData={setData}
          setToaster={setToaster}
          session={session}
          loadingFetch={loadingFetch}
        />
      )}
    </SaLayout>
  );
};

export default RenotifBackdateView;
