import React, { useState } from 'react';
import Image from 'next/image';
import images from '../assets';
import { Bagh, Board, Goat } from '../Logic/baghchal';

const BaghchalBoard = () => {
//   const b = new Board();
  const [board, setBoard] = useState(new Board());

  let beingDragged;
  function handleDrag(e) {
    beingDragged = e.target;
    // b.move('G22');
    // const newBoard = b;
    // console.log(newBoard);
    // setBoard({ ...newBoard });
  }

  function handleDrop(e) {
    const [initialRow, initialColumn] = beingDragged.className.split('-');
    // console.log(initialRow, initialColumn);
    const [finalRow, finalColumn] = e.target.id.split(' ')[1].split('-');
    // console.log(finalRow, finalColumn);

    if (beingDragged.id === 'goat') {
      if (board.goats_placed < 20) {
        // Show notification that all goat should be placed first before you can drag them
        console.log('Cannot move goat');
      }
    }

    if (beingDragged.id === 'bagh') {
      console.log('bagh dragg');
      if (board.next_turn === 'B') {
        console.log('Baghhh');
        board.move(`B${initialRow}${initialColumn}${finalRow}${finalColumn}`);
        // const newBoard = board;
        // setBoard({ ...newBoard });
        // console.log(board,.pgn);
        // console.log('--------');
        // console.log(board);
        setBoard(new Board(board.pgn));
      } else {
        console.log(board.next_turn);
        console.log(board);
      }
    }

    // const newboard = [...board];
    // newboard[initialRow][initialColumn] = 0;
    // if (beingDragged.id === 'goat') {
    //   newboard[finalRow][finalColumn] = 'G';
    // } else if (beingDragged.id === 'bagh') {
    //   newboard[finalRow][finalColumn] = 'T';
    // }
    // setBoard(newboard);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handlePositionClick(e) {
    e.preventDefault();
    if (board.next_turn === 'G' && board.goats_placed < 20) {
      console.log(board);
      board.move(`G${e.target.id.split(' ')[1].split('-').join('')}`);
      //   console.log(board);
      //   console.log({ ...board });
      //   const newBoard = { ...board };
      //   setBoard({board, ...newBoard });
      //   console.log(board);
      //   const newBoard = new Board(board.pgn);
      console.log('*****');
      //   console.log(new Bagh(board.pgn));
      console.log('*****');
      setBoard(new Board(board.pgn));
    }
  }

  return (
    <div className="flex justify-center items-center h-[625px] w-[625px] bg-teal-500">
      <div className="relative board h-[600px] w-[600px] flex flex-col justify-between">
        <Image className="absolute" src={images.board} alt="board-image" />
        {board.board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-between">
            {row.map((val, colIndex) => (
              val === 0
                ? <div key={`${rowIndex}${colIndex}`} id={`place ${rowIndex}-${colIndex}`} className="h-[34px] w-[34px] rounded-full bg-red-500 z-10 hover:bg-white hover:cursor-pointer" onDragOver={handleDragOver} onDrop={handleDrop} onClick={handlePositionClick}>{rowIndex}{colIndex}</div>
                : val.constructor.name === 'Goat' ? <div key={`${rowIndex}${colIndex}`} className="h-[34px] w-[34px] rounded-full z-10 scale-125 hover:bg-white hover:cursor-pointer" draggable onDragStart={handleDrag}><Image id="goat" className={`${rowIndex}-${colIndex}`} src={images.goat} alt="goat-image" /></div>
                  : <div key={`${rowIndex}${colIndex}`} className="h-[34px] w-[34px] rounded-full z-10 scale-125 hover:bg-white hover:cursor-pointer" draggable onDragStart={handleDrag}> <Image id="bagh" className={`${rowIndex}-${colIndex}`} src={images.bagh} alt="bagh-image" /></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BaghchalBoard;
