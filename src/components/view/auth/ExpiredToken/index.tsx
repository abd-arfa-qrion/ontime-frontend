import React, { useEffect } from 'react'
import styles from "./ExpiredToken.module.scss";
import Button from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
const ExpiredtokenView = () => {
    const router = useRouter()
    const handleLogin = async () => {
        await signOut()
        window.location.replace('/auth/login')
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            handleLogin(); // Panggil fungsi untuk mengeksekusi tombol secara otomatis setelah 2 detik
        }, 1500); // Tunggu 1 detik sebelum mengeksekusi tombol secara otomatis

        // Membersihkan timer jika komponen dibongkar sebelum waktu yang ditentukan
        return () => clearTimeout(timer);
    }, []);
    return (
        <div className={styles.exp}>
            <p className={styles.exp__text}>Token anda telah kadaluarsa silahkan login kembali</p>
            <Button type='button' variant='tri' className={styles.exp__expiredbtn} onClick={handleLogin}>Login</Button>
        </div>
    )
}

export default ExpiredtokenView