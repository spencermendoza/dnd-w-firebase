import React, { useState, useContext } from 'react';

import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';

import GamePage from '../Game';
import { GameContext } from '../Game/context';

const HomePage = () => {

    const [formDisplay, setFormDisplay] = useState(false);
    const [selection, setSelection] = useState(null);

    const joinNewGame = () => {
        console.log('the player wants to join a game');
        setSelection('join');
        setFormDisplay(true);
        console.log(selection);
    }

    const createNewGame = () => {
        console.log('the player wants to create a game');
        setSelection('create');
        setFormDisplay(true);
        console.log(selection);
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

const RoomForm = (props) => {

    const {
        createGame,
        joinGame,
        openDialog,
        closeDialog,
    } = useContext(GameContext);

    const [selection, setSelection] = useState(props.selection);
    const [room, setRoom] = useState(null);
    const [code, setCode] = useState(false);

    const onSubmit = event => {
        const { selection, room } = this.state;
        console.log(code);

        event.preventDefault();
    }

    const onChange = event => {
        setRoom(event.target.value);

        if (event.target.value >= 1000) {
            setCode(true);
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <input
                name='room'
                onChange={onChange}
                placeholder='Enter your four digit code'
            />
            <button disabled={{ code }} type='submit'>
                Enter Room
            </button>
        </form>
    );
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);