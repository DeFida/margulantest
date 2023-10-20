import React from 'react';

import styles from './Header.module.css';
import { useAppContext } from '../../contexts/AppContext';
import Paragraph from '../Paragraph/Paragraph';
import Button from '../Button/Button';
import useUser from '../../contexts/UserContext/useUser';
import { authAPI } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';

const Header = () => {

    const { theme, onDark, onLight } = useAppContext();
    const { user, logout } = useUser();
    const navigate = useNavigate();

    function handleThemeSwitch() {
        if (theme === 'light') {
            onDark();
        }
        else {
            onLight();
        }
    }

    function handleLogout() {
        authAPI.logout()
        .then(() => {
            logout();
        })
    }

    return (
        <div className={`${styles.header}`}>
            <Paragraph style={{cursor: 'pointer'}} onClick={() => navigate('/')}>Game app</Paragraph>
            <span style={{display: 'flex', gap: '1rem'}}>
                <Button onClick={handleThemeSwitch}>{theme === 'dark' ? 'To light' : 'To dark'}</Button>
                {user && <Button onClick={handleLogout}>Log out</Button>}
            </span>
            
        </div>
    );
};

export default Header;