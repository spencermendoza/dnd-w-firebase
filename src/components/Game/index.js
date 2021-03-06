import React, { useContext, useState } from 'react';
import { withAuthorization } from '../Session';
import '../../styles.css';

import { MasterContext } from './MasterContext';
import PlayerFormDialog from './GAMEDISPLAY/playerFormDialog';
import PlayerCardList from './GAMEDISPLAY/PlayerCardList';
import CreatureCardList from './GAMEDISPLAY/CreatureCardList';
import PlayerSortMenu from './GAMEDISPLAY/PlayerSortMenu';
import TurnTimer from './GAMEDISPLAY/TurnTimer';
import DungeonMasterMenu from './GAMEDISPLAY/DungeonMasterMenu';
import ToggleMasterSwitch from './GAMEDISPLAY/ToggleMasterSwitch';

const GamePage = () => {

    const {
        game,
        playerDialog,
        handleAddClick,
        loading,
        master,
        cardDisplay,
        toggleCreatureContainer,
    } = useContext(MasterContext);

    const { lobbyNumber } = game;
    const { open } = playerDialog;

    const [displayPlayers, setDisplayPlayers] = useState(true);

    const masterMenu = () => {
        if (master) {
            return <DungeonMasterMenu />
        }
    }

    const isTestingLobby = () => {
        if (lobbyNumber === '999') {
            return <ToggleMasterSwitch />
        }
    }

    const displaySetting = () => {
        if (cardDisplay === 'players') {
            return <PlayerCardList />
        } else if (cardDisplay === 'creatures') {
            return <CreatureCardList />
        }
    }


    return (
        <div id='gameDiv'>
            <h1 id='gameLobby'>Lobby number: {loading ? <h1>loading...</h1> : game.lobbyNumber}</h1>
            <span id='gameSpan'>

                {loading && <div>Loading...</div>}

                {isTestingLobby()}
                <div class='timerMaster'>
                    {masterMenu()}
                    <TurnTimer />
                </div>
                <div class='playerOptions'>
                    <PlayerSortMenu />
                    {open
                        ? <PlayerFormDialog />
                        : <button onClick={handleAddClick} disabled={open} id='addButton'>Add some players!</button>}
                </div>
                <div class='cardList'>
                    {displaySetting()}
                </div>
            </span>
        </div >
    );
}






const condition = authUser => !!authUser;
export default withAuthorization(condition)(GamePage);

