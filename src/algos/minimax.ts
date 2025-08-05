import { DEPTH_BOUND, LINES, type State } from "../constants";
import { calculateWinner } from "../utils";

export function evaluate(isAIFirst: boolean, currentState: State[]): number {
    let score = 0;
    let aiPlayer: 'X' | 'O';
    let humanPlayer: 'X' | 'O';

    if (isAIFirst) {
        aiPlayer = 'X';
        humanPlayer = 'O';
    } else {
        aiPlayer = 'O';
        humanPlayer = 'X';
    }

    LINES.forEach(line => {
        let hasAI = false;
        let hasHuman = false;
        let emptyCount = 0;

        line.forEach(idx => {
            const square = currentState[idx];
            if (square === aiPlayer) {
                hasAI = true;
            } else if (square === humanPlayer) {
                hasHuman = true;
            } else {
                emptyCount++;
            }
        });

        if (hasAI && !hasHuman) {
            if (emptyCount === 1) score += 10;
            else if (emptyCount === 2) score += 1;
        } else if (hasHuman && !hasAI) {
            if (emptyCount === 1) score -= 10;
            else if (emptyCount === 2) score -= 1;
        }
    });
    
    return score;
}

function maximize(isAIFirst: boolean, currentState: State[], depth: number, nodesExplored: { count: number }): number {
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

    currentState.forEach((state, idx) => {
        if (state === null) {
            const possibleMove = currentState.slice();
            possibleMove[idx] = aiPlayer;
            const value = minimize(isAIFirst, possibleMove, depth + 1, nodesExplored);
            if (value > maxValue) {
                maxValue = value;
            }
        }
    })

    return maxValue;
}

function minimize(isAIFirst: boolean, currentState: State[], depth: number, nodesExplored: { count: number }): number {
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

    currentState.forEach((state, idx) => {
        if (state === null) {
            const possibleMove = currentState.slice();
            possibleMove[idx] = humanPlayer;
            const value = maximize(isAIFirst, possibleMove, depth + 1, nodesExplored);
            if (value < minValue) {
                minValue = value;
            }
        }
    })

    return minValue;
}

export function minimax(isAIFirst: boolean, currentState: State[]): { bestMove: number, nodesExplored: number } {
    const aiPlayer = isAIFirst ? 'X' : 'O';
    let maxValue = -Infinity;
    let bestMove = -1;
    const nodesExplored = { count: 0 };

    currentState.forEach((state, idx) => {
        if (state === null) {
            const possibleMove = currentState.slice();
            possibleMove[idx] = aiPlayer;
            const value = minimize(isAIFirst, possibleMove, 1, nodesExplored);
            if (bestMove === -1 || value > maxValue) {
                maxValue = value;
                bestMove = idx;
            }
        }
    })

    return { bestMove, nodesExplored: nodesExplored.count };
}