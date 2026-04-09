import UserPageView from "@/components/view/sa/Users"
import userService from "@/services/user"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const SaUserPage = ({ setToaster }: any) => {
    const [meta, setMeta] = useState({
        per_page: 10,
        page: 1,
        count_data: 0,
        count_page: 0
    })
    const [users, setUsers] = useState([])
    const session: any = useSession()
    const searchParam = useSearchParams();
    const searchValue = searchParam.get('query')

    const getAllUsers = useCallback(async () => {
        if (searchValue !== null) {
            try {
                const { data } = await userService.getSearchUser(searchValue, meta.per_page, meta.page, session.data?.accessToken)
                if (data.status_code !== 200) {
                    setToaster({
                        variant: 'danger',
                        message: 'Data Users gagal!'
                    })
                } else {
                    setToaster({
                        variant: 'success',
                        message: 'Data Users berhasil!'
                    })
                }
                setUsers(data.data)
                setMeta(data.meta)
            } catch (error) {
                setToaster({
                    variant: 'danger',
                    message: 'Data Users gagal!'
                })
            }
        } else {
            try {
                const { data } = await userService.getAllUsers(meta.per_page, meta.page, session.data?.accessToken)

                if (data.status_code !== 200) {
                    setToaster({
                        variant: 'danger',
                        message: 'Data Users gagal!'
                    })
                } else {
                    setToaster({
                        variant: 'success',
                        message: 'Data Users berhasil!'
                    })
                }
                setUsers(data.data)
                setMeta(data.meta)
            } catch (error) {
                setToaster({
                    variant: 'danger',
                    message: 'Data Users gagal!'
                })
            }
        }

    }, [session.data?.accessToken, setToaster, setUsers, meta.page, meta.per_page, searchValue])

    useEffect(() => {
        if (session.status === 'authenticated') {
            getAllUsers()
        }
    }, [getAllUsers, session.status, meta.page, meta.per_page])

    return (
        <UserPageView
            users={users}
            setToaster={setToaster}
            meta={meta}
            setMeta={setMeta}
        />
    )
}

export default SaUserPage