import React, { useContext } from 'react';
import { withAuthorization } from '../Session';
import '../../styles.css';

import { MasterContext } from './MasterContext';
import PlayerFormDialog from './GAMEDISPLAY/playerFormDialog';
import PlayerCardList from './GAMEDISPLAY/PlayerCardList';
import PlayerSortMenu from './GAMEDISPLAY/PlayerSortMenu';
import TurnTimer from './GAMEDISPLAY/TurnTimer';
import DungeonMasterMenu from './GAMEDISPLAY/DungeonMasterMenu';

const GamePage = () => {

    const {
        game,
        playerDialog,
        handleAddClick,
        loading,
        master,
    } = useContext(MasterContext);

    const { open } = playerDialog;

    const masterMenu = () => {
        if (master) {
            return <DungeonMasterMenu />
        }
    }


    return (
        <div id='gameDiv'>
            <h1 id='gameLobby'>Lobby number: {loading ? <h1>loading...</h1> : game.lobbyNumber}</h1>
            <span id='gameSpan'>

                {loading && <div>Loading...</div>}

                <TurnTimer />
                {masterMenu()}
                <PlayerSortMenu />
                <PlayerCardList />
                {open
                    ? <PlayerFormDialog />
                    : <button onClick={handleAddClick} disabled={open} id='editButton'>Add some players!</button>}
            </span>
        </div>
    );
}






const condition = authUser => !!authUser;
export default withAuthorization(condition)(GamePage);

