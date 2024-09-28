import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {TonConnectUIProvider} from "@tonconnect/ui-react"

const manifestUrl = "https://rafalbednarczuk.github.io/my_first_contract/tonconnect-manifest.json";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <TonConnectUIProvider manifestUrl={manifestUrl}>
            <App/>
        </TonConnectUIProvider>
    </StrictMode>,
)
