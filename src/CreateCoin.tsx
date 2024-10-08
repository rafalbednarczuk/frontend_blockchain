import React, {useState} from 'react';
import {useCoinLauncherContract} from './hooks/useCoinLauncher';
import {Info} from 'lucide-react';
import './CreateCoin.css';

const CreateCoin: React.FC = () => {
    const [metadataUrl, setMetadataUrl] = useState('');
    const [amount, setAmount] = useState('');
    const {launchJetton} = useCoinLauncherContract('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (launchJetton) {
            try {
                await launchJetton(amount, metadataUrl);
                alert('Jetton launched successfully!');
                setMetadataUrl('');
                setAmount('');
            } catch (error) {
                console.error('Error launching jetton:', error);
                alert('Failed to launch jetton. Please try again.');
            }
        }
    };

    const isFormValid = metadataUrl.trim() !== '' && amount.trim() !== '' && parseFloat(amount) > 0;

    return (
        <div className="create-coin-container">
            <h2 className="create-coin-title">Launch New Coin</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="metadataUrl">Link to JSON metadata</label>
                    <input
                        type="url"
                        id="metadataUrl"
                        value={metadataUrl}
                        onChange={(e) => setMetadataUrl(e.target.value)}
                        required
                        placeholder="https://example.com/metadata.json"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="amount">Amount of TON to initialize</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="0"
                        step="0.1"
                        required
                        placeholder="0"
                    />
                </div>
                <div className="form-info">
                    <span>
                        Minimum required: 0.2 TON
                        <Info size={16}/>
                    </span>
                </div>
                <button type="submit" className="launch-button" disabled={!isFormValid}>
                    Launch Jetton
                </button>
            </form>
        </div>
    );
};

export default CreateCoin;