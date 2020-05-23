import React, { Component, useState, useContext, useEffect } from 'react';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';

import { GameContext } from './context';
import PlayerFormDialog from './PLAYER/playerFormDialog';
import PlayerCardList from './PlayerCardList';

const GamePage = () => {

    const [display, setDisplay] = useState(false);

    const {
        playerDialog,
        roomCode,
        addPlayers,
        handleAddClick,
    } = useContext(GameContext);

    const { player, open } = playerDialog;


    return (
        <div>
            <h1>You are in lobby number {roomCode}</h1>
            <span>
                <PlayerCardList />
                {open
                    ? <PlayerFormDialog />
                    : <button onClick={handleAddClick} disabled={open}>Add some players!</button>}
            </span>
        </div>
    );
}







export default GamePage;

