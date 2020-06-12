import React, { useContext } from 'react';
import { withAuthorization } from '../Session';
import '../../styles.css';

import { MasterContext } from './MasterContext';
import PlayerFormDialog from './GAMEDISPLAY/playerFormDialog';
import PlayerCardList from './GAMEDISPLAY/PlayerCardList';
import PlayerSortMenu from './GAMEDISPLAY/PlayerSortMenu';
import TurnTimer from './GAMEDISPLAY/TurnTimer';

const GamePage = () => {

    const {
        game,
        playerDialog,
        handleAddClick,
        loading,
    } = useContext(MasterContext);

    const { open } = playerDialog;


    return (
        <div id='gameDiv'>
            <h1 id='gameLobby'>You are in lobby number: {loading ? <h1>loading...</h1> : game.lobbyNumber}</h1>
            <span id='gameSpan'>

                {loading && <div>Loading...</div>}

                <TurnTimer />
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

