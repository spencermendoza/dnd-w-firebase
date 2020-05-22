import React, { Component, useState, useContext } from 'react';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';

import { GameContext } from './context';

const GamePage = () => {

    const {
        roomCode,
        addPlayers
    } = useContext(GameContext);

    return (
        <div>
            <h1>You are in lobby number {roomCode}</h1>
            <span>
                <button onClick={addPlayers}>Add some players!</button>
            </span>
        </div>
    )
}







export default GamePage;

