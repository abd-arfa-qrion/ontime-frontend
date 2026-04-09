import React from 'react'
import styles from './BagianTombol.module.scss'
import { Button } from '@mui/material'

type Proptypes = {
    handleCancel: (e: any) => void
    handleSaveDraft: (e: any) => void
    handleSubmitTransaksi: (a: any) => void
}
const BagianTombol = (prop: Proptypes) => {
    const { handleCancel, handleSaveDraft, handleSubmitTransaksi } = prop
    return (
        <div className={styles.bagiantombol}>
            <Button variant="contained" color='warning' onClick={handleCancel}>CANCEL</Button>
            <Button variant="contained" color='secondary' onClick={handleSaveDraft}>SAVE DRAFT</Button>
            <Button variant="contained" color='success' onClick={handleSubmitTransaksi}>BAYAR</Button>
        </div>
    )
}

export default BagianTombol