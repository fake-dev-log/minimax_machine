import { DEPTH_BOUND, type State } from "../constants";
import { calculateWinner } from "../utils";
import { evaluate } from "./minimax";

function maximizeAB(isAIFirst: boolean, currentState: State[], A: number, B: number, depth: number, nodesExplored: { count: number }): number {
    nodesExplored.count++;
    const winner = calculateWinner(currentState);
    const isDraw = !winner && currentState.every(Boolean);
    
    const aiPlayer = isAIFirst ? 'X' : 'O';

    if (winner !== null) {
        return winner === aiPlayer ? Infinity : -Infinity;
    }
    if (isDraw) {
        return 0;
    }
    if (depth >= DEPTH_BOUND) {
        return evaluate(isAIFirst, currentState);
    }

    let maxValue = -Infinity;
    const emptyIndices = currentState.reduce((acc, val, idx) => val === null ? [...acc, idx] : acc, [] as number[]);

    for (const idx of emptyIndices) {
        const possibleMove = currentState.slice();
        possibleMove[idx] = aiPlayer;
        const value = minimizeAB(isAIFirst, possibleMove, A, B, depth + 1, nodesExplored);

        maxValue = Math.max(maxValue, value);
        if (B <= maxValue) {
            return maxValue;
        }
        A = Math.max(A, maxValue);
    }

    return maxValue;
}

function minimizeAB(isAIFirst: boolean, currentState: State[], A: number, B: number, depth: number, nodesExplored: { count: number }): number {
    nodesExplored.count++;
    const winner = calculateWinner(currentState);
    const isDraw = !winner && currentState.every(Boolean);
    
    const aiPlayer = isAIFirst ? 'X' : 'O';

    if (winner !== null) {
        return winner === aiPlayer ? Infinity : -Infinity;
    }
    if (isDraw) {
        return 0;
    }
    if (depth >= DEPTH_BOUND) {
        return evaluate(isAIFirst, currentState);
    }

    const humanPlayer = isAIFirst ? 'O' : 'X';
    let minValue = Infinity;

    const emptyIndices = currentState.reduce((acc, val, idx) => val === null ? [...acc, idx] : acc, [] as number[]);

    for (const idx of emptyIndices) {
        const possibleMove = currentState.slice();
        possibleMove[idx] = humanPlayer;
        const value = maximizeAB(isAIFirst, possibleMove, A, B, depth + 1, nodesExplored);

        minValue = Math.min(minValue, value);
        if (A >= minValue) {
            return minValue;
        }
        B = Math.min(B, minValue);
    }

    return minValue;
}

export function minimaxAB(isAIFirst: boolean, currentState: State[]): { bestMove: number, nodesExplored: number } {
    let A = -Infinity;
    let B = Infinity;
    const nodesExplored = { count: 0 };

    const emptyIndices = currentState.reduce((acc, val, idx) => val === null ? [...acc, idx] : acc, [] as number[]);

    let bestMove = emptyIndices.length > 0 ? emptyIndices[0] : 0;

    for (const idx of emptyIndices) {
        const possibleMove = currentState.slice();
        possibleMove[idx] = isAIFirst ? 'X' : 'O';
        const value = minimizeAB(isAIFirst, possibleMove, A, B, 1, nodesExplored);

        if (value > A) {
            A = value;
            bestMove = idx;
        }
    }       

    return { bestMove, nodesExplored: nodesExplored.count };
}

