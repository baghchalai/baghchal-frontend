import React, { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import axios from 'axios';
import { useRouter } from 'next/router';
import images from '../assets';
import { Board } from '../Logic/baghchal';
import GameStatus from './GameStatus';
import PlayerCard from './PlayerCard';
import { useAuthContext } from '../hooks/useAuthContext';
import Modal from './Modal';
import Button from './Button';

const BaghchalBoard = ({ playerOne = '', playerTwo = '', botIs = '', level = 5 }) => {
  const { token } = useAuthContext();
  const router = useRouter();
  const [board, setBoard] = useState(new Board());
  const [virtualBoard, setVirtualBoard] = useState(0);
  const [selectedMoveIndex, setSelectedMoveIndex] = useState();
  const [, setShowResult] = useState(false);
  const [highlightBaghMove, setHighlightBaghMove] = useState([]);
  const { width, height } = useWindowSize();
  const [botCalculating, setBotCalculaing] = useState(false);

  const workerRef = useRef();

  useEffect(() => {
    workerRef.current = new Worker(new URL('../worker.js', import.meta.url));
    workerRef.current.onmessage = (event) => { setVirtualBoard(0); setBoard(new Board(event.data)); setBotCalculaing(false); };
    return () => {
      workerRef.current?.terminate();
    };
  }, [board.board]);

  const handleWork = useCallback(async () => {
    if (board.next_turn === botIs) {
      setBotCalculaing(true);
      setVirtualBoard(new Board(board.pgn));
      workerRef.current?.postMessage({ pgn: board.pgn, level });
    }
  }, [board.board]);

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

  // function ai() {
  //   setBotCalculaing(true);
  //   const level = playerTwo.username === 'bot' ? playerTwo.level : 2;
  //   const e = new Engine(level);
  //   let move = e.get_best_move(board);
  //   if (move[0] === 0) {
  //     move = [board.possible_moves()[0], move[1]];
  //     if (board.possible_moves().length === 0) {
  //       return;
  //     }
  //   }
  //   board.move(move[0]);
  //   setBoard(new Board(board.pgn));
  //   setBotCalculaing(false);
  // }

  useEffect(() => {
    if (board.is_game_over() && botIs !== '') {
      setVirtualBoard(new Board(board.pgn));
      axios({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_BACKEND_API}/game/`,
        headers: {
          Authorization: `JWT ${token.access}`,
        },
        data: {
          user: token.id,
          pgn: board.pgn,
          played_as: botIs === 'B' ? 'goat' : 'bagh',
        },
      }).then((res) => {
        console.log(res);
      }).catch((err) => console.log(err));
      setShowResult(true);
    }
    if (board.next_turn === botIs) {
      handleWork();
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
                          ? <div key={`${rowIndex}${colIndex}`} id={`place ${rowIndex}-${colIndex}`} className="h-[34px] w-[34px] rounded-full bg-green-500 z-10 hover:bg-white hover:cursor-pointer" onDragOver={handleDragOver} onDrop={handleDrop} onClick={handlePositionClick} />
                          : <div key={`${rowIndex}${colIndex}`} id={`place ${rowIndex}-${colIndex}`} className="h-[34px] w-[34px] rounded-full bg-red-500 z-10 hover:bg-white hover:cursor-pointer" onDragOver={handleDragOver} onDrop={handleDrop} onClick={handlePositionClick} />

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
                {virtualBoard.board.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex justify-between">
                    {row.map((val, colIndex) => (
                      val === 0
                        ? highlightBaghMove.some((subArr) => JSON.stringify(subArr) === JSON.stringify([rowIndex, colIndex]))
                          ? <div key={`${rowIndex}${colIndex}`} id={`place ${rowIndex}-${colIndex}`} className="h-[34px] w-[34px] rounded-full bg-green-500 z-10 hover:bg-white hover:cursor-pointer" />
                          : <div key={`${rowIndex}${colIndex}`} id={`place ${rowIndex}-${colIndex}`} className="h-[34px] w-[34px] rounded-full bg-red-500 z-10 hover:bg-white hover:cursor-pointer" />

                        : val.constructor.name === 'Goat' ? <div key={`${rowIndex}${colIndex}`} className="h-[34px] w-[34px] rounded-full z-10 scale-125 hover:bg-white hover:cursor-pointer"><Image id="goat" className={`${rowIndex}-${colIndex}`} src={images.goat} alt="goat-image" /></div>
                          : <div key={`${rowIndex}${colIndex}`} className="h-[34px] w-[34px] rounded-full z-10 scale-125 hover:bg-white hover:cursor-pointer"> <Image id="bagh" className={`${rowIndex}-${colIndex}`} src={images.bagh} alt="bagh-image" /></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <PlayerCard player={playerOne} botIS={botIs} />
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
      {board.is_game_over() && (
        <Modal
          header="Game Over"
          body={(
            <div className="mt-16">
              {/* <p className="font-poppins dark:text-white text-baghchal-black-1 font-semibold text-xl">Profile Picture</p> */}
              <div className="mt-4 w-full flex justify-center">
                {board.winner() === botIs ? 'You Loose' : 'You Won'}
              </div>
            </div>
          )}
          footer={(
            <div className="flex flex-row sm:flex-col ">
              <Button
                btnName="Done"
                classStyles="mr-5 sm:mr-0 rounded-xl"
                handleClick={() => { router.push('/play'); }}
              />
            </div>
        )}
          // handleClose={() => { setUpdateModal(false); }}
        />
      )}
      <GameStatus board={board} selectedMoveIndex={selectedMoveIndex} setSelectedMoveIndex={setSelectedMoveIndex} setBoard={setBoard} setVirtualBoard={setVirtualBoard} changeBoardToClickedPgn />
    </div>
  );
};

export default BaghchalBoard;
