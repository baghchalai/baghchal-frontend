import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Notification, Button, Input } from '../../components';
import images from '../../assets';
import { useAuthContext } from '../../hooks/useAuthContext';

const Play = () => {
  const { token } = useAuthContext();
  const [selectedValue, setSelectedValue] = useState('');
  const [joinRoomName, setJoinRoomName] = useState({ room: '' });
  const [createRoomName, setCreateRoomName] = useState({ room: '' });
  const [errorCreateRoom, setErrorCreateRoom] = useState(null);
  const router = useRouter();
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  function handlePlayAsBaghClick() {
    if (selectedValue === '') {
      router.push('/play/bagh-vs-bot');
    } else {
      router.push(`play/bagh-vs-bot?level=${selectedValue}`);
    }
  }

  function handlePlayAsGoatClick() {
    if (selectedValue === '') {
      router.push('/play/goat-vs-bot');
    } else {
      router.push(`play/goat-vs-bot?level=${selectedValue}`);
    }
  }

  function handleCreateRoom() {
    if (createRoomName.room === '') {
      setErrorCreateRoom('Empty Field');
      return;
    }
    setErrorCreateRoom(null);
    axios({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_BACKEND_API}/game/room/`,
      data: {
        name: createRoomName.room,
        creator: token.id,
        game: null,
      },
      headers: {
        Authorization: `JWT ${token.access}`,
      },
    })
      .then((response) => {
        // if (response.status === 200) {
        // setData(response.data);
        console.log(response.data);
        //   localStorage.setItem('token', JSON.stringify(response.data));
        //   dispatch({ type: 'LOGIN', payload: response.data });
        const notify = () => toast('Room Created, You can Join now');
        notify();
      })
      .catch((err) => {
        // setLoadingCircle(false);
        if (err.response?.status === 401) {
          setErrorCreateRoom(err.response.data.detail);
        }
        console.log(err); console.log(err.response);
        // setErrorCreateRoom('Something went wrong.');
        const { response } = err;
        console.log(response);
        // if ('name' in response) {
        //   setErrorCreateRoom(err.response.data.name);
        // } else {
        setErrorCreateRoom('Something went wrong');
        // }
      });
  }

  return (
    <div className="flex flex-col p-4 w-full">
      <div className="font-inter font-semibold text-4xl">Play</div>
      <div className="flex mt-6 gap-4 w-full ">
        <div className="relative p-3 rounded-md w-full bg-status-bg-dark">
          <span className="font-inter font-medium text-2xl">With friend</span>
          <span className="ml-4 font-xs">[Physical multiplayer mode]</span>
          <Image className="absolute left-80 opacity-30 rounded-full" src={images.randomUser} height={275} width={275} />
          <div className="mt-24 ml-8">
            <Button handleClick={() => router.push('/play/1v1-offline')} btnName="Play" classStyles="font-inter text-xl mt-5" />
          </div>
        </div>

        <div className="relative p-4 pl-8 rounded-md w-full bg-status-bg-dark">
          <div className="font-inter font-medium text-2xl">With Bot</div>
          <Image className="absolute left-80 opacity-30" src={images.bot} height={300} width={300} />
          <div>
            <label htmlFor="dropdown" className="font-inter block mt-5 text-xl">Select level of difficulty:</label>
            <select id="dropdown" className="outline-none p-2 rounded-sm font-inter bg-slate-50 text-black" value={selectedValue} onChange={handleChange}>
              <option value="">--Please choose Level of Difficulty--</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div className="flex mt-6 mb-6  items-center gap-6">
            <div>
              <span className="font-inter font-semibold text-lg">Play as:</span>
              <Image src={images.bagh} height={60} />
              <Button btnName="Play" handleClick={() => handlePlayAsBaghClick()} classStyles="font-inter text-xl mt-5" />
            </div>
            <div>
              <span className="font-inter font-semibold text-lg">Play as:</span>
              <Image src={images.goat} height={60} />
              <Button btnName="Play" handleClick={() => handlePlayAsGoatClick()} classStyles="font-inter text-xl mt-5" />
            </div>
          </div>
        </div>

      </div>

      <div className="relative mt-6 p-4 pl-8 rounded-md w-full bg-status-bg-dark">
        <div className="font-inter font-medium text-2xl">Multiplayer</div>
        <div className="flex justify-around">
          <div>
            <Input title="Create room" handleClick={(e) => { setCreateRoomName({ ...createRoomName, room: e.target.value }); }} />
            <Button btnName="Create" classStyles="mt-4" handleClick={() => handleCreateRoom()} />
            { errorCreateRoom !== null && <p className="absolute text-red-500">{errorCreateRoom}</p>}
          </div>
          <div>
            <Input title="Join room" handleClick={(e) => { setJoinRoomName({ ...joinRoomName, room: e.target.value }); }} />
            <Button btnName="Join" classStyles="mt-4" handleClick={() => router.push(`/play/multiplayer/${joinRoomName.room}`, undefined, { shallow: false })} />
          </div>
        </div>
      </div>
      <Notification />
    </div>
  );
};

export default Play;
