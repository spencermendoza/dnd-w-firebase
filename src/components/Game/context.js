import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

import { FAKE_PLAYERS } from './PLAYER/playerHelpers';
import { Player } from './PLAYER/Player';

const GameContext = React.createContext();
const { Provider, Consumer } = GameContext;

class GameProviderBase extends Component {
    state = {
        sortBy: 'initiative',
        roomCode: null,
        players: [],
        loading: false,
        playerDialog: {
            open: false,
            player: Player.create(),
        },
    }

    // componentDidMount() {
    //     const rememberMyLobby = JSON.parse(localStorage.getItem('cacheLobby'));

    //     if (rememberMyLobby) {
    //         this.joinGame(rememberMyLobby);
    //     } else {
    //         console.log('there is no lobby here');
    //     }
    // }

    cacheGameData = (number) => {
        const lobby = number;
        // const savedPlayers = this.state.players;

        localStorage.clear();
        localStorage.setItem('cacheLobby', JSON.stringify(lobby));
        // localStorage.setItem('cachePlayers', JSON.stringify(savedPlayers));
    }

    /////////////// FIREBASE DEPENDENT FUNCTIONS ///////////////////

    checkGame = number => {
        function answer(number) { return this.props.firebase.doesLobbyExist(number) };
        const answerTwo = async function () { await (this.answer()) };
        console.log(answer);
        console.log(answerTwo);
        return answerTwo;
    }

    createGame = number => {
        this.setState({ roomCode: number });
        this.props.firebase.createNewGameLobby(number);
    }

    joinGame = number => {
        this.setState({ roomCode: number, loading: true });
        this.props.firebase.gameLobby(number).on('value', snapshot => {
            const playersObject = snapshot.val();

            let playersList = Object.keys(playersObject).map(key => ({
                ...playersObject[key],
            }));

            this.setState({
                players: playersList,
                loading: false,
            });
        });

        this.cacheGameData(number);
    }

    addPlayersToFirebase = (list) => {
        const playerList = list;
        const room = this.state.roomCode;
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
                checkGame: this.checkGame,
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


