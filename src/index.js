import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import * as serviceWorker from './serviceWorker';

import App from './components/App';
import Firebase, { FirebaseContext } from './components/Firebase';
import { GameProvider, MasterContext } from './components/Game/MasterContext';

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <GameProvider>
      <App />
    </GameProvider>
  </FirebaseContext.Provider>,
  document.getElementById('root'),
);

serviceWorker.unregister();
