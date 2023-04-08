import React, { useState } from 'react';
import Image from 'next/image';
import images from '../assets';

const Board = () => {
  const [board, setBoard] = useState([
    [0, 0, 'G', 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 'T', 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);

  return (
    <div className="flex justify-center items-center h-[625px] w-[625px] bg-teal-500">
      <div className="relative board h-[600px] w-[600px] flex flex-col justify-between">
        <Image className="absolute" src={images.board} alt="board-image" />
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-between">
            {row.map((val, colIndex) => (
              val === 0
                ? <div key={`${rowIndex}${colIndex}`} className="h-[34px] w-[34px] rounded-full bg-red-500 z-10 hover:bg-white hover:cursor-pointer">{rowIndex}{colIndex}</div>
                : val === 'G' ? <div key={`${rowIndex}${colIndex}`} className="h-[34px] w-[34px] rounded-full z-10 scale-125 hover:bg-white hover:cursor-pointer"> <Image src={images.goat} alt="goat-image" /></div>
                  : <div key={`${rowIndex}${colIndex}`} className="h-[34px] w-[34px] rounded-full z-10 scale-125 hover:bg-white hover:cursor-pointer"> <Image src={images.bagh} alt="bagh-image" /></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
