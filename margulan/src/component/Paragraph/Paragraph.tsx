import React, { FC, HTMLProps, ReactNode } from 'react';
import styles from './Paragraph.module.css'
import { useAppContext } from '../../contexts/AppContext';

interface ParagraphContext extends HTMLProps<HTMLParagraphElement> {
    children?: ReactNode;
    className?: string;
}

const Paragraph:FC<ParagraphContext> = ({children, className, ...props}) => {
    const { theme } = useAppContext();
    return (
        <p className={`${styles.p} ${styles[`p_${theme}`]} ${className}`} {...props}>{ children }</p>
    );
};

export default Paragraph;
