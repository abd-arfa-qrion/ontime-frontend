import TransaksiPageView from '@/components/view/sa/Transaksi'
import { useSession } from 'next-auth/react';
import React from 'react'

const SaTransaksiPage = ({ setToaster }: any) => {
     const session: any = useSession();
    return (
        <TransaksiPageView setToaster={setToaster} session={session}/>
    )
}

export default SaTransaksiPage