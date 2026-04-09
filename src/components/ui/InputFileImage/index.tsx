import { Dispatch, SetStateAction } from 'react'
import styles from './InputFileImage.module.scss'

type Proptypes = {
    uploadedImage: File | null,
    name: string,
    setUploadedImage: Dispatch<SetStateAction<File | null>>,
    style?: any
}
const InputFileImage = (props: Proptypes) => {
    const { uploadedImage, setUploadedImage, name, style } = props
    return (
        <div className={styles.inputfileimage}>
            <label htmlFor={name} className={styles.inputfileimage__label} style={style}>
                {uploadedImage?.name ?
                    <>
                        <p>{uploadedImage.name}</p>
                    </>
                    :
                    <>
                        <p>Upload gambar maksimal <b>size 1MB</b>. Klik di area ini untuk memilih gambar!</p>
                    </>
                }
            </label>
            <input
                onChange={(e: any) => {
                    e.preventDefault()
                    setUploadedImage(e.currentTarget.files[0])
                }}
                className={styles.inputfileimage__input}
                type="file"
                name={name}
                id={name}
                style={style} />
        </div>
    )
}

export default InputFileImage