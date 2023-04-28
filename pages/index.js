import Button from '../components/Button';
import Sidebar from '../components/Sidebar';

const Home = () => (
  <div className="flex">
    <Sidebar />
    <div className="flex flex-col gap-3">
      <div>BaghChal</div>
      <Button btnName="Play" />
      <Button btnName="Play with bot" />
      <Button btnName="Multiplayer" />
    </div>
  </div>
);

export default Home;
