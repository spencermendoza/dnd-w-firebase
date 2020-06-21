import React, { useContext, useState } from 'react';
import { MasterContext } from '../MasterContext';
import '../../../styles.css';

const DungeonMasterMenu = () => {
    const {
        isTimerRunning,
        master,
        game,
        timerName,
        stagedPlayer,
        masterViewStagedPlayer,
    } = useContext(MasterContext);

    const { staged, player } = stagedPlayer;
    const { minutes, seconds } = game;

    const [openMenu, setOpen] = useState(false);

    const checkForStaged = () => {
        if (staged) {
            return (
                <li onClick={masterViewStagedPlayer} class='masterMenuItem'>View staged player</li>
            )
        }
    }

    if (openMenu) {
        return (
            <div class='masterMenuOpen'>
                <ul class='masterMenu'>
                    <li onClick={() => isTimerRunning(timerName)} class='masterMenuItem'>{timerName} Timer</li>
                    <li onClick={() => isTimerRunning('Reset')} class='masterMenuItem'>Reset Timer</li>
                    {checkForStaged()}
                    <li onClick={() => setOpen(!openMenu)} class='masterMenuItem'>Close DM Menu</li>
                </ul>
            </div>
        )
    } else {
        return (
            <div class='masterMenuClose'>
                <button onClick={() => setOpen(!openMenu)} class='openMenuBtn'>Menu</button>
            </div>
        )
    }
}
export default DungeonMasterMenu;