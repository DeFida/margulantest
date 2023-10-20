import React, { FC, FormEvent, useState } from 'react';

import styles from './Sign.module.css';
import Input from '../Input/Input';
import Button from '../Button/Button';
import Paragraph from '../Paragraph/Paragraph';
import { authAPI, userAPI } from '../../utils/constants';
import useUser from '../../contexts/UserContext/useUser';
import Loader from '../Loader/Loader';

interface SignupContext {
    toSignin: () => void;
}

const Signup: FC<SignupContext> = ({toSignin}) => {

    const [data, setData] = useState<{username: string, password: string}>({username: '', password: ''})
    const {login} = useUser()
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    function handleSignup(e: FormEvent) {
        e.preventDefault();
        console.log(data, data.username && data.password);
        if (data.username && data.password) {
            authAPI.register(data.username, data.password)
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
                <Paragraph>Sign up</Paragraph>
                <Input id='username' name='username' placeholder='username' value={data.username} change={handleChange} />
                <Input id='password' type='password' name='password' placeholder='password' value={data.password} change={handleChange} />
                <Button onClick={handleSignup}>Submit</Button>
                {error && <Paragraph style={{fontSize: '12px', color: 'red'}}>{error}</Paragraph>}
                <Paragraph style={{fontSize: '12px'}}>You have an account? <span style={{color: 'red', cursor: 'pointer'}} onClick={toSignin}>Sign in</span></Paragraph>
            </div>
            
        </form>
    );
};

export default Signup;