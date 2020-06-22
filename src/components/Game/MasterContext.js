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
        stagedPlayer: {
            staged: false,
            player: Player.create(),
            status: null,
        }
    }

    ///////////////////////AUTOMATIC GAME FUNCTIONS/////////////////////////////////////

    componentDidMount() {
        // localStorage.clear();

        this.listener = this.props.firebase.auth.onAuthStateChanged(
            authUser => {
                authUser
                    ? this.setState({ currentUser: authUser.uid })
                    : this.resetState()
            }
        )

        this.joinCachedLobby();
    }

    componentWillUnmount() {
        this.listener();
    }

    cacheGameData = (number) => {
        const lobbyNumber = number;
        const rememberedLobby = JSON.parse(localStorage.getItem('cacheLobby'));

        if (lobbyNumber !== rememberedLobby) {
            localStorage.clear();
            localStorage.setItem('cacheLobby', JSON.stringify(lobbyNumber));
        }
    }

    joinCachedLobby = () => {
        const rememberedLobby = JSON.parse(localStorage.getItem('cacheLobby'));

        if (rememberedLobby && this.props.firebase.auth) {
            this.checkGame(rememberedLobby).then(result => {
                if (result) {
                    this.joinGame(rememberedLobby)
                    return true;
                }
            })
        } else {
            alert('There is no lobby here');
            console.log(rememberedLobby)
            return false;
        }
    }

    toggleMasterControl = () => {
        var currentUser = this.state.currentUser;
        const randomUser = 1000;
        if (this.state.master) {
            this.props.firebase.updateMaster(randomUser)
            this.setState({ master: false });
        } else {
            this.props.firebase.updateMaster(currentUser)
            this.setState({ master: true });
        }
    }

    resetPlayers = () => {
        var combatants = {}
        this.props.firebase.gamePlayers(999).once('value').then(snapshot => {
            const charactersObj = snapshot.val();
            combatants = this.makeObjectsPlayers(charactersObj)
            var removeList = this.makeRemoveList(combatants);
            for (let i = 0; i < removeList.length; i++) {
                this.props.firebase.removePlayer(999, removeList[i]);
            }
        })
    }

    makeRemoveList = (currentList) => {
        var newList = [];
        currentList.forEach(character => {
            for (let i = 0; i <= FAKE_PLAYERS.length; i++) {
                if (i === FAKE_PLAYERS.length) {
                    newList.push(character);
                    break;
                }
                if (character.name === FAKE_PLAYERS[i].name) {
                    break;
                }
            }
        })
        return newList;
    }

    /////////////// FIREBASE DEPENDENT FUNCTIONS ///////////////////

    //returns bool on if room exists already
    checkGame = (roomOccupied) => {
        return this.props.firebase.doesLobbyExist(roomOccupied).then(result => {
            return result;
        });
    }

    //returns bool on if there is a staged player
    checkStaged = (lobby) => {
        return this.props.firebase.checkStaged(lobby).then(result => {
            return result;
        });
    }

    //creates a new lobby at room number
    createGame = number => {
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

    //joins lobby at room number. initializes game state and retrieves all relevant data
    joinGame = (lobby) => {
        this.props.firebase.gameLobby(lobby).on('value', snapshot => {
            const lobbyObject = snapshot.val();
            let currentUser = '';
            if (this.props.firebase.getUser() !== null) {
                currentUser = this.props.firebase.getUser();
            }
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

            if (newGame.master === currentUser) {
                this.setState({ master: true })
            }

            if (this.state.master) {
                this.masterCheckStaged();
            }
            this.cacheGameData(newGame.lobbyNumber);
        });
    }

    //accepts an object (from firebase) and makes it into a player
    makeObjectPlayer = (object) => {
        var newPlayer = Player.create({
            ...object
        });
        return newPlayer;
    }

    //accepts an object (from firebase) and turns it into an array of players using above func
    makeObjectsPlayers = (object) => {
        var combatants = object;
        var combatantNames = Object.keys(combatants);
        var newCombatants = [];
        for (let i = 0; i < combatantNames.length; i++) {
            newCombatants.push(this.makeObjectPlayer(combatants[combatantNames[i]]));
        }
        return newCombatants;
    }

    //need to come back to this TODO: figure out where this function needs to be
    addPlayersToFirebase = (list) => {
        const playerList = list;
        const room = this.state.lobbyNumber;
        this.props.firebase.addPlayers(playerList, room);
    }

    //////////// GAME FUNCTIONS /////////////////////

    //////////// ADDING/EDITING PLAYERS GENERAL ///////////////////

    handleAddClick = () => {
        const player = Player.create();
        this.setState({ playerDialog: { player: player, open: true, status: 'add' } });
    }

    handleEditClick = (player) => {
        this.setState({ playerDialog: { player: player, open: true, status: 'edit' } });
    }

    handleDialogCancelClick = () => {
        this.setState({ playerDialog: { player: Player.create(), open: false } });
    }

    handleDialogRemoveClick = (player) => {
        this.props.firebase.removePlayer(this.state.lobbyNumber, player);
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

    handleDialogConfirmClick = player => {
        let dialogState = this.state.playerDialog;

        if (this.state.master) {
            if (dialogState.status === 'add') {
                this.masterAddPlayers(player)
            } else if (dialogState.status === 'edit') {
                this.handleUpdatePlayer(player)
            }
            this.resetStagedState();
        } else {
            this.playerAddPlayers(player)
        }
    }

    ////////////////////////////// PLAYER FUNCTIONS ///////////////////////////////
    //////////////////////////// ADDING/EDITING PLAYERS ///////////////////

    playerAddPlayers = (player) => {
        this.checkStaged(this.state.lobbyNumber).then(result => {
            if (result) {
                alert('There is already a staged character. Please wait until they are no longer staged')
                console.log('true, ', result)
            } else {
                alert('Your character is now staged, they will appear on your screen once they are approved by the GM')
                this.props.firebase.addStaged(this.state.lobbyNumber, player, this.state.playerDialog.status, this.state.currentUser)
                this.resetDialogState();
            }
        })
    }

    //////////////////////////////// DUNGEON MASTER FUNCTIONS //////////////////////////////
    ////////////// ADDING/EDITING PLAYERS ///////////////////

    masterCheckStaged = () => {
        this.checkStaged(this.state.lobbyNumber).then(result => {
            if (result) {
                this.masterGetStaged();
            }
        })
    }

    masterGetStaged = () => {
        this.props.firebase.getStaged(this.state.lobbyNumber).on('value', snapshot => {
            const staged = snapshot.val();
            if (staged) {
                var newPlayer = this.makeObjectPlayer(staged.player)
                this.setState({ stagedPlayer: { staged: true, player: newPlayer, status: staged.status } })
            }
        })
    }

    masterViewStagedPlayer = () => {
        var stagedStatus = this.state.stagedPlayer;
        this.setState({ playerDialog: { player: stagedStatus.player, open: true, status: stagedStatus.status } });
    }

    masterAddPlayers = (player) => {
        this.props.firebase.gamePlayers(this.state.lobbyNumber).once('value').then(snapshot => {
            var characterList = snapshot.val();
            if (characterList.length < 20) {
                let playerList = this.state.game.combatants;
                playerList.push(player);
                this.props.firebase.addPlayers(playerList, this.state.lobbyNumber);
                this.resetDialogState();
            } else {
                alert('There are too many players in this lobby, please remove some before adding more.')
            }
        })
    }

    handleUpdatePlayer = (player) => {
        let combatants = this.state.game.combatants;
        let oldPlayer = {};
        for (let i = 0; i < combatants.length; i++) {
            if (combatants[i].id === player.id) {
                oldPlayer = combatants[i];
            }
        }
        this.props.firebase.updatePlayer(player, this.state.lobbyNumber, oldPlayer);
        this.resetDialogState();
    }

    resetStagedState = () => {
        this.setState({
            stagedPlayer: {
                staged: false,
                player: Player.create(),
                status: null,
            }
        })
        this.props.firebase.removeStaged(this.state.lobbyNumber);
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
                    this.setState({ game: { ...this.state.game, minutes: 2, seconds: 0 } });
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
                minutes: 2,
                seconds: 0,
            },
            timerName: 'Start',
        });
        this.state.game.combatants.map(p => {
            p.active = false
            this.props.firebase.updatePlayer(p, this.state.lobbyNumber, p);
        })
        this.props.firebase.updateTime(this.state.lobbyNumber, 2, 0);
    }

    resetState = () => {
        this.setState({
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
            stagedPlayer: {
                staged: false,
                player: Player.create(),
                status: null,
            }
        })
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
                handleDialogRemoveClick: this.handleDialogRemoveClick,
                masterViewStagedPlayer: this.masterViewStagedPlayer,
                joinCachedLobby: this.joinCachedLobby,
                toggleMasterControl: this.toggleMasterControl,
                resetPlayers: this.resetPlayers,
            }}
        >{this.props.children}</Provider>
    }
}

const GameProvider = withFirebase(GameProviderBase);

export { MasterContext, GameProvider, Consumer as GameConsumer };


