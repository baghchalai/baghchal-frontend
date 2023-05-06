import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '../../components';
import images from '../../assets';

const Play = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const router = useRouter();
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  function handlePlayAsBaghClick() {
    router.push('/play/bagh-vs-bot');
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
            <Button btnName="Play" classStyles="font-inter text-xl mt-5" />
          </div>
        </div>

        <div className="relative p-4 pl-8 rounded-md w-full bg-status-bg-dark">
          <div className="font-inter font-medium text-2xl">With Bot</div>
          <Image className="absolute left-80 opacity-30" src={images.bot} height={300} width={300} />
          <div>
            <label htmlFor="dropdown" className="font-inter block mt-5 text-xl">Select level of difficulty:</label>
            <select id="dropdown" className="outline-none p-2 rounded-sm font-inter bg-slate-50 text-black" value={selectedValue} onChange={handleChange}>
              <option value="">--Please choose Level of Difficulty--</option>
              <option value="option1">1</option>
              <option value="option2">2</option>
              <option value="option3">3</option>
              <option value="option4">4</option>
              <option value="option5">5</option>
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
              <Button btnName="Play" classStyles="font-inter text-xl mt-5" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Play;
