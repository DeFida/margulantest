import React, { FC, InputHTMLAttributes, useEffect, useState } from 'react';
import styles from './Input.module.css';
import { useAppContext } from '../../contexts/AppContext';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    className?: string;
    id: string;
    value: string | number | undefined;
    change: (data: any) => void;
}

const Input: FC<InputProps> = ({ className='', value, change, id, name, ...props }) => {

    const {theme} = useAppContext()

    let componentClassName = `${styles.Input} ${styles[`Input_${theme}`]} ${className}`;

    function handleChange (e: React.ChangeEvent<HTMLInputElement>) {
        change(e.target);
    }

    return (
        <input value={value} onChange={handleChange} autoComplete='off' id={id} name={name} className={componentClassName} {...props} />
    )
};

export default Input;