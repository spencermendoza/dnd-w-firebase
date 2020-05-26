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

    doesLobbyExist = (room) => {
        let lobbyRef = this.gameLobby(room).once('value')
            .then(snapshot => {
                return snapshot.exists();
            });
        return lobbyRef;
    }

    createNewGameLobby = (newGame) => {
        this.db.ref(`games/${newGame.lobbyNumber}`).set({
            lobbyNumber: newGame.lobbyNumber,
            master: newGame.master,
        });
        this.addPlayers(newGame.combatants, newGame.lobbyNumber);
    }

    gameLobby = (room) => this.db.ref(`games/${room}`);

    gamePlayers = (room) => this.db.ref(`games/${room}/combatants`);

    getUser = () => this.auth.currentUser.uid;

    addPlayers = (array, room) => {
        this.db.ref(`games/${room}/combatants`).set({
            ...array,
        });
    }
}

export default Firebase;