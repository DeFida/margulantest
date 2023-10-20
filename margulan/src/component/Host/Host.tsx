import React, { useEffect, useState } from 'react';

import styles from './Host.module.css';
import Paragraph from '../Paragraph/Paragraph';
import useUser from '../../contexts/UserContext/useUser';
import { useAppContext } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import Input from '../Input/Input';
import { hostAPI } from '../../utils/constants';
import Loader from '../Loader/Loader';
import useHost from '../../contexts/HostContext/useHost';
import { User } from '../../contexts/UserContext/UserContext';
import { useSocket } from '../../contexts/SocketContext/SocketContext';
import { Host } from '../../contexts/HostContext/HostContext';
import { Game } from '../../vendor/types';


const Hostit = () => {

    const {user} = useUser();
    const { create, host, join, leave, deleteHost } = useHost();
    const {socket, connect, emitEvent, handleBackendEvent} = useSocket();
    const navigate = useNavigate();

    const {theme} = useAppContext();

    const [gameData, setgameData] = useState<{waitTime: number, maxUsers: number, points: number}>({waitTime: 15, maxUsers: 2, points: 3})
    const [loading, setLoading] = useState(false);
    const [games, setGames] = useState<Game[]>([])
    const [players, setPlayers] = useState<User[] | null>(host ? host.players : []);

    function handleCreateHost() {
        if (gameData.waitTime && gameData.maxUsers && gameData.points && user) {
            setLoading(true)
            hostAPI.createHost({...gameData, hostname: user.username})
            .then((res) => {
                create(res.data);
                join(res.data)
                setPlayers(res.data.players);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false)
            })
        }
    }

    useEffect(() => {
        if (host) {
            connect();
            
            emitEvent('activateHost', host._id);
        }
    }, [host])

    useEffect(() => {

        handleBackendEvent('joinedHost', (host: Host) => {
            setGames(host.games);
            setPlayers(host.players);
        })
        
    }, [handleBackendEvent])


    useEffect(() => {
        handleBackendEvent('playerJoined', (host: Host) => {
            create(host)
            join(host)
            setPlayers(host.players)
        })
    }, [handleBackendEvent])

    useEffect(() => {
        handleBackendEvent('playerLeft', (host: Host) => {
            create(host)
            join(host)
            setPlayers(host.players)
        })
    }, [handleBackendEvent])

    useEffect(() => {
        handleBackendEvent('runGame', (game: Game) => {
            setLoading(false)
            navigate(`/games/${game._id}`) 
        })
    }, [handleBackendEvent])
    
    
    useEffect(() => {
        if (host) {
            setPlayers(host.players)
        }
    }, [host])

    function handleHostDelete() {
        if (host) {
            hostAPI.deleteHost(host._id)
            .then(() => {
                deleteHost();
                leave();
                emitEvent('deleteHost', host._id)
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }

    function handleGameRun() {
        if (host) {
            emitEvent('runGame', {host: host._id})
            setLoading(true)
        }
        
    }

    function handleChange(data: {name: string, value: string}) {
        const {name, value} = data;
        setgameData((prev) => ({...prev, [name]: value}))
    }

    if (loading) {
        return <Loader />
    }

    return (
        <div className={`${styles.host}`}>
            {host &&

                <div className={`${styles.wrapper} ${styles[`wrapper_${theme}`]}`}>
                <Paragraph>Host name: {host.name}</Paragraph>
                <span style={{display: 'flex', gap: '1rem'}}>
                    <Button className={`${styles.button}`} onClick={handleGameRun}>Run game</Button>
                    <Button onClick={handleHostDelete}>Remove host</Button>
                </span>
                
                </div>
            }

            {!host ? 
            
                <div className={`${styles.config}`}>
                    <Paragraph style={{width: '100%', marginBottom: '1rem', fontWeight: '700', fontSize: '1.25rem', textAlign: 'center'}}>Set up and create host!</Paragraph>

                    <Paragraph>Wait time</Paragraph>
                    <Input id='waitTime' name='waitTime' placeholder='min: 15s; max: 60s' value={gameData.waitTime} change={handleChange}></Input>
                    <Paragraph>Max users</Paragraph>
                    <Input id='maxUsers' name='maxUsers' placeholder='min: 2; max: 6' value={gameData.maxUsers} change={handleChange}></Input>
                    <Paragraph>Points to win</Paragraph>
                    <Input id='points' name='points' placeholder='default: 3' value={gameData.points} change={handleChange}></Input>
                    <Button style={{width: '100%'}} className={`${styles.button}`} onClick={handleCreateHost}>Create host</Button>
                </div>
            :
                <> 
                    <div className={`${styles.players}`}>
                        <Paragraph>Players: </Paragraph>
                        {players && Array.from(players).map((player, id) => {
                            return <Paragraph style={{paddingLeft: '1rem'}} key={id}>{id + 1}. {player.username}</Paragraph>
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

                                    <div className={`${styles.points}`} key={id}>
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

export default Hostit;