import React from 'react';
import Image from 'next/image';
import { Button, Input } from '../components';
import images from '../assets';

const Login = () => (
  <div className="flex flex-col items-center justify-center mt-16 w-full">
    <div className="flex flex-col p-3 px-8 rounded-lg bg-status-bg-dark w-2/6">
      <div className="flex flex-col justify-center items-center">
        <div className="mt-6">
          <Image src={images.logo} alt="logo" />
        </div>
        <div className="text-2xl font-medium m-2">Baghchal<span className="text-slate-400">.ai</span></div>
      </div>
      <Input placeholder="Username" />
      <Input placeholder="Password" inputType="password" hidePassword />
      <Button btnName="Login" classStyles="mt-8" />
      <div className="mt-12 mb-4 flex flex-col items-center w-full justify-center">
        <div className="text-baghchal-gray-2">
          Dont have an account?
          <span className="mx-2 underline cursor-pointer">Sign Up</span>
        </div>
        <div className="text-baghchal-gray-2 underline cursor-pointer">
          Forget Password?
        </div>
      </div>
    </div>
  </div>
);

export default Login;
