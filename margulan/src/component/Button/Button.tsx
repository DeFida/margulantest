import React, { ButtonHTMLAttributes, FC } from 'react';
import styles from './Button.module.css';
import { useAppContext } from '../../contexts/AppContext';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: string;
    className?: string;
    type?: "submit" | "reset" | "button" | undefined;
}


const Button: FC<ButtonProps> = ({ children, className='', type='button', ...props }) => {

    const { theme } = useAppContext();

    let componentClassName = `${styles.Button} ${styles[`button_${theme}`]} ${className}`;
    
    return (
        <button className={componentClassName} type={type} {...props}>{children}</button>
    );
};

export default Button;