import React, { FC, useEffect, useRef, useState } from 'react';
import styles from './Table.module.css';
import { User } from '../../contexts/UserContext/UserContext';
import Paragraph from '../Paragraph/Paragraph';
import { useAppContext } from '../../contexts/AppContext';
import { Round, Sign } from '../../vendor/types';

interface TableContext {
  players: User[];
  timer: number;
  points: {player: any, point: number}[];
  round: Round | null;
  signs: Sign[];
}

const Table: FC<TableContext> = ({ players, timer, points, round, signs }) => {
  const {theme} = useAppContext();
  const n = players.length;
  const angleIncrement = 360 / n;
  const radius = 200;
  const playerRadius = 25;
  const [tablePoints, setTablePoints] = useState(points);
  
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    if (round) {
      
      const curTime = new Date().getTime(); // Get the current timestamp
      const timeDifference = ((curTime - (new Date(round.startTime)).getTime()) / 1000);
      const timerValue = timer - timeDifference
      const stringversion = timerValue.toString()

      setTime(parseInt(stringversion));
    }
  }, [round]);

  

  useEffect(() => {
    setTablePoints(points)
  }, [points])

  const decrementTime = () => {
    if (time > 0) {
      setTime(time - 1);
    }
  };

  // Set up the timer effect
  useEffect(() => {
    const timer = setInterval(decrementTime, 1000); // Update every second

    // Clean up the timer when the component unmounts
    return () => {
      clearInterval(timer);
    };
  }, [time]);

  
  return (
    <div className={`${styles['circle-container']} ${styles[`circle-container_${theme}`]}`}>
      {players.map((player: User, index) => {
        const angle = 90 + angleIncrement * index;
        
        
        const point = tablePoints.find((point) => point.player._id == player._id);
        
        const left = radius + radius * Math.cos((angle * Math.PI) / 180) - playerRadius;
        const top = radius + radius * Math.sin((angle * Math.PI) / 180) - playerRadius;

        const isSign = Array.from(signs).some((sign: Sign) => (sign.player._id).toString() === player._id );

        const position = {
          top: `${top}px`,
          left: `${left}px`,
        };

        return (

          <>

            <div className={`${styles.player} ${styles[`player_${theme}`]} ${signs && isSign ? styles.selectedSign : ''}`} key={index} style={position}>
              <Paragraph className={`${styles.text}`}>{player.username}</Paragraph>
              <Paragraph className={`${styles.text}`}>{point?.point}</Paragraph>
            </div>
          </>
          
        );
      })}
      <div className={`${styles.centerblock} ${styles[`centerblock_${theme}`]}`}>
        <Paragraph>0:{time}</Paragraph>
      </div>
    </div>
  );
};

export default Table;
