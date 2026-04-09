import instance from "@/lib/axios/instance";

const csrfServices = {
    getCSRF: (token: string) => instance.get('/api/csrf', {
        headers: {
            Authorization: `Bearer ${token}`,
            
        },
        withCredentials: true
    }),
}

export default csrfServices