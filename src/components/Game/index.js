import React, { useContext } from 'react';

import { GameContext } from './context';
import PlayerFormDialog from './PLAYER/playerFormDialog';
import PlayerCardList from './PlayerCardList';

const GamePage = () => {

    const {
        playerDialog,
        roomCode,
        handleAddClick,
        loading,
    } = useContext(GameContext);

    const { open } = playerDialog;


    return (
        <div>
            <h1>You are in lobby number {roomCode}</h1>
            <span>

                {loading && <div>Loading...</div>}

                <PlayerCardList />
                {open
                    ? <PlayerFormDialog />
                    : <button onClick={handleAddClick} disabled={open}>Add some players!</button>}
            </span>
        </div>
    );
}







export default GamePage;

