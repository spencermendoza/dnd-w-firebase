import React, { useContext } from 'react';
import { withAuthorization } from '../Session';

import { GameContext } from './context';
import PlayerFormDialog from './PLAYER/playerFormDialog';
import PlayerCardList from './PlayerCardList';
import PlayerSortMenu from './PLAYER/PlayerSortMenu';

const GamePage = () => {

    const {
        game,
        playerDialog,
        handleAddClick,
        loading,
    } = useContext(GameContext);

    const { open } = playerDialog;


    return (
        <div>
            <h1>You are in lobby number: {loading ? <h1>loading...</h1> : game.lobbyNumber}</h1>
            <span>

                {loading && <div>Loading...</div>}

                <PlayerSortMenu />
                <PlayerCardList />
                {open
                    ? <PlayerFormDialog />
                    : <button onClick={handleAddClick} disabled={open}>Add some players!</button>}
            </span>
        </div>
    );
}






const condition = authUser => !!authUser;
export default withAuthorization(condition)(GamePage);

