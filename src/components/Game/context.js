import React, { Component, useContext } from 'react';

import Firebase from '../Firebase/firebase';
import { withFirebase } from '../Firebase';
import { FirebaseContext } from '../Firebase';

import { FAKE_PLAYERS } from './PLAYER/playerHelpers';
import { Player } from './PLAYER/Player';

const GameContext = React.createContext();
const { Provider, Consumer } = GameContext;

class GameProviderBase extends Component {
    state = {
        sortBy: 'initiative',
        roomCode: null,
        players: FAKE_PLAYERS,
        playerDialog: {
            open: false,
            player: Player.create(),
        },
    }

    /////////////// FIREBASE DEPENDENT FUNCTIONS ///////////////////

    createGame = number => {
        this.setState({ roomCode: number });
        this.props.firebase.createNewGameLobby(number);
    }

    joinGame = number => {
        this.setState({ roomCode: number });
    }

    addPlayersToFirebase = (list) => {
        const playerList = list;
        const room = 5555;
        this.props.firebase.addPlayers(playerList, room);
    }

    //////////// GAME FUNCTIONS /////////////////////

    handleAddClick = () => {
        const player = Player.create();
        this.setState({ playerDialog: { player: player, open: true } });
    }

    handleDialogConfirmClick = player => {
        console.log(player)
        let updatedPlayers = this.state.players;
        let addPlayer = false;
        for (let i = 0; i < updatedPlayers.length; i++) {
            if (updatedPlayers[i].id === player.id) {
                updatedPlayers = this.updatePlayer(updatedPlayers, player);
                addPlayer = false;
                break;
            } else {
                addPlayer = true;
            }
        }
        if (addPlayer) {
            updatedPlayers.push(player);
        }

        this.setState({
            players: updatedPlayers,
            playerDialog: { player: Player.create(), open: false },
        });
        console.log(updatedPlayers);
        this.addPlayersToFirebase(updatedPlayers);
    }

    updatePlayer = (list, player) => {
        return list.map(p => (
            (p.id === player.id) ? player : p
        ));
        console.log(list);
    }

    handleDialogCancelClick = () => {
        this.setState({ playerDialog: { player: Player.create(), open: false } });
    }

    handleEditClick = (player) => {
        this.setState({ playerDialog: { player, open: true } });
        console.log('working...?')
    }

    render() {
        return <Provider
            value={{
                ...this.state,
                createGame: this.createGame,
                joinGame: this.joinGame,
                addPlayers: this.addPlayers,
                handleAddClick: this.handleAddClick,
                handleDialogConfirmClick: this.handleDialogConfirmClick,
                handleDialogCancelClick: this.handleDialogCancelClick,
                handleEditClick: this.handleEditClick,
            }}
        >{this.props.children}</Provider>
    }
}

const GameProvider = withFirebase(GameProviderBase);

export { GameContext, GameProvider, Consumer as GameConsumer };


