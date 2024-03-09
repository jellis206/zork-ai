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
    description: 'Become one of the Cosmos',
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
    src: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/57c09c1b-2eb9-4e46-8d05-3255d11b2a58/d2vvfzc-be5ebf5a-2ffe-477e-b8ee-3045ad746815.jpg/v1/fill/w_900,h_569,q_75,strp/curve_into_mystery_wallpaper_by_lowjacker_d2vvfzc-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTY5IiwicGF0aCI6IlwvZlwvNTdjMDljMWItMmViOS00ZTQ2LThkMDUtMzI1NWQxMWIyYTU4XC9kMnZ2ZnpjLWJlNWViZjVhLTJmZmUtNDc3ZS1iOGVlLTMwNDVhZDc0NjgxNS5qcGciLCJ3aWR0aCI6Ijw9OTAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.y4Mf0bqMTag8tBpxzF7QgYmTJe4ioC6QJgpYEmxlSsY',
    title: 'Custom',
    description: 'Choose your own theme',
    link: '/game',
  },
];

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Zork-AI!' }];
};

function Welcome() {
  return (
    <div style={{ width: '100%', fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1>Welcome to Zork-AI</h1>
    </div>
  );
}

export default function Index() {
  return (
    <div className="main-menu">
      <Welcome />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {cardData.map((card) => (
          <Card key={card.id} style={{ maxWidth: 'calc(50% - 8px)' }} className="transition-effect">
            <CardActionArea component={Link} to={card.link}>
              <CardMedia component="img" height="140" src={card.src} alt="Play" />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}
