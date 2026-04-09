import React from 'react'
import styles from './Button.module.scss';
import Tooltips from '../tooltips';

type propstype = {
    type: "button" | "submit" | "reset" | undefined
    // label: string
    onClick?: () => void
    children?: React.ReactNode
    variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark" | "tri"
    className?: string
    tooltipText?: string
    icon?: string
    disabled?: boolean

};
const Button = (props: propstype) => {
    const { type, onClick, children, variant = "primary", className, icon, tooltipText, disabled } = props
    return (
        <>
            {tooltipText ? (
                <Tooltips text={tooltipText}>
                    <button
                        type={type}
                        onClick={onClick}
                        className={`${className} ${styles[variant]} ${styles.button}`}
                        disabled={props.disabled}
                    >
                        {icon && <i className={`bx ${icon} ${styles.button__icon}`}></i>}
                        {children}
                    </button>
                </Tooltips>
            ) : (
                <button
                    type={type}
                    onClick={onClick}
                    className={`${className} ${styles[variant]} ${styles.button}`}
                    disabled={props.disabled}
                >
                    {icon && <i className={`bx ${icon} ${styles.button__icon}`}></i>}
                    {children}
                </button>
            )
            }
        </>
    )
}

export default Button