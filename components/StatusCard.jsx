import React from 'react';

const StatusCard = ({ name, value, colorStyle }) => (
  <div className={`mt-4 p-2 relative w-1/4 flex justify-center items-center border-4 ${colorStyle} rounded-sm`}>
    <div className="absolute -top-3 bg-status-bg-dark px-2 font-inter text-xs">{name}</div>
    {/* <div className={`${colorStyle} flex justify-center items-center h-16 w-20 rounded-lg text-5xl`}>{value}</div> */}
    <div className="text-5xl font-inter">{value}</div>
  </div>
);

export default StatusCard;
