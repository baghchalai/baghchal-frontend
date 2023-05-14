import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button, Input, Notification } from '../components';
import images from '../assets';
import { useAuthContext } from '../hooks/useAuthContext';

const SignUp = () => {
  const router = useRouter();
  const [inputDetail, setInputDetail] = useState({ firstname: '', lastname: '', username: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();
  const handleSignUp = () => {
    setError(null);
    axios({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_BACKEND_API}/auth/jwt/create`,
      data: {
        first_name: inputDetail.firstname,
        last_name: inputDetail.lastname,
        username: inputDetail.username,
        email: inputDetail.email,
        password: inputDetail.password,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          // setData(response.data);
          console.log(response.data);
          localStorage.setItem('token', JSON.stringify(response.data));
          dispatch({ type: 'LOGIN', payload: response.data });
          setInputDetail({ firstname: '', lastname: '', username: '', email: '', password: '' });
          //   setLoadingCircle(false);
          router.push('/', undefined, { shallow: true });
        }
      })
      .catch((err) => {
        // setLoadingCircle(false);
        if (err.response?.status === 401) {
          setError(err.response.data.detail);
        }
        console.log(err); console.log(err.response);
        setError('Something went wrong.');
      });
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (token) {
      const notify = () => toast('Found previous session, Logging you in');
      notify();
      setTimeout(() => {
        router.push('/', undefined, { shallow: true });
      }, 2000);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-16 w-full">
      <div className="flex flex-col p-3 px-8 rounded-lg bg-status-bg-dark w-2/6">
        <div className="flex flex-col justify-center items-center">
          <div className="mt-6">
            <Image src={images.logo} alt="logo" />
          </div>
          <div className="text-2xl font-medium m-2">Baghchal<span className="text-slate-400">.ai</span></div>
        </div>
        <div className="flex gap-4">
          <Input placeholder="First Name" handleClick={(e) => { setInputDetail({ ...inputDetail, username: e.target.value }); }} />
          <Input placeholder="Last Name" handleClick={(e) => { setInputDetail({ ...inputDetail, username: e.target.value }); }} />
        </div>
        <Input placeholder="Username" handleClick={(e) => { setInputDetail({ ...inputDetail, username: e.target.value }); }} />
        <Input placeholder="Email" handleClick={(e) => { setInputDetail({ ...inputDetail, username: e.target.value }); }} />
        <Input placeholder="Password" inputType="password" handleClick={(e) => { setInputDetail({ ...inputDetail, password: e.target.value }); }} hidePassword />
        <Button btnName="Sign Up" handleClick={handleSignUp} classStyles="mt-8" />
        <div className="flex justify-center items-center mt-8">
          { error !== null && <p className="absolute text-red-500">{error}</p>}
        </div>
        <Notification />
        <div className="mt-12 mb-4 flex flex-col items-center w-full justify-center">
          <div className="text-baghchal-gray-2">
            Already have an account?
            <span className="mx-2 underline cursor-pointer">Log In</span>
          </div>
          {/* <div className="text-baghchal-gray-2 underline cursor-pointer">
            Forget Password?
          </div> */}
        </div>
      </div>
    </div>
  );
};
export default SignUp;
