import React, { useContext, useState } from 'react';
import { MasterContext } from '../MasterContext';
import '../../../styles.css';

const DungeonMasterMenu = () => {
    const {
        isTimerRunning,
        nextHighestInit,
        master,
        game,
        timerName,
        stagedPlayer,
        masterViewStagedPlayer,
        checkCreatureContainer,
        toggleCreatureContainer,
        handleCreateCreatureContainer,
        cardDisplay,
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

    const checkContainer = () => {
        checkCreatureContainer().then(result => {
            if (result === false) {
                var makeContainer = window.confirm('There are no creatures in your container! Would you like to create one?')
                if (makeContainer) {
                    handleCreateCreatureContainer();
                }
            } else if (result === true) {
                toggleCreatureContainer();
            }
        })
    }

    const toggleContainer = () => {
        if (cardDisplay === 'players') {
            return (
                <li onClick={() => checkContainer()} class='masterMenuItem'>Open Creature Container</li>
            )
        } else if (cardDisplay === 'creatures') {
            return (
                <li onClick={() => toggleCreatureContainer()} class='masterMenuItem'>Close Creature Container</li>
            )
        }
    }

    if (openMenu) {
        return (
            <div class='masterMenuOpen' onClick={() => setOpen(false)}>
                <ul class='masterMenu'>
                    <li onClick={() => isTimerRunning(timerName)} class='masterMenuItem'>{timerName} Timer</li>
                    <li onClick={() => nextHighestInit()} class='masterMenuItem'>Skip this player</li>
                    <li onClick={() => isTimerRunning('Reset')} class='masterMenuItem'>Reset Combat</li>
                    {toggleContainer()}
                    {checkForStaged()}
                    <li onClick={() => setOpen(!openMenu)} class='masterMenuItem'>Close DM Menu</li>
                </ul>
            </div >
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