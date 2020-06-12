import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

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

    getUser = () => this.auth.currentUser.uid;

    getStaged = (lobby) => this.db.ref(`games/${lobby}/staged`);

    doesLobbyExist = (lobby) => {
        let lobbyRef = this.gameLobby(lobby).once('value')
            .then(snapshot => {
                return snapshot.exists();
            });
        return lobbyRef;
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

    addPlayers = (array, lobby) => {
        for (let i = 0; i < array.length; i++) {
            this.db.ref(`games/${lobby}/combatants/${array[i].name}`).set({
                ...array[i]
            });
        }
    }

    checkStaged = (lobby) => {
        let stagedRef = this.getStaged(lobby).once('value')
            .then(snapshot => {
                return snapshot.exists();
            });
        return stagedRef;
    }

    addStaged = (lobby, player) => {
        this.db.ref(`games/${lobby}/staged/${player.name}`).set({
            ...player
        });
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
}

export default Firebase;