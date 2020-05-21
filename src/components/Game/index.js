import React, { Component, useState } from 'react';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';

import GameContext from './context';

const GamePage = () => {
    const [selection, setSelection] = useState(null);

    const joinGame = () => {
        console.log('join game button works')
        setSelection('join');
    }

    const createGame = () => {
        console.log('create game button works')
        setSelection('create');
    }
}







const JoinGame = () => {
    const [roomCode, setCode] = useState(0);
}







export default GamePage;

