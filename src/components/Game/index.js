import React, { Component, useState } from 'react';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';

const GamePage = () => {
    const [selection, setSelection] = useState('');

    const testingButtons = event => {
        console.log(selection);

        setSelection(event.target.textValue);
        console.log(selection);
    }

    return (
        <div>
            <button onClick={() => testingButtons()}>
                Join existing game:
            </button>
            <button onClick={() => testingButtons()}>
                Create a new game:
            </button>
        </div>
    )
}







const JoinGame = () => {
    const [roomCode, setCode] = useState(0);
}







export default withFirebase(GamePage);

