import RoleuserPageView from '@/components/view/sa/Roleuser'
import roleuserService from '@/services/roleuser'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

const SaRolePage = ({ setToaster }: any) => {
    const [meta, setMeta] = useState({
        per_page: 10,
        page: 1,
        count_data: 0,
        count_page: 0
    })
    const [roles, setRoles] = useState([])
    const session: any = useSession()
    const searchParam = useSearchParams();
    const searchValue = searchParam.get('query')

    const getAllRoleuser = useCallback(async () => {
        if (searchValue !== null) {
            try {
                const { data } = await roleuserService.getSearchRole(searchValue, meta.per_page, meta.page, session.data?.accessToken)
                // console.log(data)
                if (data.status_code !== 200) {
                    setToaster({
                        variant: 'danger',
                        message: 'Data Role Users gagal!'
                    })
                } else {
                    setToaster({
                        variant: 'success',
                        message: 'Data Role Users berhasil!'
                    })
                }
                setRoles(data.data)
                setMeta(data.meta)
            } catch (error) {
                setToaster({
                    variant: 'danger',
                    message: 'Fetching data Role Users gagal!'
                })
            }
        }
        else {
            try {
                const { data } = await roleuserService.getAllRoleuser(meta.per_page, meta.page, session.data?.accessToken)
                if (data.status_code !== 200) {
                    setToaster({
                        variant: 'danger',
                        message: 'Data Role Users gagal!'
                    })
                } else {
                    setToaster({
                        variant: 'success',
                        message: 'Data Role Users berhasil!'
                    })
                }
                setRoles(data.data)
                setMeta(data.meta)
            } catch (error) {
                setToaster({
                    variant: 'danger',
                    message: 'Fetching data Role Users gagal!'
                })
            }
        }

    }, [session.data?.accessToken, setToaster, setRoles, meta.per_page, meta.page, searchValue])

    useEffect(() => {
        if (session.status === 'authenticated') {
            getAllRoleuser()
        }
    }, [getAllRoleuser, session.status, meta.page, meta.per_page])

    return (
        <RoleuserPageView roles={roles} setToaster={setToaster} meta={meta} setMeta={setMeta} />
    )
}

export default SaRolePage