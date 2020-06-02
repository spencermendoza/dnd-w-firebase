import React, { useState, useContext } from 'react';
import '../../styles.css';

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
            <div id='homeDiv'>
                <h1 id='homeTitle'>Welcome to my initiative tracker!</h1>
                <p id='homeP'>Make a selection below to begin using the app:</p>
                <div id='buttonDiv'>
                    <button onClick={() => joinNewGame()} class='homeOptions'>Join a game</button>
                    <button onClick={() => createNewGame()} class='homeOptions'>Create a game</button>
                </div>
            </div>
        );
    }
};

const RoomFormBase = (props) => {

    // const [selection, setSelection] = useState(props.selection);
    const [room, setRoom] = useState();

    const {
        checkGame,
        joinGame,
        createGame,
    } = useContext(GameContext)

    const onSubmit = event => {
        event.preventDefault();

        if (props.selection === 'create') {
            createNewGame(room);
        } else {
            joinNewGame(room);
        }
    }

    const createNewGame = (room) => {
        checkGame(room).then(result => {
            if (result) {
                alert('this room already exists, douchebag');
            } else {
                alert('this is a fresh lobby');
                createGame(room);
                joinGame(room)
                props.history.push(ROUTES.GAME);
            }
        })
    }

    const joinNewGame = (room) => {
        checkGame(room).then(result => {
            if (result) {
                alert('welcome to game number ' + room);
                joinGame(room)
                props.history.push(ROUTES.GAME);
            } else {
                alert('this room doesnt exist: ' + room);
            }
        })
    }

    const onChange = event => {
        setRoom(event.target.value);
    }

    const isInvalid = room > 999 && room < 10000;

    return (
        <form onSubmit={onSubmit} id='roomForm'>
            <input
                id='roomInput'
                name='room'
                placeholder='Enter your four digit code'
                onChange={onChange}
            />
            <button disabled={!isInvalid} type='submit' id='roomButton'>
                Enter Room
            </button>
        </form>
    );
}

const RoomForm = withRouter(RoomFormBase);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);
export { RoomForm };