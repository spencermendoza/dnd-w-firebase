import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

import { FAKE_PLAYERS } from './PLAYER/playerHelpers';
import { Player } from './PLAYER/Player';
import { Game } from './Game';

const GameContext = React.createContext();
const { Provider, Consumer } = GameContext;

class GameProviderBase extends Component {
    state = {
        sortBy: 'initiative',
        lobbyNumber: null,
        loading: false,
        game: Game.create(),
        playerDialog: {
            player: Player.create(),
            open: false,
            status: null,
        },
        sortOptions: [
            {
                displayText: 'Initiative Value',
                sortBy: 'initiative'
            },
            {
                displayText: 'HP',
                sortBy: 'hp'
            },
            {
                displayText: 'Armor Class',
                sortBy: 'armor'
            },
            {
                displayText: 'Damage',
                sortBy: 'damage'
            }
        ]
    }

    componentDidMount() {
        // localStorage.clear();
        const rememberMyLobby = JSON.parse(localStorage.getItem('cacheLobby'));

        if (rememberMyLobby) {
            this.joinGame(rememberMyLobby);
        } else {
            console.log('there is no lobby here');
        }
    }

    cacheGameData = (number) => {
        const lobbyNumber = number;

        localStorage.clear();
        localStorage.setItem('cacheLobby', JSON.stringify(lobbyNumber));
    }

    /////////////// FIREBASE DEPENDENT FUNCTIONS ///////////////////

    checkGame = (roomOccupied) => {
        return this.props.firebase.doesLobbyExist(roomOccupied).then(result => {
            return result;
        });
    }

    createGame = number => {
        this.setState({ roomCode: number });
        const newGame = Game.create({
            lobbyNumber: number,
            master: this.props.firebase.getUser(),
            combatants: FAKE_PLAYERS,
        })
        console.log(newGame);
        this.props.firebase.createNewGameLobby(newGame);
    }

    joinGame = (lobby) => {
        this.props.firebase.gameLobby(lobby).on('value', snapshot => {
            const lobbyObject = snapshot.val();
            let newGame = Game.create({
                lobbyNumber: lobbyObject.lobbyNumber,
                master: lobbyObject.master,
                combatants: lobbyObject.combatants,
            });
            this.setState({
                lobbyNumber: newGame.lobbyNumber,
                game: newGame,
                loading: false
            });
            this.cacheGameData(newGame.lobbyNumber);
        })
    }

    addPlayersToFirebase = (list) => {
        const playerList = list;
        const room = this.state.lobbyNumber;
        this.props.firebase.addPlayers(playerList, room);
    }

    //////////// GAME FUNCTIONS /////////////////////

    handleAddClick = () => {
        const player = Player.create();
        this.setState({ playerDialog: { player: player, open: true, status: 'add' } });
    }

    handleEditClick = (player) => {
        this.setState({ playerDialog: { player: player, open: true, status: 'edit' } });
    }

    handleDialogConfirmClick = player => {
        let dialogState = this.state.playerDialog;
        let playerList = this.state.game.combatants;

        if (dialogState.status === 'add') {
            playerList.push(player);
            this.props.firebase.addPlayers(playerList, this.state.lobbyNumber);
        } else if (dialogState.status === 'edit') {
            let newList = this.updatePlayer(playerList, player);
            this.props.firebase.addPlayers(newList, this.state.lobbyNumber);
        }

        this.setState({
            playerDialog: {
                player: Player.create(),
                open: false,
                status: null,
            }
        });
    }

    handleDialogCancelClick = () => {
        this.setState({ playerDialog: { player: Player.create(), open: false } });
    }

    handleSortMenuChange = (selection) => {
        let selectionType = selection.sortBy;
        this.setState({ sortBy: selectionType });
        console.log(this.state.sortBy);
        let list = this.state.game.combatants;
        for (let i = 0; i < list.length; i++) {
            console.log('selected property: ', list[i].selectionType);
        }
    }

    updatePlayer = (list, player) => {
        return list.map(p => (
            (p.id === player.id) ? player : p
        ));
    }

    render() {
        return <Provider
            value={{
                ...this.state,
                checkGame: this.checkGame,
                createGame: this.createGame,
                joinGame: this.joinGame,
                handleAddClick: this.handleAddClick,
                handleDialogConfirmClick: this.handleDialogConfirmClick,
                handleDialogCancelClick: this.handleDialogCancelClick,
                handleEditClick: this.handleEditClick,
                handleSortMenuChange: this.handleSortMenuChange,
            }}
        >{this.props.children}</Provider>
    }
}

const GameProvider = withFirebase(GameProviderBase);

export { GameContext, GameProvider, Consumer as GameConsumer };


