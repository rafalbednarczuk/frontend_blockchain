import React, {StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom';
import App from './App';
import './index.css';
import {TonConnectUIProvider} from '@tonconnect/ui-react';

// this manifest is used temporarily for development purposes
const manifestUrl = 'https://gist.githubusercontent.com/rafalbednarczuk/62b673fcf9f648362ba31c7caf209981/raw/d227be8bfb7ba2a87ca53ac15e4c7f5f9807e366/gistfile1.txt';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
        <TonConnectUIProvider manifestUrl={manifestUrl}>
            <Router>
                <App/>
            </Router>
        </TonConnectUIProvider>
    </StrictMode>
)