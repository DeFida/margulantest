import React, { useEffect, useState } from 'react';
import styles from './Game.module.css';
import useHost from '../../contexts/HostContext/useHost';
import { useNavigate, useParams } from 'react-router-dom';
import useUser from '../../contexts/UserContext/useUser';
import { useSocket } from '../../contexts/SocketContext/SocketContext';
import Paragraph from '../Paragraph/Paragraph';
import Table from '../Table/Table';
import { Game, Round, Sign } from '../../vendor/types';
import Loader from '../Loader/Loader';
import { gameAPI } from '../../utils/constants';
import { User } from '../../contexts/UserContext/UserContext';
import Button from '../Button/Button';

const GameComponent = () => {

    const {currentHost, host, leave, deleteHost} = useHost();
    const {gameId} = useParams();
    const {user} = useUser();
    const navigate = useNavigate();
    const {socket, emitEvent, handleBackendEvent} = useSocket();
    const [game, setGame] = useState<Game | null>(null)
    const [loading, setLoading] = useState(true)
    const [players, setPlayers] = useState<User[] | null>(null);
    const [points, setPoints] = useState<{player: any, point: number}[]>([]);
    const [time, setTime] = useState(10);
    const [round, setRound] = useState<Round | null>(null)
    const [roundStarted, setRoundStarted] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [signs, setSigns] = useState<Sign[]>([]);
    const [showSigns, setShowSigns] = useState(false)

    const [canSelect, setCanSelect] = useState(true);

    const [selectedSign, setSelectedSign] = useState<Sign | null>(null);

    const [popup, setPopup] = useState<string | boolean | {player: User, point: number}[]>(false)

    useEffect(() => {
        if (gameId) {
            gameAPI.getGame(gameId)
            .then((res) => {
                setGame(res.data)
                setPlayers(res.data.players)
                setPoints(res.data.points)
                if ((res.data.rounds).length > 0 && currentHost) {
                    emitEvent('joinHostRoom', {hostId: currentHost._id})
                    setRound(res.data.rounds[(res.data.rounds).length - 1])
                    setTime((res.data.rounds[(res.data.rounds).length - 1]).timer);
                    setSigns((res.data.rounds[(res.data.rounds).length - 1]).signs);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }, [gameId, currentHost])

    useEffect(() => {
        if (gameId && (currentHost || host)) {
            gameAPI.joinGame(gameId)
            .then(() => {
                emitEvent('joinGame', {gameId, hostId: currentHost ? currentHost._id : host ? host._id : ''})
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }, [gameId])

    useEffect(() => {
        handleBackendEvent('playerJoinedGame', (game: Game) => {  
            if (user) {
                const gamePlayers: User[] = [];
                gamePlayers.push(user);
                for (let player of game.players) {
                    if (user._id !== player._id) {
                        gamePlayers.push(player)
                    }
                }
                setPlayers(gamePlayers)
                setPoints(game.points);
            }
        })
    }, [handleBackendEvent])

    useEffect(() => {
        if (players && host) {
            if (!roundStarted && !gameStarted) {
                if (players.length === (host.players).length)
                {
                    console.log("STARTING IT");
                    
                    emitEvent('startRound', {gameId, hostId: host._id})
                    setGameStarted(true)
                    setRoundStarted(true);
                }
            }
        }
    }, [players, gameStarted, roundStarted, host])


    useEffect(() => {
        if (players && host) {
            if (!roundStarted) {
                if (players.length === (host.players).length)
                {
                    console.log("NEW ROUND AFTER DRAW");
                    
                    emitEvent('startRound', {gameId, hostId: host._id})
                    setGameStarted(true)
                    setRoundStarted(true);
                }
            }
        }
    }, [roundStarted])


    useEffect(() => {
        
        if (currentHost) {
            setTime(currentHost.waitTime)
        }
    }, [currentHost])

    useEffect(() => {
        handleBackendEvent('roundStarted', (round: Round) => {
            console.log('ROUND WAS STARTED');
            setRound(round)
            setShowSigns(false)
            setSigns([])
            setTime(round.timer)
        })
    }, [handleBackendEvent])

    useEffect(() => {
        handleBackendEvent('timerComplete', (game: Game) => {

            if (user) {
                const gamePlayers: User[] = [];
                gamePlayers.push(user);
                for (let player of game.players) {
                    if (user._id !== player._id) {
                        gamePlayers.push(player)
                    }
                }
                setPlayers(gamePlayers)
            }
            setShowSigns(true)
            setRound(null);
            setCanSelect(true);
            setSelectedSign(null)
        })
    }, [handleBackendEvent])
    
    useEffect(() => {
        handleBackendEvent('ILeftTheGame', () => {
            leave();
            deleteHost();
            navigate('/');
        })
    }, [handleBackendEvent])

    useEffect(() => {
        handleBackendEvent('signSelected', (sign: Sign) => {
            setSigns((prev) => ([...prev, sign]))
        })
    }, [handleBackendEvent])

    useEffect(() => {
        handleBackendEvent('mySelectedSign', (sign: Sign) => {
            setSelectedSign(sign);
            setCanSelect(false)
        })
    }, [handleBackendEvent])

    useEffect(() => {
        handleBackendEvent('draw', () => {

            setPopup('Draw')
            setTimeout(() => {
                setPopup(false)
                setRoundStarted(false);
            }, 2000)
            
        })
    }, [handleBackendEvent])

    useEffect(() => {
        handleBackendEvent('stopgame', () => {
            setPopup('Game was end')
            setTimeout(() => {
                if (host || currentHost) {
                    setPopup(false)
                    window.location.href = host ? '/host' : `/hosts/${currentHost?._id}`
                }
            }, 2000)
            
        })
    }, [handleBackendEvent, host, currentHost])

    useEffect(() => {
        handleBackendEvent('winResults', (results) => {
            setPopup(results)
            setPoints(results)
            setTimeout(() => {
                setPopup(false);
                window.location.href = host ? '/host' : `/hosts/${currentHost?._id}`
            }, 2000)
        })
    }, [handleBackendEvent])

    useEffect(() => {
        handleBackendEvent('results', (results) => {
            setPopup(results)
            setPoints(results)
            setTimeout(() => {
                setPopup(false);
                
                setRoundStarted(false);
            }, 2000)
        })
    }, [handleBackendEvent])
    

    function leaveTheGame() {
        if (user && currentHost && gameId) {
            gameAPI.leaveGame({userId: user._id, hostId: currentHost._id, gameId})
            .then((res) => {
                console.log(res);
                
                emitEvent('leaveTheGame', {hostId: currentHost._id, gameId})
            })
            .catch((err) => {
                console.log(err);
            })
            
        }
    }

    function selectSign(sign: string) {
        if (user && (host || currentHost) && canSelect && round){ 
            emitEvent('selectSign', {hostId: host ? host._id : currentHost ? currentHost._id : '', sign, roundId: round._id})
        }   
    }



    if (loading) {
        return <Loader />
    }

    return (
        <>
        {
            game && players && players.length > 0 &&
            <div className={`${styles.game}`}>
                <div className={`${styles.gameHeader}`}>
                    <Button onClick={leaveTheGame}>Leave the game</Button>
                    {host && <Button onClick={() => navigate('/host')}>Back to host</Button>}
                </div>
                
                <Table players={players} points={points} showSigns={showSigns} timer={time} round={round} signs={signs} />
                <div className={`${styles.controllers}`}>
                    <Button className={`${styles.controller} ${!canSelect ? styles.cantselect : ''} ${selectedSign?.sign === '&#9994;' ? styles.selected : ''}`} onClick={() => selectSign('&#9994;')} >&#9994;</Button>
                    <Button className={`${styles.controller} ${!canSelect ? styles.cantselect : ''} ${selectedSign?.sign === '&#9996;' ? styles.selected : ''}`} onClick={() => selectSign('&#9996;')}>&#9996;</Button>
                    <Button className={`${styles.controller} ${!canSelect ? styles.cantselect : ''} ${selectedSign?.sign === '&#128400;' ? styles.selected : ''}`} onClick={() => selectSign('&#128400;')}>&#128400;</Button>
                </div>
            </div>
        }
            {popup && 
                <div className={`${styles.popup}`}>
                    <div className={`${styles.container}`}>
                        {popup === 'Draw' || popup === 'Game was end' ?
                            <div className={`${styles.info}`}>
                                <Paragraph style={{color: '#1C2D37'}}>{popup}</Paragraph>
                            </div>
                            :

                            <div className={`${styles.info}`}>
                                <Paragraph style={{color: '#1C2D37', marginBottom: '.5rem', paddingBottom: '.5rem', borderBottom: '1px solid #1C2D37', width: '100%'}}>Results: </Paragraph>
                                {Array.from(points).map((point, id) => {
                                    return <Paragraph style={{color: '#1C2D37'}}>{id + 1}. {point.player.username}'s points: {point.point}</Paragraph>
                                })}

                                {Array.from(points).find((point) => point.point === host?.points) && <Paragraph  style={{color: '#1C2D37', width: '100%', textAlign: 'center'}}>{Array.from(points).find((point) => point.point === host?.points)?.player.username} wins!</Paragraph>}
                            </div>
                        }
                    </div>
                </div>
            }
        </>
    );
    
};

export default GameComponent;