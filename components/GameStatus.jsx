import React from 'react';
import Image from 'next/image';
import Button from './Button';
import StatusCard from './StatusCard';
import images from '../assets';
import { Board } from '../Logic/baghchal';

const GameStatus = ({ board, selectedMoveIndex, setSelectedMoveIndex, setBoard, setVirtualBoard }) => {
  function changeBoardToClickedPgn(val) {
    console.log(board.pgn.split(val)[0] + val);
    // console.log(board.moves);
    // console.log(val);

    if (board.moves.at(-1) === val) {
      setVirtualBoard(0);
      setSelectedMoveIndex(null);
    } else {
      setSelectedMoveIndex(board.moves.indexOf(val));
      setVirtualBoard(new Board(board.pgn.split(val)[0] + val));
    }
  }

  return (
    <div className="bg-status-bg-dark p-7 w-2/5 my-12 h-4/5">
      {/* <div>Status:</div> */}
      <div className="flex justify-center mb-2">
        <div className="flex items-center bg-red-500 w-36 p-2 rounded-md justify-center">
          <div className="font-bold text-lg">Turn :</div>
          {board.next_turn === 'G' ? <Image src={images.goat} alt="goat-image" height={50} /> : <Image src={images.bagh} alt="tiger-image" height={50} /> }
        </div>
      </div>
      <div className="flex gap-2 justify-between">
        <StatusCard name="Goats Captured" value={board.goats_captured} colorStyle="border-red-500" />
        <StatusCard name="Bagh Trapped" value={board.baghs_trapped} colorStyle="border-red-500" />
        <StatusCard name="Goats Placed" value={board.goats_placed} colorStyle="border-red-500" />
      </div>

      {/* <div>winner {board.is_game_over()}</div> */}
      {board.is_game_over() ? <div>winner {board.winner()}</div> : <div>Not over</div>}
      {/* {!board.is_game_over() ?? <div>Game Not OVer</div>} */}
      {/* <div>fen {board.fen_count}</div> */}
      <br />
      <br />
      <div className="font-bold text-xl">Moves</div>
      <div className="flex flex-wrap m-2 gap-2 w-full h-2/5 overflow-y-scroll">
        {
      board.moves.map((value, index) => <div className={`p-0.5 px-2 text-xs font-medium text-black w-1/3 rounded-sm hover:cursor-pointer hover:bg-baghchal-gray-3 hover:text-white ${index === selectedMoveIndex ? 'bg-baghchal-gray-3 text-white' : 'bg-baghchal-gray-2'} ${(index === board.moves.length - 1 && selectedMoveIndex) && 'bg-red-500'}`} onClick={() => changeBoardToClickedPgn(value)}>{value}</div>)
      }
      </div>
      <Button classStyles="p-2 bg-red-500 rounded-sm" btnName="Restart" handleClick={() => { setVirtualBoard(0); setBoard(new Board()); }} />
    </div>
  );
};

export default GameStatus;
