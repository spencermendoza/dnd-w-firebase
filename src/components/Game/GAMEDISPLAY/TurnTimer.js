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

    if (master) {
        return (
            <div class='timerDivMaster'>
                <button onClick={() => isTimerRunning(timerName)} class='timerButton'>{timerName}</button>
                <button onClick={() => isTimerRunning('Reset')} class='timerButton'>Reset</button>
                <h2 class='timerH2'>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h2>
            </div>
        )
    } else {
        return (
            <div class='timerDiv'>
                <h2 class='timerH2'>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h2>
            </div>
        )
    }
}

export default TurnTimer;