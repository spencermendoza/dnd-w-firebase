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
        ],
        timerState: {
            minutes: 2,
            seconds: 0,
            bName: 'Start Timer!',
            currentHighest: {},
        },
        activeNumber: 0,
    }

    nextHighestInit = () => {
        var players = this.state.game.combatants;
        for (let i = 0; i <= players.length; i++) {
            if (i < players.length - 1 && players[i].active === true) {
                console.log('first if statement, active player is between 0 and players.length, break loop')
                players[i].active = !players[i].active
                players[i + 1].active = !players[i + 1].active
                break;
            } else if (i === players.length - 1 && players[i].active === true) {
                console.log('second if statement, active player is the last player, wraps back to top of list, breaks loop')
                players[players.length - 1].active = !players[players.length - 1].active
                players[0].active = !players[0].active
                break;
            } else if (i === players.length) {
                console.log('nobody is active so the first player begins, then breaks loop')
                players[0].active = !players[0].active
                break;
            }
            console.log('this is the point in the loop ' + i);
        }
        console.log(players);
    }

    togglePlayerActive = (p) => {
        return { ...p, active: !p.active };
    }

    isTimerRunning = (buttonName) => {
        if (buttonName === 'Start Timer!') {
            console.log('starting timer')
            this.timerStart();
        } else if (buttonName === 'Stop Timer!') {
            console.log('stopping timer')
            this.timerStop();
        } else {
            console.log('something went wrong with the timer');
        }
    }

    timerStart = () => {
        this.setState({
            timerState: ({
                minutes: 2,
                seconds: 0,
                bName: 'Stop Timer!',
            })
        });
        this.nextHighestInit();
    }

    timerStop = () => {
        this.setState({
            timerState: ({
                minutes: 2,
                seconds: 0,
                bName: 'Start Timer!',
            })
        });
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
                combatants: this.makeObjectsPlayers(lobbyObject.combatants),
            });
            this.setState({
                lobbyNumber: newGame.lobbyNumber,
                game: newGame,
                loading: false
            });
            this.cacheGameData(newGame.lobbyNumber);
        })
    }

    makeObjectsPlayers = (object) => {
        var combatants = object;
        var combatantNames = Object.keys(combatants);
        var newCombatants = [];
        for (let i = 0; i < combatantNames.length; i++) {
            newCombatants.push(Player.create({
                ...combatants[combatantNames[i]],
            }));
        }
        return newCombatants;
    }

    addPlayersToFirebase = (list) => {
        const playerList = list;
        const room = this.state.lobbyNumber;
        this.props.firebase.addPlayers(playerList, room);
    }

    //////////// GAME FUNCTIONS /////////////////////

    //////////// ADDING/EDITING PLAYERS ///////////////////

    handleAddClick = () => {
        const player = Player.create();
        this.setState({ playerDialog: { player: player, open: true, status: 'add' } });
    }

    handleEditClick = (player) => {
        this.setState({ playerDialog: { player: player, open: true, status: 'edit' } });
    }

    handleDialogConfirmClick = updatedPlayer => {
        let dialogState = this.state.playerDialog;
        let playerList = this.state.game.combatants;

        if (dialogState.status === 'add') {
            playerList.push(updatedPlayer);
            this.props.firebase.addPlayers(playerList, this.state.lobbyNumber);
        } else if (dialogState.status === 'edit') {
            this.props.firebase.updatePlayer(updatedPlayer, this.state.lobbyNumber, dialogState.player);
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

    ///////////////////// SORTING PLAYERS //////////////////

    sortPlayersBy = (list, prop) => [...list.sort(this.customSort(prop))];

    customSort = prop => (a, b) => {
        if (a[prop] > b[prop]) return -1;
        if (a[prop] === b[prop]) return 0;
        if (a[prop] < b[prop]) return 1;
    }

    handleSortMenuChange = (selection) => {
        this.setState({
            sortBy: selection
        });
    }

    ///////////// TURN TIMER ////////////////

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
                sortPlayersBy: this.sortPlayersBy,
                isTimerRunning: this.isTimerRunning,
            }}
        >{this.props.children}</Provider>
    }
}

const GameProvider = withFirebase(GameProviderBase);

export { GameContext, GameProvider, Consumer as GameConsumer };


