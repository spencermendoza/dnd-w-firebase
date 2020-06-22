import React from 'react';
import '../../styles.css';

const Landing = () => (
    <div id='introDiv'>
        <p id='intro'>
            This is the Landing page of the Dungeons and Dragons initiative app. Users will find themselves here when they first load up the app.
            This app utilizes Firebase as a real-time backend that will allow multiple users to log in to a DnD campaign and keep track of their initiative
            order in real time. It pushes damage changes, the current player's turn, and any other changes to each player's screen as all these changes are made.
            To better test the app I have added an extra lobby '999' that includes a toggle switch which will allow users to toggle Dungeon Master mode on or off. Once you have made
            an account, click on 'Join an existing game' and then type in '999' to test the app. Thanks for looking!
        </p>
    </div>
);

export default Landing;