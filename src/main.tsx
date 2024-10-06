import React, {StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom';
import App from './App';
import './index.css';
import {TonConnectUIProvider} from '@tonconnect/ui-react';

// this manifest is used temporarily for development purposes
const manifestUrl = 'https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
        <TonConnectUIProvider manifestUrl={manifestUrl}>
            <Router>
                <App/>
            </Router>
        </TonConnectUIProvider>
    </StrictMode>
)