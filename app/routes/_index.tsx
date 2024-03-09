import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Link } from 'react-router-dom';
import styles from '~/styles/main.css';
import useThreadId from '~/hooks/use-user-id';
import ZorkEngine from '~/services/zork-engine';

// Array of objects representing content for each card
const cardData = [
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
    src: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Mars_-_August_30_2021_-_Flickr_-_Kevin_M._Gill.png',
    title: 'Terraform Mars',
    description: 'Become a Cosmonaut'
  }
];

export const meta: MetaFunction = () => {
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
        {cardData.map((card) => (
          <Card key={card.id} className="transition-effect">
            <Link to="/game" state={() => initUserThread(card.description)}>
              <CardActionArea>
                <CardMedia component="img" height="140" src={card.src} alt="Play" />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    className="card-text"
                    style={{ fontFamily: 'Courier New' }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="card-text"
                    style={{ fontFamily: 'Courier New' }}
                  >
                    {card.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Link>
          </Card>
        ))}
      </div>
      <CustomTheme />
    </div>
  );
}

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}
