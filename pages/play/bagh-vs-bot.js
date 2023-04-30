import React from 'react';
import { Board, Sidebar } from '../../components';
import images from '../../assets';

const BaghvsBot = () => {
  const user1 = {
    username: 'kamal',
    profileImage: images.randomUser,
  };

  const bot = {
    username: 'bot',
    profileImage: images.bot,
    level: 2,
  };

  return (
    <div className="flex">
      <Sidebar />
      <Board playerOne={user1} playerTwo={bot} botIs="G" />
    </div>
  );
};
export default BaghvsBot;
