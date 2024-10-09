import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import './MemeCoinCard.css';

interface MemeCoinCardProps {
    address: string;
    logo: string;
    name: string;
    contentUri: string;
}

interface CoinMetadata {
    name: string;
    symbol: string;
    decimals: string;
    image: string;
}

const MemeCoinCard: React.FC<MemeCoinCardProps> = ({address, logo, name, contentUri}) => {
    const [metadata, setMetadata] = useState<CoinMetadata | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const response = await fetch(contentUri);
                if (!response.ok) {
                    throw new Error('Failed to fetch metadata');
                }
                const data = await response.json();
                setMetadata(data);
            } catch (err) {
                console.error('Error fetching metadata:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchMetadata();
    }, [contentUri]);

    const displayName = metadata?.name || name;
    const displayImage = metadata?.image || logo;

    return (
        <Link to={`/jetton/${address}`} className="memecoin-card">
            <img src={displayImage} alt={`${displayName} logo`} className="memecoin-logo"/>
            <div className="memecoin-info">
                <h3>{displayName}</h3>
                <p>{address}</p>
                {error && <p>(wrong metadata)</p>}
            </div>
        </Link>
    );
};

export default MemeCoinCard;