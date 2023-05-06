import Button from '../components/Button';

const Home = () => (
  <div className="flex flex-col gap-3">
    <div>BaghChal</div>
    <Button btnName="Play" />
    <Button btnName="Play with bot" />
    <Button btnName="Multiplayer" />
  </div>
);

export default Home;
