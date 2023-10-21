import React, { useEffect, useRef, useState } from 'react';

import styles from './Profile.module.css';

import useUser from '../../contexts/UserContext/useUser';
import Paragraph from '../Paragraph/Paragraph';
import { useAppContext } from '../../contexts/AppContext';
import Button from '../Button/Button';

import { useNavigate } from 'react-router-dom';
import useHost from '../../contexts/HostContext/useHost';


const Profile = () => {

    const {user} = useUser();
    const {theme} = useAppContext();
    const navigate = useNavigate();
    const [start, setStart] = useState(false);
    const {currentHost} = useHost();

    const modalRef = useRef<HTMLDivElement | null>(null);

    function handleClick(event: React.MouseEvent<HTMLDivElement>) {
        if (event.target === modalRef.current) {
            setStart(false)
        }
    }

    useEffect(() => {
        if (user) {
            console.log(user);
        }
    }, [user])

    function handleStart() {
        if (currentHost) {
            navigate(`/hosts/${currentHost._id}`)
        }
        else {
            setStart(!start)
        }
    }

    return (
        <>
            <div className={`${styles.profile}`}>
                <div className={`${styles.wrapper} ${styles[`wrapper_${theme}`]}`}>
                    <Paragraph>User: {user?.username}</Paragraph>
                    <Button className={`${styles.button}`} onClick={handleStart}>Start game</Button>
                </div>
            </div>

            {
                start && 
                <div className={`${styles.popup}`} onClick={handleClick} ref={modalRef}>
                    <div className={`${styles.container} ${styles[`container_${theme}`]}`}>
                        <div className={`${styles.header}`}>
                            <Paragraph>Start new game</Paragraph>
                            <Paragraph onClick={() => setStart(false)} style={{cursor: 'pointer'}}>Close</Paragraph>
                        </div>
                        <Button onClick={() => navigate('/host')} className={`${styles.button}`}>Host game</Button>
                        <Button onClick={() => navigate('/join')} className={`${styles.button}`}>Join game</Button>
                        <Button onClick={() => navigate('/wait')} className={`${styles.button}`}>Play with random user</Button>
                    </div>
                </div>
            }

            {
                        user && user.games && user.games.length > 0 && 
                        <div className={`${styles.games}`}>
                            <Paragraph>My played games: </Paragraph>
                            {Array.from(user.games).map((game, id) => {
                                return <div key={id} className={`${styles.game}`}>
                                    <div className={`${styles.info} ${styles[`info_${theme}`]}`}>
                                        <Paragraph>{id + 1}. Players: {game.players.length}</Paragraph>
                                    </div>

                                    <div className={`${styles.points}`} key={id}>
                                        <Paragraph >Points: </Paragraph>
                                        {Array.from(game.points).map((thepoint: {player: any, point: number}, id) => {
                                            return <Paragraph style={{paddingLeft: '1rem'}}>{thepoint.player.username}: {thepoint.point}</Paragraph>
                                        })}
                                    </div>
                                </div>
                            })}
                        </div>
                    }
            
        </>
    );
};

export default Profile;