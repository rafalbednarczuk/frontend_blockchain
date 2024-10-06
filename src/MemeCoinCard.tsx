import React from 'react';
import {Link} from 'react-router-dom';
import './MemeCoinCard.css';

interface MemeCoinCardProps {
    address: string;
    logo: string;
    name: string;
}

const MemeCoinCard: React.FC<MemeCoinCardProps> = ({address, logo, name}) => {
    return (
        <Link to={`/${address}`} className="memecoin-card">
            <img src={logo} alt={`${name} logo`} className="memecoin-logo"/>
            <div className="memecoin-info">
                <h3>{name}</h3>
                <p>{address}</p>
            </div>
        </Link>
    );
};

export default MemeCoinCard;