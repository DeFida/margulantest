import React from 'react';
import styles from './Loader.module.css';
import { useAppContext } from '../../contexts/AppContext';

const Loader = () => {

    const {theme} = useAppContext()

    return (
        <div className={`${styles.loader} ${styles[`loader_${theme}`]}`}>
            <div className={`${styles.indicator}`}>
                JobEscape
            </div>
        </div>
    );
};

export default Loader;