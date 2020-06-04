import React, { useContext } from 'react';
import { GameContext } from './context';

const TurnTimer = () => {

    const {
        timerState,
        isTimerRunning,
    } = useContext(GameContext);

    const { bName, minutes, seconds } = timerState;

    return (
        <div>
            <button onClick={() => isTimerRunning(bName)}>{bName}</button>
            <h2>Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h2>
        </div>
    )
}

export default TurnTimer;