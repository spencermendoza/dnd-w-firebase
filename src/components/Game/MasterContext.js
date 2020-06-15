import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

import { FAKE_PLAYERS } from './PLAYER/playerHelpers';
import { Player } from './PLAYER/Player';
import { Game } from './Game';

const MasterContext = React.createContext();
const { Provider, Consumer } = MasterContext;

class GameProviderBase extends Component {
    state = {
        lobbyNumber: null,
        game: Game.create(),
        master: false,
        currentUser: '',
        sortBy: 'initiative',
        loading: false,
        timerName: 'Start',
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
    }

    componentDidMount() {
        // localStorage.clear();

        this.listener = this.props.firebase.auth.onAuthStateChanged(
            authUser => {
                authUser
                    ? this.setState({ currentUser: authUser.uid })
                    : this.setState({ currentUSer: null });
            }
        )

        this.joinCachedLobby();
    }

    componentWillUnmount() {
        this.listener();
    }

    setUser = (user) => {
        console.log(user)
    }

    cacheGameData = (number) => {
        const lobbyNumber = number;

        localStorage.clear();
        localStorage.setItem('cacheLobby', JSON.stringify(lobbyNumber));
    }

    joinCachedLobby = () => {
        const rememberedLobby = JSON.parse(localStorage.getItem('cacheLobby'));

        if (rememberedLobby) {
            this.checkGame(rememberedLobby).then(result => {
                if (result) {
                    this.joinGame(rememberedLobby)
                    this.checkStaged(rememberedLobby)
                }
            })
        } else {
            console.log('There is no lobby here');
        }
    }

    /////////////// FIREBASE DEPENDENT FUNCTIONS ///////////////////

    checkGame = (roomOccupied) => {
        return this.props.firebase.doesLobbyExist(roomOccupied).then(result => {
            return result;
        });
    }

    checkStaged = (lobby) => {
        return this.props.firebase.checkStaged(lobby).then(result => {
            if (result) {
                console.log('true, ', result)
            } else {
                console.log('false, ', result)
            }
        });
    }

    createGame = number => {
        this.setState({ roomCode: number });
        const newGame = Game.create({
            lobbyNumber: number,
            master: this.props.firebase.getUser(),
            combatants: FAKE_PLAYERS,
            minutes: 2,
            seconds: 0,
            staged: [],
        })
        console.log(newGame);
        this.props.firebase.createNewGameLobby(newGame);
    }

