import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Board } from '../../components';
import images from '../../assets';
import { useAuthContext } from '../../hooks/useAuthContext';

const BaghvsBot = () => {
  const { token } = useAuthContext();
  const router = useRouter();
  const { level } = router.query;
  const [playerProfile, setPlayerProfile] = useState(null);

  useEffect(() => {
    if (token === null) return;
    axios({
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_BACKEND_API}/game/player/${token.id}`,
      headers: {
        Authorization: `JWT ${token.access}`,
      },
    }).then((response) => {
      const resData = response.data;
      setPlayerProfile(resData);
    });
  }, [token]);

  const user1 = {
    username: token?.username,
    image: playerProfile?.image,
  };

  const bot = {
    username: 'bot',
    image: images.bot,
    level: 2,
  };

  return (
    <Board playerOne={user1} playerTwo={bot} botIs="G" level={level} />
  );
};
export default BaghvsBot;
