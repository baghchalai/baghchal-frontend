import React, { useState } from 'react';
import Input from './Input';

const Chat = ({ player2, message, handleClick, handleChange }) => {
  const [showChat, setShowChat] = useState(false);

  if (showChat) {
    return (
      <div className="w-80 h-96 flex flex-col border shadow-md bg-status-bg-dark absolute bottom-0 right-0">
        <div className="flex items-center justify-between border-b p-2">
          <div className="flex items-center">
            <img
              className="rounded-full w-10 h-10"
              src={player2?.image}
            />
            <div className="pl-2">
              <div className="font-semibold">
                <p className="hover:underline">{player2?.username}</p>
              </div>
              {/* <div className="text-xs text-gray-600">Online</div> */}
            </div>
          </div>

          <div>
            <p className="inline-flex hover:bg-indigo-50 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            </p>

            <button className="inline-flex hover:bg-indigo-50 rounded-full p-2" type="button" onClick={() => setShowChat(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

        </div>

        <div className="flex-1 px-4 py-4 overflow-y-auto">

          <div className="flex flex-col items-start mb-4">
            {message?.split(',').map((val) => (<div>{val}</div>))}
          </div>

        </div>

        <div className="flex items-center border-t p-2">
          <div>
            <button className="inline-flex hover:bg-indigo-50 rounded-full p-2" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>

          <div className="w-full">
            {/* <input className="w-full rounded-full border border-gray-200" type="text" value="" placeholder="Aa" autoFocus /> */}
            <Input placeholder="message" handleClick={handleChange} />
          </div>

          <div>
            <button className="inline-flex hover:bg-indigo-50 rounded-full p-2" type="button" onClick={handleClick}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

    );
  }

  if (!showChat) {
    return (
      <div className="w-80 h-12 flex flex-col border shadow-md bg-status-bg-dark absolute bottom-3 right-0">
        <div className="flex items-center justify-between border-b p-2">
          <div className="flex items-center">
            <img
              className="rounded-full w-10 h-10"
              src={player2?.image}
            />
            <div className="pl-2">
              <div className="font-semibold">
                <span className="hover:underline">{player2?.username}</span>
              </div>
              {/* <div className="text-xs text-gray-600">Online</div> */}
            </div>
          </div>

          <div>
            <button className="inline-flex hover:bg-indigo-50 rounded-full p-2" type="button" onClick={() => setShowChat(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            </button>

            <button className="inline-flex hover:bg-indigo-50 rounded-full p-2" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }
};
export default Chat;
