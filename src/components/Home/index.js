import React, { useState, useContext } from 'react';
import '../../styles.css';

import { withRouter } from 'react-router-dom';
import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';

import GamePage from '../Game';
import { MasterContext } from '../Game/MasterContext';

const HomePage = (props) => {

    const { joinCachedLobby } = useContext(MasterContext);

    const [formDisplay, setFormDisplay] = useState(false);
    const [selection, setSelection] = useState('');

    const cachedGame = () => {
        const cachedLobby = JSON.parse(localStorage.getItem('cacheLobby'))

        if (cachedLobby) {
            joinCachedLobby()
            props.history.push(ROUTES.GAME);
        } else {
            alert("You don't currently have a cached lobby. Join one first.")
        }
    }

    const joinNewGame = (event) => {
        setSelection('join');
        setFormDisplay(true);
    }

    const createNewGame = (event) => {
        setSelection('create');
        setFormDisplay(true);
    }

    const changeSelection = () => {
        if (selection === 'create') {
            setSelection('join');
        } else if (selection === 'join') {
            setSelection('create');
        }
    }

    if (formDisplay === true) {
        return (
            <RoomForm selection={selection} changeSelection={changeSelection} />
        );
    } else {
        return (
            <div id='homeDiv'>
                <h1 id='homeTitle'>Welcome to my initiative tracker!</h1>
                <p id='homeP'>Make a selection below to begin using the app:</p>
                <div id='buttonDiv'>
                    <button onClick={() => cachedGame()} class='homeOptions'>Join most recent game</button>
                    <button onClick={() => joinNewGame()} class='homeOptions'>Join an existing game</button>
                    <button onClick={() => createNewGame()} class='homeOptions'>Create a new game</button>
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
    } = useContext(MasterContext)

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
                alert('this room already exists, please try another one');
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

    const oppSelection = () => {
        if (props.selection === 'create') {
            return 'Join';
        } else if (props.selection === 'join') {
            return 'Create';
        }
    }

    const labelName = () => {
        if (props.selection === 'join') {
            return 'Joining an existing room:';
        } else {
            return 'Creating a new room:';
        }
    }

    const buttonName = () => {
        if (!isInvalid) {
            return 'Your room code must be four digits';
        } else {
            return 'Enter room';
        }
    }

    const isInvalid = room > 998 && room < 10000;

    return (
        <form onSubmit={onSubmit} id='roomForm'>
            <label>{labelName()}</label>
            <input
                id='roomInput'
                name='room'
                placeholder='Enter your four digit code'
                onChange={onChange}
            />
            <div class='buttonDiv'>
                <button disabled={!isInvalid} type='submit' id='roomButton'>
                    {buttonName()}
                </button>
                <button type='button' id='roomButton' onClick={() => props.changeSelection()}>{oppSelection()} a room instead</button>
            </div>
        </form>
    );
}

const RoomForm = withRouter(RoomFormBase);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);
export { RoomForm };