    joinGame = (lobby) => {
        this.props.firebase.gameLobby(lobby).on('value', snapshot => {
            const lobbyObject = snapshot.val();
            let currentUser = this.props.firebase.getUser();
            let newGame = Game.create({
                lobbyNumber: lobbyObject.lobbyNumber,
                master: lobbyObject.master,
                combatants: this.makeObjectsPlayers(lobbyObject.combatants),
                minutes: lobbyObject.minutes,
                seconds: lobbyObject.seconds,
            });
            this.setState({
                lobbyNumber: newGame.lobbyNumber,
                game: newGame,
                loading: false
            });
            this.cacheGameData(newGame.lobbyNumber);
            newGame.master === currentUser ? this.setState({ master: true }) : this.setState({ master: false });
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

    masterAddPlayers = (player) => {
        let playerList = this.state.game.combatants;
        playerList.push(player);
        this.props.firebase.addPlayers(playerList, this.state.lobbyNumber);
        this.resetDialogState();
    }

    playerAddPlayers = (player) => {
        this.checkStaged(this.state.lobbyNumber).then(result => {
            if (result) {
                alert('There is already a staged character. Please wait until they are no longer staged')
                console.log('true, ', result)
            } else {
                alert('Your character is now staged, they will appear on your screen once they are approved by the GM')
                console.log('false, ', result)
                this.props.firebase.addStaged(this.state.lobbyNumber, player)
                this.resetDialogState();
            }
        })
    }

    handleUpdatePlayer = (player, oldPlayer) => {
        this.props.firebase.updatePlayer(player, this.state.lobbyNumber, oldPlayer);
        this.resetDialogState();
    }

    handleDialogConfirmClick = updatedPlayer => {
        let dialogState = this.state.playerDialog;

        if (dialogState.status === 'add') {
            if (this.state.master) {
                this.masterAddPlayers(updatedPlayer);
            } else {
                this.playerAddPlayers(updatedPlayer);
            }
        }

        if (dialogState.status === 'edit') {
            this.handleUpdatePlayer(updatedPlayer, dialogState.player);
        }
    }

    resetDialogState = () => {
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

    handleDialogRemoveClick = (player) => {
        this.props.firebase.removePlayer(this.state.lobbyNumber, player);
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


    nextHighestInit = () => {
        var players = this.sortPlayersBy(this.state.game.combatants, 'initiative');
        for (let i = 0; i <= players.length; i++) {
            if (i < players.length - 1 && players[i].active === true) {
                players[i].active = !players[i].active
                this.props.firebase.updatePlayer(players[i], this.state.lobbyNumber, players[i]);
                players[i + 1].active = !players[i + 1].active
                this.props.firebase.updatePlayer(players[i + 1], this.state.lobbyNumber, players[i + 1]);
                break;
            } else if (i === players.length - 1 && players[i].active === true) {
                players[players.length - 1].active = !players[players.length - 1].active
                this.props.firebase.updatePlayer(players[players.length - 1], this.state.lobbyNumber, players[players.length - 1]);
                players[0].active = !players[0].active
                this.props.firebase.updatePlayer(players[0], this.state.lobbyNumber, players[0]);
                break;
            } else if (i === players.length) {
                players[0].active = !players[0].active
                this.props.firebase.updatePlayer(players[0], this.state.lobbyNumber, players[0]);
                break;
            }
        }
    }

    isTimerRunning = (buttonName) => {
        if (buttonName === 'Start') {
            this.timerStart();
        } else if (buttonName === 'Pause') {
            this.timerPause();
        } else {
            this.timerReset();
        }
    }

    timerStart = () => {
        this.setState({ timerName: 'Pause' });
        if (this.myInterval) {
            clearInterval(this.myInterval);
        }

        var activeBool = false;
        for (let i = 0; i < this.state.game.combatants.length; i++) {
            if (this.state.game.combatants[i].active === true) {
                activeBool = true;
            }
        }

        if (!activeBool) {
            this.nextHighestInit();
        }

        this.myInterval = setInterval(() => {
            const { seconds, minutes } = this.state.game;
            if (seconds > 0) {
                this.setState({ game: { ...this.state.game, seconds: seconds - 1 } });
                this.props.firebase.updateTime(this.state.lobbyNumber, this.state.game.minutes, this.state.game.seconds);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    this.setState({ game: { ...this.state.game, minutes: 0, seconds: 10 } });
                    this.props.firebase.updateTime(this.state.lobbyNumber, this.state.game.minutes, this.state.game.seconds);
                    this.nextHighestInit()
                } else {
                    this.setState({ game: { ...this.state.game, minutes: minutes - 1, seconds: 59 } });
                    this.props.firebase.updateTime(this.state.lobbyNumber, this.state.game.minutes, this.state.game.seconds);
                }
            }
        }, 1000);
    }

    timerPause = () => {
        clearInterval(this.myInterval);
        this.setState({ timerName: 'Start' });
    }

    timerReset = () => {
        clearInterval(this.myInterval);
        this.setState({
            game: {
                ...this.state.game,
                minutes: 0,
                seconds: 10,
            },
            timerName: 'Start',
        });
        this.state.game.combatants.map(p => {
            p.active = false
            this.props.firebase.updatePlayer(p, this.state.lobbyNumber, p);
        })
        this.props.firebase.updateTime(this.state.lobbyNumber, 0, 10);
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
                sortPlayersBy: this.sortPlayersBy,
                isTimerRunning: this.isTimerRunning,
                setUser: this.setUser,
                handleDialogRemoveClick: this.handleDialogRemoveClick,
            }}
        >{this.props.children}</Provider>
    }
}

const GameProvider = withFirebase(GameProviderBase);

export { MasterContext, GameProvider, Consumer as GameConsumer };


