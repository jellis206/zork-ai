import { Link } from 'react-router-dom';
import '~/styles/main.css';
import useThreadId from '~/hooks/use-user-id';
import ZorkEngine from '~/services/zork-engine';

// Define types for card data
interface CardData {
  id: number;
  src: string;
  title: string;
  description: string;
}

// Array of objects representing content for each card
const cardData: CardData[] = [
  {
    id: 1,
    src: 'https://www.pixelstalk.net/wp-content/uploads/2016/06/Art-Images-HD-Sci-Fi-Downlaod.jpg',
    title: 'Sci-Fi',
    description: 'Conquer the Cosmos'
  },
  {
    id: 2,
    src: 'https://kslsports.com/wp-content/uploads/2021/04/byu-cosmo-mascot-cheer-620x370.png',
    title: 'Mormon Mobsters',
    description: 'Become Cosmo'
  },
  {
    id: 3,
    src: 'https://i.pinimg.com/originals/ff/54/3c/ff543c04e0084f0584766eaa4761a7b4.jpg',
    title: 'Zombie Apocalypse',
    description: 'Run like Cosmo'
  },
  {
    id: 4,
    src: 'https://media.cnn.com/api/v1/images/stellar/prod/210511145919-perseverance-mars-rover-0429.jpg?q=w_2068,h_1172,x_0,y_0,c_fill/h_618',
    title: 'Terraform Mars',
    description: 'Become a Cosmonaut'
  }
];

export const meta = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Zork-AI!' }];
};

function Welcome() {
  return (
    <div className="Title">
      <h1>Welcome to Zork-AI</h1>
    </div>
  );
}

function CustomTheme() {
  return (
    <form>
      <input
        type="text"
        placeholder="... Or choose your own adventure"
        maxLength={20}
        className="command-input custom-input"
      ></input>
    </form>
  );
}

export default function Index() {
  const [threadId, setThreadId] = useThreadId();
  const initUserThread = async (theme: string) => {
    const { newThreadId, startMessage } = await ZorkEngine.startNewGame(threadId, theme);
    setThreadId(newThreadId);
    return startMessage;
  };

  return (
    <div className="main-menu">
      <Welcome />
      <div className="card-container">
        {cardData.map((card: CardData) => (
          <div key={card.id} className="transition-effect">
            <Link to="/game" state={() => initUserThread(card.description)}>
              <img
                className="card-img"
                src={card.src}
                alt="Play"
                style={{ maxWidth: '100%', height: 'auto' }} // Adjust image size here
              />
              <div className="card-content">
                <h2 className="card-title">{card.title}</h2>
                <p className="card-description">{card.description}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <CustomTheme />
    </div>
  );
}
