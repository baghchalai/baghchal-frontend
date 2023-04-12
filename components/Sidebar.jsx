import React from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import images from '../assets';

const Sidebar = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className={`flex flex-col justify-start items-center h-screen w-48 ${theme === 'dark' ? 'bg-status-bg-dark' : 'bg-status-bg-dark'}`}>
      <div className="mt-6">
        <Image src={images.logo} alt="logo" />
      </div>
      <div className="text-2xl font-medium m-2">Baghchal<span className="text-slate-400">.ai</span></div>

      <div className="w-full">
        <div className="mt-2 mb-2 p-2 flex justify-center items-center gap-4 hover:bg-baghchal-gray-3 hover:cursor-pointer">
          <Image src={images.goatHead} width={40} height={40} alt="logo" />
          <div className="text-xl font-bold">Play</div>
        </div>
        <div className="mt-2 mb-2 p-2 flex justify-center items-center gap-4 hover:bg-baghchal-gray-3 hover:cursor-pointer">
          <Image src={images.learn} width={40} height={40} alt="logo" />
          <div className="text-xl font-bold">Learn</div>
        </div>
        <div className="mt-2 mb-2 p-2 flex justify-center items-center gap-4 hover:bg-baghchal-gray-3 hover:cursor-pointer">
          <Image src={images.watch} width={40} height={40} alt="logo" />
          <div className="text-xl font-bold">Watch</div>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
