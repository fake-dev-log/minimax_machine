import type { State } from "../constants";
import Square from "./Square";

export default function Board({ squares, onPlay, disabled }: { squares: State[], onPlay: (idx: number) => void, disabled: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-2 p-4 bg-gray-900 rounded-xl shadow-2xl">
      {squares.map((square, idx) => (
        <Square
          key={idx}
          value={square}
          onSquareClick={() => onPlay(idx)}
          disabled={disabled || square !== null}
        />
      ))}
    </div>
  );
}
