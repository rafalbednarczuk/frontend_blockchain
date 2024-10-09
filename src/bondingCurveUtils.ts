// Define types for our parameters and return values
type TokenAmount = number;
type Price = number;

interface CurveParameters {
    totalSupply: TokenAmount;
    startPrice: Price;
    endPrice: Price;
    curveExponent?: number;
}

/**
 * Calculates the current price of a token based on the number of tokens sold.
 * @param tokensSold - The number of tokens that have been sold
 * @param params - The parameters defining the bonding curve
 * @returns The current price of the token
 */
function calculatePrice(tokensSold: TokenAmount, params: CurveParameters): Price {
    const { totalSupply, startPrice, endPrice, curveExponent = 3 } = params;
    const x: number = tokensSold / totalSupply;
    const priceRange: Price = endPrice - startPrice;
    return startPrice + priceRange * Math.pow(x, curveExponent);
}

/**
 * Calculates the cost of purchasing a specific amount of tokens.
 * @param tokensToBuy - The number of tokens to purchase
 * @param currentTokensSold - The number of tokens already sold
 * @param params - The parameters defining the bonding curve
 * @returns The cost of the purchase
 */
function calculatePurchaseCost(
    tokensToBuy: TokenAmount,
    currentTokensSold: TokenAmount,
    params: CurveParameters
): Price {
    const { totalSupply, startPrice, endPrice, curveExponent = 3 } = params;
    const x1: number = currentTokensSold / totalSupply;
    const x2: number = (currentTokensSold + tokensToBuy) / totalSupply;
    const priceRange: Price = endPrice - startPrice;

    const integralAtX = (x: number): number => {
        return startPrice * x + (priceRange * Math.pow(x, curveExponent + 1)) / (curveExponent + 1);
    };

    const cost: Price = totalSupply * (integralAtX(x2) - integralAtX(x1));
    return cost;
}
