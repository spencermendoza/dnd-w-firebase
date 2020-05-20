import React from 'react';

import { withAuthorization } from '../Session';

import GamePage from '../Game';

const HomePage = () => (
    <div>
        <h1>This is the Home Page!</h1>
        <p>This page is accessible by every signed in user.</p>
        <GamePage />
    </div>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);