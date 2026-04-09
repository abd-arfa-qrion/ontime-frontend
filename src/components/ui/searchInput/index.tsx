import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import React, { useState } from 'react'
import styles from './SearchInput.module.scss';

const SearchInput = () => {
    const searchParam = useSearchParams()
    const { replace } = useRouter()
    const pathname = usePathname()
    const handleSearch = (value: string) => {
        const params = new URLSearchParams(searchParam)
        if (value) {
            params.set("query", value)
        } else {
            params.delete("query")
        }
        const newURL = `${pathname}?${params.toString()}`
        replace(newURL)
        window.location.href = newURL;
    }
    return (
        <input className={styles.input}
            placeholder='Search... lalu tekan ENTER'
            onKeyDown={(e) => e.key === "Enter" && handleSearch(e.currentTarget.value)}
            defaultValue={searchParam.get("query")?.toString()}
            autoFocus
        />
    )
}

export default SearchInput