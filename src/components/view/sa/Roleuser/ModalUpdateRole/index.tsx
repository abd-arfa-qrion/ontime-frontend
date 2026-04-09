import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Modal from '@/components/ui/modal'
import roleuserService from '@/services/roleuser'
import { Roleuser } from '@/type/Roleuser.type'
import React, { Dispatch, FormEvent, SetStateAction, useState } from 'react'
type Proptypes = {
    modalUpdateRole: Roleuser | any
    setModalUpdateRole: Dispatch<SetStateAction<{}>>
    setRoleData: Dispatch<SetStateAction<Roleuser[]>>
    setToaster: Dispatch<SetStateAction<{}>>
    setMeta: Dispatch<SetStateAction<{ per_page: number; page: number; count_data: number; count_page: number; }>>
    session: any
}
const ModalUpdateRole = (props: Proptypes) => {

    const { modalUpdateRole, setModalUpdateRole, setRoleData, setToaster, setMeta, session } = props
    const [isLoading, setIsLoading] = useState(false)
    const handleUpdateProduk = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        const form: any = event.target as HTMLFormElement;
        const data = {
            role: form.nama_role.value
        };
        // console.log(data)
        const result = await roleuserService.updateRole(modalUpdateRole.id, data, session.data?.accessToken);
        if (result.status === 200) {
            setIsLoading(false);
            setModalUpdateRole({});
            form.reset();
            setToaster({
                variant: 'success',
                message: 'Update Role berhasil!'
            });
            // feth ulang seluruh data user
            const { data } = await roleuserService.getAllRoleuser(10, 1, session.data?.accessToken);
            setRoleData(data.data);
            setMeta(data.meta);
        } else {
            setIsLoading(false);
        }
    }
    return (
        <Modal onClose={() => setModalUpdateRole({})}>
            <h1>Edit Role = {modalUpdateRole.role}</h1>
            <form onSubmit={handleUpdateProduk}>
                <Input label='Role' type='text' name='nama_role' defaultValue={modalUpdateRole.role} required />

                <Button type='submit' disabled={isLoading}>{isLoading ? (<div className='box-loader'><div className='loader' /><p>Updating...</p></div>) : 'Update'}</Button>
            </form>

        </Modal>
    )
}

export default ModalUpdateRole