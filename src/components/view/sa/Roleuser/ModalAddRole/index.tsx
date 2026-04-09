import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Modal from '@/components/ui/modal'
import styles from './AddRole.module.scss'
import roleuserService from '@/services/roleuser'
import { Roleuser } from '@/type/Roleuser.type'
import { useSession } from 'next-auth/react'
import React, { Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react'

type Proptypes = {
    setToaster: Dispatch<SetStateAction<{}>>
    setModalAddRole: Dispatch<SetStateAction<boolean>>
    setRoleData: Dispatch<SetStateAction<Roleuser[]>>
    setMeta: Dispatch<SetStateAction<{ per_page: number; page: number; count_data: number; count_page: number; }>>
}
const ModalAddRole = (props: Proptypes) => {
    const { setToaster, setModalAddRole, setRoleData, setMeta } = props
    const [isLoading, setIsLoading] = useState(false)
    const session: any = useSession()

    const handleAddRole = async (e: FormEvent<HTMLFormElement>) => {
        // console.log("sampaisini")
        e.preventDefault()
        setIsLoading(true)
        const form: any = e.target as HTMLFormElement
        const data = {
            role: form.nama_role.value
        }
        // console.log(data)
        if (!data.role) {
            setIsLoading(false)
            setToaster({
                variant: 'danger',
                message: "Maaf Nama Role wajib diisi!"
            })
            return
        }
        // console.log(data)
        const result = await roleuserService.addRoleuser(data, session.data?.accessToken)
        if (result.status === 200) {
            if (result.data.status_code === 400) {
                setIsLoading(false)
                setToaster({
                    variant: 'danger',
                    message: "Ada kesalahan pada inputan Json"
                })

            } else {
                setIsLoading(false)
                setToaster({
                    variant: 'success',
                    message: 'Role User Berhasil ditambahkan!'
                })
                form.reset();
                setModalAddRole(false)

                // fetch ulang seluruh data user
                const { data } = await roleuserService.getAllRoleuser(10, 1, session.data?.accessToken)
                setRoleData(data.data)
                setMeta(data.meta)
            }
        }
        else {
            setIsLoading(false)
        }
    }
    return (
        <Modal onClose={() => setModalAddRole(false)}>
            <h1>Tambah Role User Baru</h1>
            <form onSubmit={handleAddRole}>
                <Input label='Role User' type='text' name='nama_role' placeholder='tidak boleh menggunakan spasi!' required />
                <Button className={styles.modalAdd__btnsubmit} type='submit'>{isLoading ? (<div className='box-loader'><div className='loader' /><p>Loading...</p></div>) : 'Simpan'}</Button>
            </form>

        </Modal>
    )
}

export default ModalAddRole