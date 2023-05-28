import React from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useRouter } from 'next/router';
import images from '../assets';
import Button from './Button';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';

const Sidebar = () => {
  const { token } = useAuthContext();
  const router = useRouter();
  const { theme } = useTheme();
  const { logout } = useLogout();

  return (
    <div className={`flex flex-col items-center h-screen w-48 justify-between ${theme === 'dark' ? 'bg-status-bg-dark' : 'bg-status-bg-dark'}`}>
      <div className="flex flex-col items-center w-full px-2">
        <div className="mt-6">
          <Image src={images.logo} alt="logo" />
        </div>
        <div className="text-2xl font-medium m-2">Baghchal<span className="text-slate-400">.ai</span></div>

        <div className="w-full">
          <div className="mt-2 mb-2 p-2 flex justify-center items-center gap-4 hover:bg-baghchal-gray-3 hover:cursor-pointer" onClick={() => { router.push('/play'); }}>
            <Image src={images.goatHead} width={40} height={40} alt="logo" />
            <div className="text-xl font-bold">Play</div>
          </div>
          <div className="mt-2 mb-2 p-2 flex justify-center items-center gap-4 hover:bg-baghchal-gray-3 hover:cursor-pointer" onClick={() => { router.push('/learn'); }}>
            <Image src={images.learn} width={40} height={40} alt="logo" />
            <div className="text-xl font-bold">Learn</div>
          </div>
          <div className="mt-2 mb-2 p-2 flex justify-center items-center gap-4 hover:bg-baghchal-gray-3 hover:cursor-pointer" onClick={() => { router.push('/leaderboard'); }}>
            <Image src={images.watch} width={40} height={40} alt="logo" />
            <div className="text-xl font-bold">Watch</div>
          </div>
          {token !== null
            && (
            <div className="mt-2 mb-2 p-2 flex justify-center items-center gap-4 hover:bg-baghchal-gray-3 hover:cursor-pointer" onClick={() => { router.push('/leaderboard'); }}>
              <Image src={images.leaderboard} width={40} height={40} alt="logo" />
              <div className="text-xl font-bold">Rank</div>
            </div>
            )}
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full px-4 mb-8">
        {token === null
          ? (
            <><Button
              classStyles="font-bold text-lg rounded-md"
              btnName="Login"
              handleClick={() => {
                router.push('/login');
              }}
            />
              <Button
                classStyles="font-bold text-lg rounded-md"
                btnName="SignUp"
                handleClick={() => {
                  router.push('/signup');
                }}
              />
            </>
          )
          : (
            <div className="flex flex-col justify-center items-center">
              <span className="mb-3 font-inter font-medium">Hey, {token.username}</span>
              <Button
                classStyles="font-bold text-lg rounded-md bg-black"
                btnName="Logout"
                handleClick={() => {
                  logout();
                  router.push('/', undefined, { shallow: true });
                }}
              />
            </div>
          )}
      </div>
    </div>
  );
};
export default Sidebar;
