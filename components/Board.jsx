import React, { useState } from 'react';
import Image from 'next/image';
import images from '../assets';
import { Board } from '../Logic/baghchal';
import Button from './Button';

const BaghchalBoard = () => {
//   const b = new Board();
  const [board, setBoard] = useState(new Board());
  const [highlightBaghMove, setHighlightBaghMove] = useState([]);

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
      } else {
        // if (finalColumn - initialColumn === 1 || finalColumn - initialColumn === -1 || finalRow - finalColumn === 1 || finalRow - finalColumn === -1) {
        board.move(`G${initialRow}${initialColumn}${finalRow}${finalColumn}`);
        // }
        setBoard(new Board(board.pgn));
      }
    }

    if (beingDragged.id === 'bagh') {
      console.log('bagh dragg');
      if (board.next_turn === 'B') {
        // if (finalColumn - initialColumn === 2 || finalColumn - initialColumn === -2 || finalRow - finalColumn === 2 || finalRow - finalColumn === -2) {
        //   board.move(`Bx${initialRow}${initialColumn}${finalRow}${finalColumn}`);
        // } else {
        //   board.move(`B${initialRow}${initialColumn}${finalRow}${finalColumn}`);
        // }
        board.pure_move(`${initialRow}${initialColumn}${finalRow}${finalColumn}`);
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
      setBoard(new Board(board.pgn));
    }
  }

  function handleBaghClick(e) {
    e.preventDefault();
    if (board.next_turn === 'B') {
      const temp = e.target.className.split('-');
      // console.log(temp[0]);
      console.log(board.board[temp[0]][temp[1]].valid_moves());
      // TODO:highlight the places where this bagh can be moved
      setHighlightBaghMove(board.board[temp[0]][temp[1]].valid_moves());
      // console.log(highlightBaghMove[0]);
      setTimeout(() => {
        setHighlightBaghMove([]);
      }, 3000);
    }
  }

  function changeBoardToClickedPgn(val) {
    console.log(board.pgn.split(val));
    // concept of virtual board
    setBoard({ ...board, board: new Board(board.pgn.split(val)[0]).board });
  }

  return (
    <div className="flex w-full justify-around items-center">

      <div className="flex justify-center items-center h-[625px] w-[625px]">
        <div className="relative board h-[600px] w-[600px] flex flex-col justify-between">
          <Image className="absolute" src={images.board} alt="board-image" />
          {board.board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-between">
              {row.map((val, colIndex) => (
                val === 0
                  ? highlightBaghMove.some((subArr) => JSON.stringify(subArr) === JSON.stringify([rowIndex, colIndex]))
                    ? <div key={`${rowIndex}${colIndex}`} id={`place ${rowIndex}-${colIndex}`} className="h-[34px] w-[34px] rounded-full bg-green-500 z-10 hover:bg-white hover:cursor-pointer" onDragOver={handleDragOver} onDrop={handleDrop} onClick={handlePositionClick}>{rowIndex}{colIndex}</div>
                    : <div key={`${rowIndex}${colIndex}`} id={`place ${rowIndex}-${colIndex}`} className="h-[34px] w-[34px] rounded-full bg-red-500 z-10 hover:bg-white hover:cursor-pointer" onDragOver={handleDragOver} onDrop={handleDrop} onClick={handlePositionClick}>{rowIndex}{colIndex}</div>

                  : val.constructor.name === 'Goat' ? <div key={`${rowIndex}${colIndex}`} className="h-[34px] w-[34px] rounded-full z-10 scale-125 hover:bg-white hover:cursor-pointer" draggable onDragStart={handleDrag}><Image id="goat" className={`${rowIndex}-${colIndex}`} src={images.goat} alt="goat-image" /></div>
                    : <div key={`${rowIndex}${colIndex}`} className="h-[34px] w-[34px] rounded-full z-10 scale-125 hover:bg-white hover:cursor-pointer" draggable onDragStart={handleDrag} onClick={handleBaghClick}> <Image id="bagh" className={`${rowIndex}-${colIndex}`} src={images.bagh} alt="bagh-image" /></div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-status-bg-dark w-2/5 h-2/3">
        <div>Status:</div>
        <br />
        <div>Current Turn - {board.next_turn}</div>
        {/* <div>pgn {board.pgn}</div> */}
        <div>Goat Captured - {board.goats_captured}</div>
        <div>BaghTrapped - {board.baghs_trapped}</div>
        <div>Goat Placed - {board.goats_placed}</div>
        {/* <div>winner {board.is_game_over()}</div> */}
        {board.is_game_over() ? <div>winner {board.winner()}</div> : <div>Not over</div>}
        {/* {!board.is_game_over() ?? <div>Game Not OVer</div>} */}
        {/* <div>fen {board.fen_count}</div> */}
        <br />
        <br />
        <div>Moves</div>
        {board.pgn.split(' ').map((v, i) => ((i + 1) % 2 === 1 ? <><span className="cursor-pointer" onClick={() => { changeBoardToClickedPgn(v); }}>{v}</span> <br /></> : <span>{v} </span>))}
        <br />
        <Button classStyles="p-2 bg-red-500 rounded-sm" btnName="Restart" handleClick={() => setBoard(new Board())} />
      </div>
    </div>
  );
};

export default BaghchalBoard;
