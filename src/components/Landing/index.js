import React from 'react';
import '../../styles.css';

const Landing = () => (
    <div id='introDiv'>
        <p id='intro'>
            This is the Landing page of my Dungeons and Dragons initiative app. Users will find themselves here when they first load up the app.
            This app utilizes Firebase as a real-time backend that will allow multiple users to log in to a DnD campaign and keep track of their initiative
            order in real time. It pushes damage changes, the current player's turn, and any other changes to each player's screen as all these changes are made.
        </p>
    </div>
);

export default Landing;