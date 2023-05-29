import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Leaderboard = () => {
  const router = useRouter();
  const [leaderboardData, setLeaderboardData] = useState([]);
  useEffect(() => {
    axios({
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_BACKEND_API}/game/leaderboard`,
    }).then((response) => {
      console.log(response.data);
      setLeaderboardData(response.data);
    });
  }, []);
  return (
    <div className="flex flex-col w-full">
      <div className="px-10 mt-10 font-inter font-bold text-4xl">Leaderboard</div>
      <div className="flex mt-10 w-full px-10">
        <div className="w-full relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-status-bg-dark dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Rank
                </th>
                <th scope="col" className="px-6 py-3">
                  Image
                </th>
                <th scope="col" className="px-6 py-3">
                  Username
                </th>
                <th scope="col" className="px-6 py-3">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((val, idx) => (
                <tr className="bg-white border-b dark:bg-status-bg-dark dark:border-gray-700">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {idx + 1}
                  </th>
                  <td className="px-6 py-4">
                    <Image className="rounded-full" src={val.image} alt="profile-image" width={50} height={50} />
                  </td>
                  <td onClick={() => router.push(`/profile/${val.user.id}`)} className="cursor-pointer px-6 py-4">
                    {val.user.username}
                  </td>
                  <td className="px-6 py-4">
                    {val.rating}
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
