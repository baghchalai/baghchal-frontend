import React from 'react';
import Image from 'next/image';

const PlayerCard = ({ player, botIS }) => (
  <div className="flex gap-2">
    <div>
      <Image className="rounded-lg bg-cover" src={player.profileImage} height={45} width={45} />
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
