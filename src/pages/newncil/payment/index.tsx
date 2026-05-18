"use client";

import PaymentPageView from "@/components/view/newncil/payment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const PaymentPage = ({ setToaster }: any) => {
  const router = useRouter();

  const [invoiceData, setInvoiceData] = useState<any>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("invoice");

    // Jika session kosong redirect
    if (!data) {
      router.push("/newncil");
      return;
    }

    // Parse data invoice
    setInvoiceData(JSON.parse(data));
  }, [router]);

  // Hindari render sebelum data siap
  if (!invoiceData) return null;

  return <PaymentPageView setToaster={setToaster} invoiceData={invoiceData} />;
};

export default PaymentPage;
