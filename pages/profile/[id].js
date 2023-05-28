import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuthContext } from '../../hooks/useAuthContext';

const Profile = () => {
  const router = useRouter();
  const { token } = useAuthContext();
  const [playerId, setPlayerId] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;
    const { id } = router.query;
    setPlayerId(id);
    console.log(11111111, playerId);
  }, [router.isReady]);

  useEffect(() => {
    if (playerId === null) return;
    if (token !== null) {
      axios({
        method: 'GET',
        url: `${process.env.NEXT_PUBLIC_BACKEND_API}/game/player/${playerId}`,
        headers: {
          Authorization: `JWT ${token.access}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            // setData(response.data);
            setPlayerData(response.data);
            setLoading(false);
            console.log(playerData);
          }
        }).catch((err) => console.log(err));
    }
  }, [token, playerId]);

  if (loading) {
    return <div>Loading</div>;
  }
  return (
    <div className="flex flex-col w-full">
      <div className="px-10 mt-10 font-inter font-bold text-4xl">Profile</div>
      <section className="pt-1 bg-blueGray-50 w-full">
        <div className="w-full lg:w-4/12 px-4 mx-auto">
          <div className="relative flex flex-col min-w-0 break-words py-10 bg-status-bg-dark w-full mb-6 shadow-xl rounded-lg mt-16">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full px-4 flex justify-center">
                  <div className="relative">
                    {/* <Image alt="profile-image" src={playerData.image} width={500} height={500} class="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px" /> */}
                    <Image alt="profile-image" src={playerData.image} width={300} height={300} className="rounded-md" />
                  </div>
                </div>
                <div className="w-full px-4 text-center mt-10">
                  <div className="flex justify-center py-4 lg:pt-4 pt-8">
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                        {playerData.rating}
                      </span>
                      <span className="text-sm text-blueGray-400">Rating</span>
                    </div>
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                        {playerData.game_played}
                      </span>
                      <span className="text-sm text-blueGray-400">Game Played</span>
                    </div>
                    <div className="lg:mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                        {playerData.game_won}
                      </span>
                      <span className="text-sm text-blueGray-400">Game Won</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-12">
                <h3 className="text-xl font-semibold leading-normal text-blueGray-700 mb-2">
                  {`${token.first_name} ${token.last_name}`}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
