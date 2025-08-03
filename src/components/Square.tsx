export default function Square({ value, onSquareClick, disabled }: { value: string | null; onSquareClick: () => void, disabled: boolean }) {
  const cursorStyle = value === null ? 'cursor-pointer' : 'cursor-default';
  const hoverStyle = value === null ? 'hover:bg-gray-700 hover:text-white' : '';

  return (
    <button
      className={`
        w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 
        bg-gray-800 text-white text-4xl font-bold 
        rounded-lg transition-colors duration-200 
        flex items-center justify-center 
        shadow-lg
        ${cursorStyle}
        ${hoverStyle}
      `}
      onClick={onSquareClick}
      disabled={disabled}
    >
      {value}
    </button>
  );
}
