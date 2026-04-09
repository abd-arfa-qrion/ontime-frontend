import Modal from '@/components/ui/modal'
import userService from '@/services/user'
import { Button } from '@mui/material'
import React, { Dispatch, SetStateAction, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import { User } from '@/type/user.type';

type Proptypes = {
    deletedUser: User | any
    setDeletedUser: Dispatch<SetStateAction<{}>>
    setUsersData: Dispatch<SetStateAction<User[]>>
    setToaster: Dispatch<SetStateAction<{}>>
    setMeta: Dispatch<SetStateAction<{ per_page: number; page: number; count_data: number; count_page: number; }>>
    session: any
}
const ModalDeleteUser = (props: Proptypes) => {
    const { deletedUser, setDeletedUser, setUsersData, setToaster, session, setMeta } = props
    const [isLoading, setIsLoading] = useState(false)
    const handleDeleteUser = async () => {
        setDeletedUser({});
        setIsLoading(true);

        //ambil id
        const Id = deletedUser.id
        //rubah id ke string
        const stringId = String(Id)
        //set data Json
        const data = {
            "id": stringId
        }

        const result = await userService.deleteUser(data, session.data?.accessToken);

        // console.log(result)
        if (result.status === 200) {
            setToaster({
                variant: 'success',
                message: result.data.data.message
            });

            setIsLoading(false);
            // fetch ulang seluruh data user
            const { data } = await userService.getAllUsers(10, 1, session.data?.accessToken);
            setUsersData(data.data);
            setMeta(data.meta);
        } else {
            setIsLoading(false);
            setToaster({
                variant: 'danger',
                message: 'Delete user gagal!'
            });
        }

    }
    return (
        <Modal onClose={() => setDeletedUser({})} >
            <h1 className="title_confirm">Apakah kamu yakin menghapus Data User {deletedUser.fullname} ?</h1>
            <Button color="error" variant="outlined" type='button' onClick={() => {
                handleDeleteUser()
            }}>
                {isLoading ? (<div className='box-loader'><div className='loader' /><p>Updating...</p></div>) : (<><DeleteIcon /> <p>ok</p></>)}
            </Button>
        </Modal>
    )
}

export default ModalDeleteUser