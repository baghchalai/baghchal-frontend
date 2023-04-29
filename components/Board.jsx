import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import images from '../assets';
import { Board, Engine } from '../Logic/baghchal';
import GameStatus from './GameStatus';
import PlayerCard from './PlayerCard';

const BaghchalBoard = ({ playerOne = '', playerTwo = '', botIs = '' }) => {
  const [board, setBoard] = useState(new Board());
  const [virtualBoard, setVirtualBoard] = useState(0);
  const [selectedMoveIndex, setSelectedMoveIndex] = useState();
  const [highlightBaghMove, setHighlightBaghMove] = useState([]);
  const { width, height } = useWindowSize();
  const [botCalculating, setBotCalculaing] = useState(false);

  let beingDragged;
  function handleDrag(e) {
    beingDragged = e.target;
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
        board.pure_move(`${initialRow}${initialColumn}${finalRow}${finalColumn}`);
        setBoard(new Board(board.pgn));
      } else {
        console.log(board.next_turn);
        console.log(board);
      }
    }
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

  function ai() {
    setBotCalculaing(true);
    const level = playerTwo.username === 'bot' ? playerTwo.level : 2;
    const e = new Engine(level);
    let move = e.get_best_move(board);
    if (move[0] === 0) {
      move = [board.possible_moves()[0], move[1]];
      if (board.possible_moves().length === 0) {
        return;
      }
    }
    board.move(move[0]);
    setBoard(new Board(board.pgn));
    setBotCalculaing(false);
  }

  useEffect(() => {
    if (board.is_game_over()) {
      setVirtualBoard(new Board(board.pgn));
    }
    if (board.next_turn === botIs) {
      ai();
    }
  }, [board]);

  return (
    <div className="flex w-full justify-around h-screen items-center">
      {virtualBoard === 0
        ? (
          <div className="flex flex-col justify-around">
            {botCalculating
              ? (
                <div className="flex gap-3">
                  <PlayerCard player={playerTwo} botIS={botIs} />
                  <Image className="bg-white rounded-md" src={images.loadingDots} height={30} width={40} />
                </div>
              ) : (
                <PlayerCard player={playerTwo} botIS={botIs} />
              )}
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
            <PlayerCard player={playerOne} botIS={botIs} />
          </div>
        )

        : (
          <div className="flex justify-center items-center h-[625px] w-[625px]">
            <div className="relative board h-[600px] w-[600px] flex flex-col justify-between">
              <Image className="absolute" src={images.board} alt="board-image" />
              {virtualBoard.board.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-between">
                  {row.map((val, colIndex) => (
                    val === 0
                      ? highlightBaghMove.some((subArr) => JSON.stringify(subArr) === JSON.stringify([rowIndex, colIndex]))
                        ? <div key={`${rowIndex}${colIndex}`} id={`place ${rowIndex}-${colIndex}`} className="h-[34px] w-[34px] rounded-full bg-green-500 z-10 hover:bg-white hover:cursor-pointer">{rowIndex}{colIndex}</div>
                        : <div key={`${rowIndex}${colIndex}`} id={`place ${rowIndex}-${colIndex}`} className="h-[34px] w-[34px] rounded-full bg-red-500 z-10 hover:bg-white hover:cursor-pointer">{rowIndex}{colIndex}</div>

                      : val.constructor.name === 'Goat' ? <div key={`${rowIndex}${colIndex}`} className="h-[34px] w-[34px] rounded-full z-10 scale-125 hover:bg-white hover:cursor-pointer"><Image id="goat" className={`${rowIndex}-${colIndex}`} src={images.goat} alt="goat-image" /></div>
                        : <div key={`${rowIndex}${colIndex}`} className="h-[34px] w-[34px] rounded-full z-10 scale-125 hover:bg-white hover:cursor-pointer"> <Image id="bagh" className={`${rowIndex}-${colIndex}`} src={images.bagh} alt="bagh-image" /></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      {board.is_game_over() && (
      <Confetti
        width={width}
        height={height}
        numberOfPieces={200}
        tweenDuration={5}
      />
      )}
      <GameStatus board={board} selectedMoveIndex={selectedMoveIndex} setSelectedMoveIndex={setSelectedMoveIndex} setBoard={setBoard} setVirtualBoard={setVirtualBoard} changeBoardToClickedPgn />
    </div>
  );
};

export default BaghchalBoard;
