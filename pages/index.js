import Image from 'next/image';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTheme } from 'next-themes';
import axios from 'axios';
import Button from '../components/Button';
import images from '../assets';
import { useAuthContext } from '../hooks/useAuthContext';
import { Modal } from '../components';

const uploadToCloudinary = async (image) => {
  const data = new FormData();
  data.append('file', image);
  data.append('upload_preset', 'localmart');
  data.append('cloud_name', 'dcmsjwslq');
  const res = await fetch('https://api.cloudinary.com/v1_1/dcmsjwslq/image/upload', {
    method: 'post',
    body: data,
  });

  const result = await res.json();
  // console.log(result.url);
  return result.url;
};

const Home = () => {
  const { token } = useAuthContext();
  const { theme } = useTheme();
  const [fileUrl, setFileUrl] = useState(null);
  const [showModel, setShowModel] = useState(false);

  useEffect(() => {
    if (token !== null) {
      if (token.profile_present === false) {
        setShowModel(true);
      }
    }
  }, [token]);

  const handleUpdateProfile = () => {
    // setError(null);
    // const data = { profile: fileUrl === null ? '' : fileUrl };
    axios({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_BACKEND_API}/game/player/me/`,
      data: {
        image: fileUrl === null ? '' : fileUrl,
      },
      headers: {
        Authorization: `JWT ${token.access}`,
      },
    })
      .then((response) => {
        // setLoadingCircle(true);
        setShowModel(false);
        console.log(response);
      })
      .catch((err) => {
        // if (err.response?.status === 409) { setError(err.response.data.msg); } else { setError(err.message); }
        console.log(err);
      });
  };

  const onDrop = useCallback(async (acceptedFile) => {
    // upload image to the cloudinary
    const url = await uploadToCloudinary(acceptedFile[0]);
    console.log(url);

    if (acceptedFile[0].type.match('image.*')) {
      setFileUrl(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
  });

  const fileStyle = useMemo(() => (
    `rounded-full dark:bg-mart-black-1 bg-white border dark:border-white border-mart-gray-2 p-5 flex flex-col items-center border-dashed
    ${isDragActive && 'border-file-active'}
    ${isDragAccept && 'border-file-accept'}
    ${isDragReject && 'border-file-reject'}
    `
  ), [isDragActive, isDragAccept, isDragReject]);

  return (
    <div className="flex flex-col gap-3 relative">
      {showModel
        && (
        <Modal
          header="Fill your profile details"
          body={(
            <div className="mt-16">
              <p className="font-poppins dark:text-white text-baghchal-black-1 font-semibold text-xl">Profile Picture</p>
              <div className="mt-4 w-full flex justify-center">
                <div {...getRootProps()} className={fileStyle}>
                  <input {...getInputProps()} />
                  <div className="flexCenter flex-col text-center">
                    {/* <p className="font-poppins dark:text-white text-baghchal-black-1 font-semibold text-xl">JPG, PNG, GIF, SVG, WEBM.</p> */}
                    <div className="flex justify-center h-32 w-32 cursor-pointer">
                      {!fileUrl
                        ? <Image src={images.upload} width={50} height={50} objectFit="contain" alt="file upload" className={`${theme === 'light' ? 'filter invert' : ''}`} />
                        : <img src={fileUrl} alt="file upload" className="rounded-full object-cover" />}
                    </div>
                    {/* <p className="font-poppins dark:text-white text-baghchal-black-1 font-semibold text-sm">Drag and Drop File</p>
                      <p className="font-poppins dark:text-white text-baghchal-black-1 font-semibold text-sm">or Browse media on your device </p> */}
                  </div>
                </div>
              </div>
            </div>
          )}
          footer={(
            <div className="flex flex-row sm:flex-col ">
              <Button
                btnName="Save"
                classStyles="mr-5 sm:mr-0 rounded-xl"
                // handleClick={() => {}}
                handleClick={handleUpdateProfile}
              />
              {/* <Button
                btnName="Cancel"
                classStyles="rounded-xl"
                // handleClick={() => { setUpdateModal(false); }}
              /> */}
            </div>
        )}
          // handleClose={() => { setUpdateModal(false); }}
        />
        )}
      <Image src={images.baghchalHome} className="w-full h-screen rounded-3xl p-4" alt="home-image" />
      <div className="absolute flex gap-4 top-72 left-2/3">
        <Button btnName="PLAY" classStyles="font-inter rounded-lg px-16 py-6 text-6xl bg-yellow-700" />
      </div>
    </div>
  );
};

export default Home;
