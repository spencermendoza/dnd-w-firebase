import React, { useState, useContext } from 'react';

import { withRouter } from 'react-router-dom';
import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';

import GamePage from '../Game';
import { GameContext } from '../Game/context';

const HomePage = () => {

    const [formDisplay, setFormDisplay] = useState(false);
    const [selection, setSelection] = useState('');

    const joinNewGame = (event) => {
        setSelection('join');
        setFormDisplay(true);
    }

    const createNewGame = (event) => {
        setSelection('create');
        setFormDisplay(true);
    }

    if (formDisplay === true) {
        return (
            <RoomForm selection={selection} />
        );
    } else {
        return (
            <div>
                <h1>Welcome to my initiative tracker!</h1>
                <p>Make a selection below to begin using the app.</p>
                <button onClick={() => joinNewGame()}>Join a game:</button>
                <button onClick={() => createNewGame()}>Create a game:</button>
            </div>
        );
    }
};

const RoomFormBase = (props) => {

    // const [selection, setSelection] = useState(props.selection);
    const [room, setRoom] = useState();

    const {
        checkGame,
        createGame,
        joinGame,
    } = useContext(GameContext)

    const onSubmit = event => {
        event.preventDefault();

        if (props.selection === 'create') {
            const exists = checkGame(room);
            if (exists) {
                return console.log('This lobby exists already', room);
            } else {
                console.log('this lobby doesnt exist yet', room)
                createGame(room);
                props.history.push(ROUTES.GAME);
            }
        } else if (props.selection === 'join') {
            joinGame(room)
            props.history.push(ROUTES.GAME);
        }
    }

    const onChange = event => {
        setRoom(event.target.value);
    }

    return (
        <form onSubmit={onSubmit} >
            <input
                name='room'
                placeholder='Enter your four digit code'
                onChange={onChange}
            />
            <button type='submit'>
                Enter Room
            </button>
        </form>
    );
}

const RoomForm = withRouter(RoomFormBase);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);
export { RoomForm };