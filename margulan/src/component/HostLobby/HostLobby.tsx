import React, { useEffect, useState } from 'react';
import styles from './HostLobby.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { Host } from '../../contexts/HostContext/HostContext';
import { hostAPI } from '../../utils/constants';
import Paragraph from '../Paragraph/Paragraph';
import useUser from '../../contexts/UserContext/useUser';
import { useAppContext } from '../../contexts/AppContext';
import Button from '../Button/Button';
import { useSocket } from '../../contexts/SocketContext/SocketContext';
import useHost from '../../contexts/HostContext/useHost';
import { Game } from '../../vendor/types';
import { User } from '../../contexts/UserContext/UserContext';

const HostLobby = () => {

    const {hostId} = useParams();

    const [host, setHost] = useState<Host | null>(null);
    const { join, leave } = useHost();
    const {emitEvent, handleBackendEvent} = useSocket()
    const { theme } = useAppContext()
    const {user} = useUser();
    const [games, setGames] = useState<Game[]>([])
    const [players, setPlayers] = useState<User[] | null>()
    const navigate = useNavigate()

    useEffect(() => {
        if (hostId) {
            hostAPI.getHost(hostId)
            .then((res) => {
                const host: Host = res.data;
                
                if (user && Array.from(host.players).some((player) => player._id === user._id)) {
                    setHost(res.data);
                    setPlayers(res.data.players)
                }
                else {
                    navigate('/')  
                }
                
            })
            .catch((err) => {
                console.log(err);
                
            })
        }
        
    }, [hostId])
    


    useEffect(() => {
        if (host && user) {
            if (Array.from(host.players).some((player) => player._id === user._id)) {
                emitEvent('joinHost', {user: user._id, host: host._id});
            }
        }
    }, [host])

    function leaveHost() {
        if (host && user) {
            emitEvent('leaveHost', {userId: user._id, hostId: host._id})
        }
    }

    useEffect(() => {
        handleBackendEvent('leftHost', () => {
            navigate('/');
            leave()
        })
    }, [handleBackendEvent])

    useEffect(() => {
        handleBackendEvent('hostDeleted', () => {
            navigate('/');
            leave()
        })
    }, [handleBackendEvent]);

    useEffect(() => {
        handleBackendEvent('playerJoined', (host: Host) => {
            setPlayers(host.players)
            join(host)
        })
    }, [handleBackendEvent])

    handleBackendEvent('joinedHost', (host: Host) => {
        join(host);
        setGames(host.games);
        setPlayers(host.players)
    })
    

    useEffect(() => {
        handleBackendEvent('runGame', (game: Game) => {
            navigate(`/games/${game._id}`) 
        })
    }, [handleBackendEvent])


    return (
        <div className={`${styles.hostLobby}`}>
            {
                host && 
                
                <>
                    <div className={`${styles.wrapper} ${styles[`wrapper_${theme}`]}`}>
                        <Paragraph>Host name: {host.name}</Paragraph>
                        <span style={{display: 'flex', gap: '1rem'}}>
                            <Button onClick={leaveHost}>Leave host</Button>
                        </span>
                        
                    </div>
                    <div className={`${styles.players}`}>
                        <Paragraph>Players: </Paragraph>
                        {players && Array.from(players).map((player, id) => {
                            return <Paragraph key={id}>{id + 1}. {player.username}</Paragraph>
                        })}
                    </div>
                    {
                        games && games.length > 0 && 
                        <div className={`${styles.games}`}>
                            <Paragraph>Games: </Paragraph>
                            {Array.from(games).map((game, id) => {
                                return <div key={id} className={`${styles.game}`}>
                                    <div className={`${styles.info} ${styles[`info_${theme}`]}`}>
                                        <Paragraph>{id + 1} Game on host: {host.name}</Paragraph>
                                        <Paragraph>Round wait time: {host.waitTime}s</Paragraph>
                                        <Paragraph>Players: {game.players.length}</Paragraph>
                                    </div>

                                    <div className={`${styles.points}`}>
                                        <Paragraph>Points: </Paragraph>
                                        {Array.from(game.points).map((thepoint: {player: any, point: number}, id) => {
                                            return <Paragraph style={{paddingLeft: '1rem'}}>{thepoint.player.username}: {thepoint.point}</Paragraph>
                                        })}
                                    </div>
                                </div>
                            })}
                        </div>
                    }
                </>

            }


            
        </div>
    );
};

export default HostLobby;