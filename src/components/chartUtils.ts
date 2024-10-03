import {UTCTimestamp} from 'lightweight-charts';

export function generateBitcoinLikeData(count: number) {
    const basePrice = 30000; // Starting price around $30,000
    const volatility = 0.02; // 2% volatility
    const meanReversion = 0.01; // 1% mean reversion factor

    const data: Array<{
        time: UTCTimestamp;
        open: number;
        high: number;
        low: number;
        close: number;
    }> = [];

    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start from midnight

    let prevClose = basePrice;

    for (let i = 0; i < count; i++) {
        const time = new Date(now.getTime() + i * 30 * 60000); // 30-minute intervals

        // Calculate the price change with mean reversion
        const randomChange = (Math.random() - 0.5) * 2 * volatility;
        const meanReversionChange = (basePrice - prevClose) / prevClose * meanReversion;
        const priceChange = prevClose * (randomChange + meanReversionChange);

        const open = prevClose;
        const close = open + priceChange;
        const high = Math.max(open, close) * (1 + Math.random() * 0.003);
        const low = Math.min(open, close) * (1 - Math.random() * 0.003);

        prevClose = close;

        data.push({
            time: (time.getTime() / 1000) as UTCTimestamp,
            open: Number(open.toFixed(2)),
            high: Number(high.toFixed(2)),
            low: Number(low.toFixed(2)),
            close: Number(close.toFixed(2)),
        });
    }

    return data;
}