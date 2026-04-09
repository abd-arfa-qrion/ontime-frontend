import Modal from '@/components/ui/modal'
import roleuserService from '@/services/roleuser'
import { Roleuser } from '@/type/Roleuser.type'
import { Button } from '@mui/material'
import React, { Dispatch, SetStateAction, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
type Proptype = {
    modalDeleteRole: Roleuser | any
    setModalDeleteRole: Dispatch<SetStateAction<{}>>
    setRoleData: Dispatch<SetStateAction<Roleuser[]>>
    setToaster: Dispatch<SetStateAction<{}>>
    session: any
}
const ModalDeleteRole = (props: Proptype) => {
    const { modalDeleteRole, setModalDeleteRole, setRoleData, setToaster, session } = props
    const [isLoading, setIsLoading] = useState(false)
    const handleDeleteRole = async () => {
        setModalDeleteRole({});
        setIsLoading(true);

        //ambil id
        const Id = modalDeleteRole.id

        //rubah id ke string
        const stringId = String(Id)
        //set data Json
        const data = {
            "id": stringId
        }
        try {
            const result = await roleuserService.deleteRole(data, session.data?.accessToken);

            // console.log(result)
            if (result.status === 200) {
                setToaster({
                    variant: 'success',
                    message: result.data.data.message
                });

                setIsLoading(false);
                // fetch ulang seluruh data user
                const { data } = await roleuserService.getAllRoleuser(10, 1, session.data?.accessToken);
                setRoleData(data.data);
            } else {
                setIsLoading(false);
                setToaster({
                    variant: 'danger',
                    message: 'Delete Role gagal!'
                });
            }
        } catch (error) {
            setToaster({
                variant: 'danger',
                message: 'Delete Jasa gagal!'
            })
        }


    }
    return (
        <Modal onClose={() => setModalDeleteRole({})} >
            <h1 className="title_confirm">Apakah kamu yakin menghapus Role {modalDeleteRole.role} ?</h1>
            <Button color="error" variant="outlined" type='button' onClick={() => {
                handleDeleteRole()
            }} disabled={isLoading}>
                {isLoading ? (<div className='box-loader'><div className='loader' /><p>Updating...</p></div>) : (<><DeleteIcon /> <p>ok</p></>)}
            </Button>
        </Modal>
    )
}

export default ModalDeleteRole