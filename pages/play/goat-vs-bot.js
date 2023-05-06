import React from 'react';
import { Board } from '../../components';
import images from '../../assets';
import { useAuthContext } from '../../hooks/useAuthContext';

const BaghvsBot = () => {
  const { token } = useAuthContext();
  const user1 = {
    username: token?.username,
    profileImage: images.randomUser,
  };

  const bot = {
    username: 'bot',
    profileImage: images.bot,
    level: 2,
  };

  return (
    <Board playerOne={user1} playerTwo={bot} botIs="B" />
  );
};
export default BaghvsBot;
