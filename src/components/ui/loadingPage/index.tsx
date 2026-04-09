import React from 'react'
import styles from './LoadingPage.module.scss'
import 'react-loading-skeleton/dist/skeleton.css'
const LoadingPage = () => {
    return (
        <div className={styles.loadingpage}>
            <div className='mid-loader'></div>
        </div>
    )
}

export default LoadingPage