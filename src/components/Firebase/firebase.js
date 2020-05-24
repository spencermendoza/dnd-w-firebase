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

    asyncFunction = async function (room) {
        console.log('promise function called')
        var master
        const shit = await new Promise(resolve =>
            this.db.ref(`games/${room}/master`).once('value').then(snapshot => {
                master = snapshot.val()
            }))
        return master;
    }

    doesLobbyExist = (room) => {
        var ref = this.db.ref(`games/${room}`);
        return ref.once('value', function (snapshot) {
            console.log('am i working? ', snapshot.exists())
            return snapshot.exists();
        });
    }

    createNewGameLobby = (room) => {
        this.db.ref(`games/${room}`).set({
            master: this.getUser(),
            players: ['empty'],
        });
    }

    gameLobby = (room) => this.db.ref(`games/${room}/players`);

    getUser = () => {
        return (this.auth.currentUser.uid)
    }

    addPlayers = (array, room) => {
        this.db.ref(`games/${room}/players`).set({
            ...array,
        });
    }
}

export default Firebase;