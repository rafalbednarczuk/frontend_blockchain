import React from 'react';
import MemeCoinCard from './MemeCoinCard';
import './MemeCoinList.css';

// Generate a fake TON address
const generateFakeAddress = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return 'EQ' + Array(44).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
};

// Generate fake meme coins
const generateMemeCoins = (count: number) => {
    const fakeCoins = Array(count - 1).fill(0).map((_, index) => ({
        address: generateFakeAddress(),
        name: `MemeCoin${index + 2}`,
        logo: `https://picsum.photos/200/200?random=${index + 2}` // Using picsum for random images
    }));

    return [
        {
            address: "kQCIby2FX-vf_n1hdXmdZ-U4rEWX1hW7JIUhftXOCylTswwg",
            name: "NCOIN1",
            logo: "https://as1.ftcdn.net/jpg/01/94/21/08/220_F_194210826_gXu9eWX8NSOzDovlnSqtITsCd9p3jJ8G.jpg"
        },
        {
            address: "kQDZ8UHtEg8QelfX8CZD1j63INW1FazL5jJWE_LqxCNwL0DV",
            name: "DUPCoin30",
            logo: "https://i1.sndcdn.com/artworks-WL8TnfYG5XrRCMRM-5IjLig-t500x500.jpg"
        },
        ...fakeCoins
    ];
};

const memeCoins = generateMemeCoins(20);

const MemeCoinList: React.FC = () => {
    return (
        <div className="memecoin-list">
            <h2>Meme Coins</h2>
            {memeCoins.map((coin) => (
                <MemeCoinCard key={coin.address} {...coin} />
            ))}
        </div>
    );
};

export default MemeCoinList;