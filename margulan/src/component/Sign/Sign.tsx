import React, { FC, FormEvent, useState } from 'react';

import styles from './Sign.module.css';
import Input from '../Input/Input';
import Button from '../Button/Button';
import Paragraph from '../Paragraph/Paragraph';
import { authAPI } from '../../utils/constants';
import useUser from '../../contexts/UserContext/useUser';
import Loader from '../Loader/Loader';

interface SigninContext {
    toSignup: () => void;
}

const Sign: FC<SigninContext> = ({toSignup}) => {

    const [data, setData] = useState<{username: string, password: string}>({username: '', password: ''})

    const {login} = useUser();
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    function handleSignin(e: FormEvent) {
        e.preventDefault();
        if (data.username && data.password) {

            setLoading(true)
            
            authAPI.login(data.username, data.password)
            .then((res) => {
                login(res.data)
            })
            .catch((err) => {
                setError(err.response.data.message)
            })
            .finally(() => {
                setLoading(false)
            })
        }
    }

    function handleChange(data: {name: string, value: string}) {
        const {name, value} = data;
        setData((prev) => ({...prev, [name]: value}))
    }

    if (loading) {
        return <Loader />
    }

    return (
        <form className={`${styles.sign}`}>
            <div className={`${styles.container}`}>
                <Paragraph>Sign in</Paragraph>
                <Input id='username' name='username' placeholder='username' value={data.username} change={handleChange} />
                <Input id='password' name='password' type='password' placeholder='password' value={data.password} change={handleChange} />
                <Button onClick={handleSignin}>Submit</Button>
                {error && <Paragraph style={{fontSize: '12px', color: 'red'}}>{error}</Paragraph>}
                <Paragraph style={{fontSize: '12px'}}>Does not have an account? <span style={{color: 'red', cursor: 'pointer'}} onClick={toSignup}>Sign up</span></Paragraph>
            </div>
            
        </form>
    );
};

export default Sign;