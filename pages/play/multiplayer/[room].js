import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import images from '../../../assets';
import { Board } from '../../../Logic/baghchal';
import { useAuthContext } from '../../../hooks/useAuthContext';
import GameStatus from '../../../components/GameStatus';
import { Button, Chat, Modal, Notification, PlayerCard } from '../../../components';

const BaghchalBoard = () => {
//   const b = new Board();
  const { token } = useAuthContext();
  const [virtualBoard, setVirtualBoard] = useState(0);
  const [selectedMoveIndex, setSelectedMoveIndex] = useState();
  const [board, setBoard] = useState(new Board());
  const [highlightBaghMove, setHighlightBaghMove] = useState([]);
  const [onBoarding, setOnBoarding] = useState(true);
  const [client, setClient] = useState(null);
  const [player2Id, setPlayer2Id] = useState(null);
  const [playerTwo, setPlayerTwo] = useState(null);
  const [playerOne, setPlayerOne] = useState(null);
  const [roomDetail, setRoomDetail] = useState(null);
  const [multiplayerObjectData, setMultiplayerObjectData] = useState(null);
  const router = useRouter();
  const [roomName, setRoomName] = useState();
  const [chatMessage, setChatMessage] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    if (!router.isReady) return;
    const { room } = router.query;
    setRoomName(room);
  }, [router.isReady]);

  useEffect(() => {
    if (token === null) return;
    if (token.username === undefined) return;
    if (roomName === undefined) return;

    // if the roomname is not active then return
    axios({
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_BACKEND_API}/game/room/${roomName}`,
      headers: {
        Authorization: `JWT ${token.access}`,
      },
    }).then((response) => {
      const resData = response.data;
      setRoomDetail(resData);
      if (resData.active === false) {
        const notify = () => toast('Room is not active.');
        notify();
        setTimeout(() => {
          router.push('/play', undefined, { shallow: false });
        }, 2000);
      }
    }).catch(() => {
      const notify = () => toast('Room is not available with this name.');
      notify();
      setTimeout(() => {
        router.push('/play', undefined, { shallow: false });
      }, 2000);
    });

    const { access, refresh, ...newPlayer } = token;
    setPlayerOne(newPlayer);
    setClient(new W3CWebSocket(`ws://127.0.0.1:8000/ws/chat/${roomName}/?username=${token.username}`));
    // setClient(new W3CWebSocket('ws://127.0.0.1:8000/ws/chat/baghchal/?username=kamal'));
  }, [roomName, token]);

  useEffect(() => {
    if (client != null) {
      client.onopen = () => {
        console.log('websocket client connected');

        // const other = JSON.parse(event.data).another_player;
        // setPlayer2(other);

        // console.log(11111111111111, other);

        if (token.username === 'lastone') {
          setVirtualBoard(new Board(board.pgn));
        }
      };

      client.onmessage = (message) => {
        const jsonData = JSON.parse(message.data);
        console.log(jsonData);
        setBoard(new Board(jsonData.message));
        if (jsonData.type === 'gameroom_message') {
          if (jsonData.username === token.username) {
            setVirtualBoard(new Board(jsonData.message));
          } else {
            setVirtualBoard(0);
          }
        }
        if (jsonData.type === 'chatroom_message') {
          setChatMessage(`${chatMessage},${jsonData.message}`);
          // console.log(111111111111);
          // console.log(chatMessage);
        }
        if (jsonData.type === 'remove_onboarding') {
          // fetch the user data from Mapper
          if (roomName !== undefined) {
            axios({
              method: 'GET',
              url: `${process.env.NEXT_PUBLIC_BACKEND_API}/game/mapper/${roomName}`,
              headers: {
                Authorization: `JWT ${token.access}`,
              },
            }).then((response) => {
              const resData = response.data;
              if (resData.player1 === token.id) {
                setPlayer2Id(resData.player2);
              } else {
                setPlayer2Id(resData.player1);
              }
            });

            if (roomDetail === null) {
              axios({
                method: 'GET',
                url: `${process.env.NEXT_PUBLIC_BACKEND_API}/game/room/${roomName}`,
                headers: {
                  Authorization: `JWT ${token.access}`,
                },
              }).then((response) => {
                const resData = response.data;
                setRoomDetail(resData);
              });
            }
          }
          setOnBoarding(jsonData.value);
        }
      };
    }

    console.log(client);
  }, [client]);

  // when the game is over
  useEffect(() => {
    if (board.is_game_over()) {
      setVirtualBoard(new Board(board.pgn));
      if (roomDetail.creator === token.id) {
        // create multiplayer game
        axios({
          method: 'POST',
          url: `${process.env.NEXT_PUBLIC_BACKEND_API}/game/multiplayer/`,
          headers: {
            Authorization: `JWT ${token.access}`,
          },
          data: {
            player1: token.id,
            player2: player2Id,
            pgn: board.pgn,
            player1_played_as: 'goat',
          },
        }).then((res) => {
          setMultiplayerObjectData(res.data);
          console.log(11111111111, res.data);
        }).catch((err) => console.log(err));
      }
    }
  }, [board]);

  useEffect(() => {
    // In room set the multiplayer object and
    if (multiplayerObjectData === null) return;
    axios({
      method: 'PATCH',
      url: `${process.env.NEXT_PUBLIC_BACKEND_API}/game/room/${roomName}/`,
      headers: {
        Authorization: `JWT ${token.access}`,
      },
      data: {
        // name: roomName,
        // creator: token.id,
        game: multiplayerObjectData?.id,
      },
    }).then((res) => {
      console.log(res);
    }).catch((err) => console.log(err));
  }, [multiplayerObjectData]);

  useEffect(() => {
    if (player2Id === null) return;
    let responseData = {};
    axios({
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_BACKEND_API}/game/player/${player2Id}`,
      headers: {
        Authorization: `JWT ${token.access}`,
      },
    }).then((response) => {
      const resData = response.data;
      responseData = { ...responseData, ...resData };
    });
    axios({
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_BACKEND_API}/auth/users/${player2Id}`,
      headers: {
        Authorization: `JWT ${token.access}`,
      },
    }).then((response) => {
      const resData = response.data;
      responseData = { ...responseData, ...resData };
      setPlayerTwo(responseData);
    });
  }, [player2Id]);

  useEffect(() => {
    if (playerOne === null) return;
    if (playerOne.id === undefined) return;
    axios({
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_BACKEND_API}/game/player/${playerOne.id}`,
      headers: {
        Authorization: `JWT ${token.access}`,
      },
    }).then((response) => {
      const resData = response.data;
      setPlayerOne({ ...playerOne, ...resData });
    });
  }, [client]);

  useEffect(() => {
    console.log('mmmm', playerTwo);
  }, [playerTwo]);

  //   const client = new W3CWebSocket(`ws://127.0.0.1:8000/ws/chat/${roomName}/`);
  //   const client = new W3CWebSocket('ws://127.0.0.1:8000/ws/chat/baghchal/');
  //   console.log(client);
  //   console.log(roomName);

  //   useEffect(() => {
  // client.onopen = () => {
  //   console.log('websocket client connected');
  // };
  // client.onmessage = (message) => {
  //   const jsonData = JSON.parse(message.data);
  //   console.log(jsonData.message);
  //   setBoard(new Board(jsonData.message));
  // };
  //   }, []);

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
        client.send(JSON.stringify({
          type: 'message',
          message: board.pgn,
          username: token.username,
        }));
        setBoard(new Board(board.pgn));
      }
    }

    if (beingDragged.id === 'bagh') {
      console.log('bagh dragg');
      if (board.next_turn === 'B') {
        board.pure_move(`${initialRow}${initialColumn}${finalRow}${finalColumn}`);
        client.send(JSON.stringify({
          type: 'message',
          message: board.pgn,
          username: token.username,
        }));
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
      client.send(JSON.stringify({
        type: 'message',
        message: board.pgn,
        username: token.username,
      }));
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

  if (onBoarding) {
    return (
      <>
        <div className="w-full mt-20 text-center text-4xl font-bold">Waiting for Other Player to Join</div>
        <Notification />
      </>
    );
  }

  return (
    <div className="flex w-full justify-around h-screen items-center">
      {virtualBoard === 0
        ? (
          <div className="flex flex-col justify-around">
            {playerTwo !== null && (player2Id === roomDetail.creator ? <PlayerCard player={playerTwo} botIS="B" /> : <PlayerCard player={playerTwo} botIS="G" />)}
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
            {playerOne !== null && roomDetail !== null && (player2Id === roomDetail.creator ? <PlayerCard player={playerOne} botIS="G" /> : <PlayerCard player={playerOne} botIS="B" />)}
          </div>
        )
        : (
          <div className="flex flex-col justify-around">
            {/* {botCalculating
              ? (
                <div className="flex gap-3">
                  <PlayerCard player={playerTwo} botIS={botIs} />
                  <Image className="bg-white rounded-md" src={images.loadingDots} height={30} width={40} />
                </div>
              ) : (
                <PlayerCard player={playerTwo} botIS={botIs} />
              )} */}
            {/* {playerTwo !== null && <PlayerCard player={playerTwo} botIS="" />} */}
            {playerTwo !== null && (player2Id === roomDetail.creator ? <PlayerCard player={playerTwo} botIS="B" /> : <PlayerCard player={playerTwo} botIS="G" />)}
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
            {playerOne !== null && roomDetail !== null && (playerOne.id !== roomDetail.creator ? <PlayerCard player={playerOne} botIS="B" /> : <PlayerCard player={playerOne} botIS="G" />)}
          </div>
        )}
      {board.is_game_over() && (
        <Modal
          header="Game Over"
          body={(
            <div className="mt-16">
              {/* <p className="font-poppins dark:text-white text-baghchal-black-1 font-semibold text-xl">Profile Picture</p> */}
              <div className="mt-4 w-full flex justify-center">

                {board.winner() === 'G' && roomDetail.creator === token.id && 'You Won' }
                {board.winner() === 'B' && roomDetail.creator === token.id && 'You Loose' }
                {board.winner() === 'B' && roomDetail.creator !== token.id && 'You Won' }
                {board.winner() === 'G' && roomDetail.creator !== token.id && 'You Loose' }

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
      <Chat
        player1={playerOne}
        player2={playerTwo}
        message={chatMessage}
        handleChange={(e) => { setCurrentMessage(e.target.value); }}
        handleClick={(e) => {
          client.send(JSON.stringify({
            type: 'chatmessage',
            message: currentMessage,
            username: token.username,
          }));
          e.target.value = '';
          setCurrentMessage('');
        }}
      />
      <GameStatus board={board} selectedMoveIndex={selectedMoveIndex} setSelectedMoveIndex={setSelectedMoveIndex} setBoard={setBoard} setVirtualBoard={setVirtualBoard} changeBoardToClickedPgn />
    </div>
  );
};

export default BaghchalBoard;
