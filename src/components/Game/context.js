import React, { Component, useContext } from 'react';

import Firebase from '../Firebase/firebase';
import { withFirebase } from '../Firebase';
import { FirebaseContext } from '../Firebase';

import { FAKE_PLAYERS } from './playerHelpers';

const GameContext = React.createContext();
const { Provider, Consumer } = GameContext;

class GameProviderBase extends Component {
    state = {
        combatants: [],
        sortBy: 'initiative',
        roomCode: null,
        players: FAKE_PLAYERS,
    }

    createGame = number => {
        this.setState({ roomCode: number });
        this.props.firebase.createNewGameLobby(number);
    }

    joinGame = number => {
        this.setState({ roomCode: number });
    }

    addPlayers = (array) => {
        console.log('you idiot this doesnt even do anything yet');
    }

    render() {
        return <Provider
            value={{
                ...this.state,
                createGame: this.createGame,
                joinGame: this.joinGame,
                addPlayers: this.addPlayers,
            }}
        >{this.props.children}</Provider>
    }
}

const GameProvider = withFirebase(GameProviderBase);

export { GameContext, GameProvider, Consumer as GameConsumer };


