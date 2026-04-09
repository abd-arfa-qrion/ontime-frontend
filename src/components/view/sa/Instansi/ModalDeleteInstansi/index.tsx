import Modal from '@/components/ui/modal'
import { Button } from '@mui/material'
import React, { Dispatch, SetStateAction, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import jasaServices from '@/services/jasa';
import { Instansi } from '@/type/Instansi.type';
import instansiServices from '@/services/instansi';

type Proptypes = {
    deletedInstansi: Instansi | any
    setDeletedInstansi: Dispatch<SetStateAction<{}>>
    setInstansiData: Dispatch<SetStateAction<Instansi[]>>
    setToaster: Dispatch<SetStateAction<{}>>
    session: any
}
const ModalDeleteInstansi = (props: Proptypes) => {
    const { deletedInstansi, setDeletedInstansi, setInstansiData, setToaster, session } = props
    const [isLoading, setIsLoading] = useState(false)
    const handleDeleteInstansi = async () => {
        setDeletedInstansi({});
        setIsLoading(true);

        //ambil id
        const Id = deletedInstansi.id

        //rubah id ke string
        const stringId = String(Id)
        //set data Json
        const data = {
            "id": stringId
        }

        const result = await instansiServices.deleteInstansi(data, session.data?.accessToken);

        // console.log(result)
        if (result.status === 200) {
            setToaster({
                variant: 'success',
                message: result.data.data.message
            });

            setIsLoading(false);
            // fetch ulang seluruh data user
            const { data } = await instansiServices.getAllInstansi(session.data?.accessToken);
            setInstansiData(data.data);
        } else {
            setIsLoading(false);
            setToaster({
                variant: 'danger',
                message: 'Delete Instansi gagal!'
            });
        }

    }
    return (
        <Modal onClose={() => setDeletedInstansi({})} >
            <h1 className="title_confirm">Apakah kamu yakin menghapus Data User {deletedInstansi.name} ?</h1>
            <Button color="error" variant="outlined" type='button' onClick={() => {
                handleDeleteInstansi()
            }} disabled={isLoading}>
                {isLoading ? (<div className='box-loader'><div className='loader' /><p>Updating...</p></div>) : (<><DeleteIcon /> <p>ok</p></>)}
            </Button>
        </Modal>
    )
}

export default ModalDeleteInstansi