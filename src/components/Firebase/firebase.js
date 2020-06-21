import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { FAKE_PLAYERS } from '../Game/PLAYER/playerHelpers';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

class Firebase {
    constructor() {
        app.initializeApp(config);

        this.auth = app.auth();
        this.db = app.database();
    }

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);

    user = uid => this.db.ref(`users/${uid}`);

    users = () => this.db.ref('users');

    //GAME DATABASE FUNCTIONS

    gameLobby = (lobby) => this.db.ref(`games/${lobby}`);

    gamePlayers = (lobby) => this.db.ref(`games/${lobby}/combatants`);

    getStaged = (lobby) => this.db.ref(`games/${lobby}/staged`);

    getUser = () => {
        if (this.auth.currentUser) {
            return this.auth.currentUser.uid;
        } else {
            return null;
        }
    }

    doesLobbyExist = (lobby) => {
        let lobbyRef = this.gameLobby(lobby).once('value')
            .then(snapshot => {
                return snapshot.exists();
            });
        return lobbyRef;
    }

    checkStaged = (lobby) => {
        let stagedRef = this.getStaged(lobby).once('value')
            .then(snapshot => {
                return snapshot.exists();
            });
        return stagedRef;
    }

    createNewGameLobby = (newGame) => {
        this.db.ref(`games/${newGame.lobbyNumber}`).set({
            lobbyNumber: newGame.lobbyNumber,
            master: newGame.master,
            minutes: newGame.minutes,
            seconds: newGame.seconds,
            staged: newGame.staged,
        });
        this.addPlayers(newGame.combatants, newGame.lobbyNumber);
    }

    resetLobby = (list) => {
        for (let i = 0; i < list.length; i++) {
            this.db.ref(`games/999/combatants/${list[i].name}`).set({
                ...list[i]
            })
        }
    }

    addPlayers = (array, lobby) => {
        for (let i = 0; i < array.length; i++) {
            this.db.ref(`games/${lobby}/combatants/${array[i].name}`).set({
                ...array[i]
            });
        }
    }

    addStaged = (lobby, player, status, playerOwner) => {
        this.db.ref(`games/${lobby}/staged/`).set({
            status,
        });
        this.db.ref(`games/${lobby}/staged/player`).set({
            ...player,
        });
    }

    removeStaged = (lobby) => {
        this.db.ref(`games/${lobby}/staged`).remove();
    }

    updatePlayer = (updatedPlayer, lobby, oldPlayer) => {
        this.db.ref(`games/${lobby}/combatants/${oldPlayer.name}`).remove();
        this.db.ref(`games/${lobby}/combatants/${updatedPlayer.name}`).set(updatedPlayer);
    }

    removePlayer = (lobby, player) => {
        this.db.ref(`games/${lobby}/combatants/${player.name}`).remove();
    }

    updateTime = (lobby, minutes, seconds) => {
        this.db.ref(`games/${lobby}/minutes`).set(minutes);
        this.db.ref(`games/${lobby}/seconds`).set(seconds);
    }

    updateMaster = (uid) => {
        this.db.ref(`games/999/master`).set(uid)
    }
}

export default Firebase;