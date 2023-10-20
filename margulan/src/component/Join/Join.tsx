import React, { useEffect, useState } from 'react';

import styles from './Join.module.css';
import { Host } from '../../contexts/HostContext/HostContext';
import Paragraph from '../Paragraph/Paragraph';
import { useAppContext } from '../../contexts/AppContext';
import Button from '../Button/Button';
import { hostAPI } from '../../utils/constants';
import { useSocket } from '../../contexts/SocketContext/SocketContext';
import useUser from '../../contexts/UserContext/useUser';
import { useNavigate } from 'react-router-dom';
import useHost from '../../contexts/HostContext/useHost';

const Join = () => {


    const [hosts, setHosts] = useState<Host[] | null>(null);
    const { user } = useUser();
    const {socket, connect, emitEvent, handleBackendEvent} = useSocket();
    const {theme} = useAppContext();
    const navigate = useNavigate();
    const {join} = useHost();

    useEffect(() => {
        hostAPI.getActiveHosts()
        .then((res) => {
            setHosts(res.data);
        })
        .catch((err) => {
            console.log(err);
        })
    }, [])

    function joinHost(host: Host) {
        if (host.players.length < host.maxUsers && user) {
            emitEvent('joinHost', {user: user._id, host: host._id});
            hostAPI.joinHost(host._id)
        }
    }

    useEffect(() => {
        handleBackendEvent('updateHosts', (hosts: Host[]) => {
            setHosts(hosts)
        })

        handleBackendEvent('joinedHost', (host: Host) => {
            join(host);
            navigate(`/hosts/${host._id}`)
        })
        
    }, [handleBackendEvent])

    return (
        <div className={`${styles.join}`}>
            <div className={`${styles.wrapper} ${styles[`wrapper_${theme}`]}`}>
                <Paragraph>Wait</Paragraph>
                <span style={{display: 'flex', gap: '1rem'}}>
                    <Button>Play with random user</Button>
                </span>
            </div>
            <div className={`${styles.hosts}`}>
                <Paragraph>Active hosts: </Paragraph>
                {hosts && Array.from(hosts).map((host, id) => {
                    return <Button key={id} onClick={() => joinHost(host)}>{`${id + 1}. ${host.name} | players: ${host.players.length}/${host.maxUsers} | wait time: ${host.waitTime}s`}</Button>
                })}
            </div>
        </div>
    );
};

export default Join;