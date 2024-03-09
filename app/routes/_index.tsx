import type { MetaFunction } from '@remix-run/node';
import styles from '~/styles/main.css';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

// Array of objects representing content for each card
const cardData = [
  {
    id: 1,
    src: 'https://www.pixelstalk.net/wp-content/uploads/2016/06/Art-Images-HD-Sci-Fi-Downlaod.jpg',
    title: 'Sci-Fi',
    description: 'Conquer the Cosmos',
    link: '/game',
  },
  {
    id: 2,
    src: 'https://kslsports.com/wp-content/uploads/2021/04/byu-cosmo-mascot-cheer-620x370.png',
    title: 'Mormon Mobsters',
    description: 'Become Cosmo',
    link: '/game',
  },
  {
    id: 3,
    src: 'https://i.pinimg.com/originals/ff/54/3c/ff543c04e0084f0584766eaa4761a7b4.jpg',
    title: 'Zombie Apocalypse',
    description: 'Run like Cosmo',
    link: '/game',
  },
  {
    id: 4,
    src: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Mars_-_August_30_2021_-_Flickr_-_Kevin_M._Gill.png',
    title: 'Terraform Mars',
    description: 'Become a Cosmonaut',
    link: '/game',
  },
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
  return (
    <div className="main-menu">
      <Welcome />
      <div className="card-container">
        {cardData.map((card) => (
          <Card key={card.id} className="transition-effect">
            <CardActionArea component={Link} to={card.link}>
              <CardMedia component="img" height="140" src={card.src} alt="Play" />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" className="card-text">
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" className="card-text">
                  {card.description}
                </Typography>
              </CardContent>
            </CardActionArea>
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
