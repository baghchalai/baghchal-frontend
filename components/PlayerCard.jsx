import React from 'react';
import Image from 'next/image';
import images from '../assets';

const PlayerCard = ({ player, botIS }) => (
  <div className="flex gap-2">
    <div>
      {player.image
        ? <Image className="rounded-lg bg-cover" src={player.image} height={45} width={45} />
        : <Image className="rounded-lg bg-cover" src={images.randomUser} height={45} width={45} />}
    </div>
    <div>
      <div className="font-inter font-bold">
        {player.username}
      </div>
      <div className="font-inter text-xs text-baghchal-gray-1">Playing as {player.username === 'bot' ? botIS === 'G' ? 'Goat' : 'Bagh' : botIS === 'G' ? 'Bagh' : 'Goat'}</div>
    </div>
  </div>
);

export default PlayerCard;
