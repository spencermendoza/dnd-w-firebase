import React from 'react';
import '../../styles.css';

const Landing = () => (
    <div id='introDiv'>
        <p id='intro'>
            Welcome to the Dungeons and Dragons initiative tracking tool. This app utilizes Firebase as a real-time backend that will allow multiple users to log in to
            a Dungeons and Dragons campaign and keep track of their initiative order in real time. The app pushes the list of characters and their stats, a turn timer (for those players who don't
            know what they are going to do on their turn), and any changes made on the list to all users currently logged into the campaign lobby. The app keeps track of which user created each campaign lobby and assigns
            them the roll of Dungeon Master. This means that the user who is Dungeon Master will be able to add and delete characters from the initiative list and start and stop the turn timer. Players who are not the Dungeon
            Master will only be able to add players to the lobby after the Dungeon Master looks over their submitted character and approves it. The app also logs which character goes with which player so that players will
            only be able to edit the characters that they made. To fully test out the different features between Dungeon Masters and players, log in and join lobby number 999 where I have included a toggle switch
            to allow users to quickly switch back and forth between Dungeon Master view and player view. This app is styled for both mobile devices and desktop computers to allow ease of use for Dungeons and Dragons parties
            who play online or in person. Thanks for looking!
        </p>
    </div>
);

export default Landing;