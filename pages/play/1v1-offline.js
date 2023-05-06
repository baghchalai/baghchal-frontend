import { Board } from '../../components';
import images from '../../assets';

const Play = () => {
  const user1 = {
    username: 'Player 1',
    profileImage: images.randomUser,
  };

  const user2 = {
    username: 'Player 2',
    profileImage: images.randomUser,
  };

  return (
    <Board playerOne={user1} playerTwo={user2} />
  );
};
export default Play;
