import React from 'react';
import '../../styles.css';

import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) => (
    <button type='button' id='signOut' onClick={firebase.doSignOut}>
        Sign Out
    </button>
);

export default withFirebase(SignOutButton);