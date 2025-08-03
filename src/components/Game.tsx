import { useCallback, useEffect, useState } from "react";
import Board from "./Board";
import type { State } from "../constants";
import { calculateWinner } from "../utils";

export default function Game() {
    const [ history, setHistory ] = useState<State[][]>([Array(9).fill(null)]);
    const [ currentMove, setCurrentMove ] = useState(0);
    const [ isAIFirst, setIsAIFirst ] = useState(Math.random() > 0.5);

    const isXNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    const aiPlayer = isAIFirst ? 'X' : 'O';
    const humanPlayer = isAIFirst ? 'O' : 'X';
    
    const winner = calculateWinner(currentSquares);
    const isDraw = currentSquares.every(Boolean) && !winner;
    const isGameOver = winner !== null || isDraw;
    const isAITurn = (isXNext && aiPlayer === 'X') || (!isXNext && aiPlayer === 'O');

    const playAI = useCallback((squares: State[]) => {
        const emptyIndices = squares.reduce((acc, val, idx) => {
        if (val === null) acc.push(idx);
            return acc;
        }, [] as number[]);
        

        const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        const nextSquares = squares.slice();
        nextSquares[randomIndex] = aiPlayer;

        return nextSquares;
    }, [aiPlayer]);

    function playHuman(idx: number): void {
        if (isGameOver || currentSquares[idx] !== null || isAITurn) {
            return;
        }

        const nextSquares = currentSquares.slice();
        nextSquares[idx] = humanPlayer;
        
        setHistory([...history.slice(0, currentMove + 1), nextSquares]);
        setCurrentMove(currentMove + 1);
    }

    useEffect(() => {
        if (!isGameOver && isAITurn) {
            const aiTimeout = setTimeout(() => {
                const nextSquares = playAI(currentSquares);
                setHistory([...history.slice(0, currentMove + 1), nextSquares]);
                setCurrentMove(currentMove + 1);
            }, 500);

            return () => clearTimeout(aiTimeout);
        }
    }, [isAITurn, currentSquares, currentMove, isGameOver, history, playAI]);

    function jumpTo(nextMove: number) {
        setCurrentMove(nextMove);
    }

    function restart() {
        setHistory([Array(9).fill(null)]);
        setCurrentMove(0);
        setIsAIFirst(Math.random() > 0.5);
    }

    let status;
    if (winner) {
        status = `Winner: ${winner}`;
    } else if (isDraw) {
        status = 'Draw!';
    } else {
        status = `Next player: ${isXNext ? 'X' : 'O'}`;
    }

    const moves = history.map((_, move) => {
        const description = move > 0 ? `Go to move #${move}` : 'Go to game start';
        return (
        <li key={move} className="py-1">
            <button
            onClick={() => jumpTo(move)}
            className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
            {description}
            </button>
        </li>
        );
    });

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <h1 className="text-4xl font-bold mb-8 text-blue-400">Tic-Tac-Toe</h1>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                    <div className="text-3xl font-semibold text-gray-200 mb-4 text-center">{status}</div>
                    <Board
                        squares={currentSquares}
                        onPlay={playHuman}
                        disabled={isAITurn || isGameOver}
                    />
                </div>
                <div className="mt-8 md:mt-0 md:ml-8 flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-4">Game Controls</h2>
                    <ol className="list-none p-0 flex flex-col gap-2">
                        {moves}
                    </ol>
                    {isGameOver && (
                        <button
                        onClick={restart}
                        className="bg-red-600 hover:bg-red-500 text-white text-lg font-bold py-3 px-6 mt-4 rounded-lg transition-colors duration-200"
                        >
                            Restart
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}