// https://stackoverflow.com/a/39575124
import { Board, Engine } from './Logic/baghchal';

function ai(boardpgn) {
  const board = new Board(boardpgn);
  if (board.next_turn === 'G') {
    const e = new Engine(5);
    let move = e.get_best_move(board);
    if (move[0] === 0) {
      move = [board.possible_moves()[0], move[1]];
      if (board.possible_moves().length === 0) {
        return;
      }
    }
    board.move(move[0]);
    return board.pgn;
  }
}

addEventListener('message', (event) => {
  postMessage(ai(event.data));
});

