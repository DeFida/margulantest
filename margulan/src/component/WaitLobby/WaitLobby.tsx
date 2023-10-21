import React, { useEffect, useState } from 'react';
import styles from './WaitLobby.module.css';
import Loader from '../Loader/Loader';
import Paragraph from '../Paragraph/Paragraph';
import { hostAPI, userAPI } from '../../utils/constants';
import { useSocket } from '../../contexts/SocketContext/SocketContext';
import useUser from '../../contexts/UserContext/useUser';
import useHost from '../../contexts/HostContext/useHost';
import { Game } from '../../vendor/types';
import { useNavigate } from 'react-router-dom';


const WaitLobby = () => {

    const [loading, setLoading] = useState(true);
    const {create, join, host, currentHost} = useHost()
    const {user} = useUser()
    const {emitEvent, handleBackendEvent} = useSocket()
    const [started, setStarted] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        emitEvent('iamactive');
    }, [])

    useEffect(() => {
        handleBackendEvent('joinRandom', ({playerId, hostId}) => {
            if (user && user._id === playerId) {
                
                hostAPI.joinHostRandom(hostId)
                .then((res) => {
                    create(res.data)
                    emitEvent('readyToStart', res.data._id)
                })
                .catch((err) => {
                    console.log(err);
                })
            }
        })
    }, [handleBackendEvent, host]);

    useEffect(() => {
        handleBackendEvent('joinMe', ({hostId}) => {
            hostAPI.joinHost(hostId)
            .then((res) => {
                join(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
        })
    }, [handleBackendEvent, currentHost]);

    useEffect(() => {
        handleBackendEvent('runGame', (game: Game) => {
            localStorage.removeItem('startedRandom')
            
            navigate(`/games/${game._id}`) 
        })
    }, [handleBackendEvent])


    useEffect(() => {
        handleBackendEvent('startRandomGame', (hostId) => {
            if (!localStorage.getItem('startedRandom')) {
                emitEvent('runGame', {host: hostId})
                localStorage.setItem('startedRandom', 'true')
            }
            
        })
    }, [handleBackendEvent]);
    
    return <Loader />
};

export default WaitLobby;