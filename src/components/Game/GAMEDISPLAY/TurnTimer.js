import React, { useContext } from 'react';
import { MasterContext } from '../MasterContext';
import '../../../styles.css';

const TurnTimer = () => {

    const {
        isTimerRunning,
        master,
        game,
        timerName,
    } = useContext(MasterContext);

    const { minutes, seconds } = game;

    return (
        <div class='timerDiv'>
            <h2 class='timerH2'>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h2>
        </div>
    )
}

export default TurnTimer;