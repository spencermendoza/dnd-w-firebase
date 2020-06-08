import React, { useContext } from 'react';
import { GameContext } from './context';
import '../../styles.css';

const TurnTimer = () => {

    const {
        timerState,
        isTimerRunning,
    } = useContext(GameContext);

    const { bName, minutes, seconds } = timerState;

    return (
        <div class='timerDiv'>
            <button onClick={() => isTimerRunning(bName)} class='timerButton'>{bName}</button>
            <h2 class='timerH2'>Time remaining this turn: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h2>
        </div>
    )
}

export default TurnTimer;