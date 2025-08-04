import { DEPTH_BOUND, LINES, type State } from "../constants";
import { calculateWinner } from "../utils";

function evaluate(isAIFirst: boolean, currentState: State[]): number {
    let possibleX = 0;
    let possibleO = 0;
    LINES.forEach(line => {
        const stateSet = new Set();
        line.forEach(idx => {
            const state = currentState[idx];
            if (state) stateSet.add(state);
        })
        
        if (stateSet.size !== 1) return;

        if (stateSet.has('O')) possibleO++;
        else possibleX++;
    })

    return isAIFirst ? possibleX - possibleO : possibleO - possibleX;
}

function maximize(isAIFirst: boolean, currentState: State[], depth: number): number {
    if (depth >= DEPTH_BOUND) {
        return evaluate(isAIFirst, currentState);
    }

    const aiPlayer = isAIFirst ? 'X' : 'O';
    const winner = calculateWinner(currentState);
    const isDraw = !winner && currentState.every(Boolean);

    if (winner === aiPlayer) {
        return Infinity;
    } else if (isDraw) {
        return 0;
    } else if (winner !== null && winner !== aiPlayer) {
        return -Infinity;
    }

    let maxValue = -Infinity;

    currentState.forEach((state, idx) => {
        if (state === null) {
           const possibleMove = currentState.slice();
            possibleMove[idx] = aiPlayer;
            const value = minimize(isAIFirst, possibleMove, depth + 1);
            if (value > maxValue) {
                maxValue = value;
            }
        }
    })

    return maxValue;
}

function minimize(isAIFirst: boolean, currentState: State[], depth: number): number {
    if (depth >= DEPTH_BOUND) {
        return evaluate(isAIFirst, currentState);
    }

    const aiPlayer = isAIFirst ? 'X' : 'O';
    const winner = calculateWinner(currentState);
    const isDraw = !winner && currentState.every(Boolean);

    if (winner === aiPlayer) {
        return Infinity;
    } else if (isDraw) {
        return 0;
    } else if (winner !== null && winner !== aiPlayer) {
        return -Infinity;
    }

    const humanPlayer = isAIFirst ? 'O' : 'X';
    let minValue = Infinity;

    currentState.forEach((state, idx) => {
        if (state === null) {
            const possibleMove = currentState.slice();
            possibleMove[idx] = humanPlayer;
            const value = maximize(isAIFirst, possibleMove, depth + 1);
            if (value < minValue) {
                minValue = value;
            }
        }
    })

    return minValue;
}

export function minmax(isAIFirst: boolean, currentState: State[]): number {
    const aiPlayer = isAIFirst ? 'X' : 'O';
    let maxValue = -Infinity;
    let bestMove = 0;

    currentState.forEach((state, idx) => {
        if (state === null) {
            const possibleMove = currentState.slice();
            possibleMove[idx] = aiPlayer;
            const value = minimize(isAIFirst, possibleMove, 1);
            if (value > maxValue) {
                maxValue = value;
                bestMove = idx;
            }
        }
    })

    return bestMove;
}