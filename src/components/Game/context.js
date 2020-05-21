import React, { Component } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import { withFirebase } from '../Firebase';

const GameContext = React.createContext();
const { Provider, Consumer } = GameContext;

class GameProvider extends Component {
    state = {
        combatants: [],
        sortBy: 'initiative',
        roomDialog: false,
        roomCode: null,
    }

    createGame = number => {
        this.setState({ roomCode: number });
        console.log(this.state.roomCode);
    }

    joinGame = number => {
        this.setState({ roomCode: number });
        console.log(this.state.roomCode);
    }

    openRoomDialog = selection => {
        this.setState({ roomDialog: true });
    }

    closeRoomDialog = () => {
        this.setState({ roomDialog: false });
    }

    render() {
        return <Provider
            value={{
                ...this.state,
                createGame: this.createGame,
                joinGame: this.joinGame,
                openDialog: this.openRoomDialog,
                closeDialog: this.closeRoomDialog,
            }}
        >{this.props.children}</Provider>
    }
}

export { GameContext, GameProvider, Consumer as GameConsumer };


