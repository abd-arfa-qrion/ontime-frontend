import React, { useEffect, useRef, useState } from 'react'
import styles from './Tooltips.module.scss';

interface TooltipProps {
    text?: string;
    position?: 'top' | 'right' | 'bottom' | 'left';
    children?: React.ReactNode
}
const Tooltips = (prop: TooltipProps) => {
    const { text, children, position = 'top' } = prop
    const [visible, setVisible] = useState(false);
    const [clsName, setClsName] = useState('styles.tooltipContainer__tooltiptop');

    const showTooltip = () => {
        if (position === 'top') {
            setClsName(`${styles.tooltipContainer__tooltiptop}`);
        } else if (position === 'right') {
            setClsName(`${styles.tooltipContainer__tooltipright}`);
        } else if (position === 'left') {
            setClsName(`${styles.tooltipContainer__tooltipleft}`);
        } else {
            setClsName(`${styles.tooltipContainer__tooltipbottom}`);
        }
        setVisible(true)
    };
    const hideTooltip = () => setVisible(false);

    return (
        <div
            className={styles.tooltipContainer}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
        >
            {children}
            {visible &&
                <div
                    className={clsName}
                >
                    {text}
                </div>
            }
        </div >
    );
}

export default Tooltips