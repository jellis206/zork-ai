import '~/styles/main.css';
import ZorkEngine from '~/services/zork-engine';
import { Form, redirect, useLoaderData } from '@remix-run/react';

// Define types for card data
interface CardData {
  id: number;
  src: string;
  title: string;
  description: string;
  theme: string;
}

// Array of objects representing content for each card
const cardData: CardData[] = [
  {
    id: 1,
    src: 'https://www.pixelstalk.net/wp-content/uploads/2016/06/Art-Images-HD-Sci-Fi-Downlaod.jpg',
    title: 'Sci-Fi',
    description: 'Conquer the Cosmos',
    theme: 'You and your crew are on a space exploration, generate a zork game based on this theme'
  },
  {
    id: 2,
    src: 'https://kslsports.com/wp-content/uploads/2021/04/byu-cosmo-mascot-cheer-620x370.png',
    title: 'Mormon Mobsters',
    description: 'Become Cosmo',
    theme:
      'Cosmo is the mascot for BYU, and he just got injured, he needs to be replaced, generate a zork game based on this theme'
  },
  {
    id: 3,
    src: 'https://i.pinimg.com/originals/ff/54/3c/ff543c04e0084f0584766eaa4761a7b4.jpg',
    title: 'Zombie Apocalypse',
    description: 'Run like Cosmo',
    theme:
      'You are Cosmo, the mascot for BYU, and you are running from zombies, generate a zork game based on this theme'
  },
  {
    id: 4,
    src: 'https://media.cnn.com/api/v1/images/stellar/prod/210511145919-perseverance-mars-rover-0429.jpg?q=w_2068,h_1172,x_0,y_0,c_fill/h_618',
    title: 'Terraform Mars',
    description: 'Become a Cosmonaut',
    theme:
      'Mars is the new frontier and needs some frontiersman to lead the way as humans prepare to inhabit the planet, and you are a cosmonaut, could there be aliens awaiting your arrival? Generate a zork game based on this theme'
  }
];

export const meta = () => {
  return [{ title: 'Zork-AI' }, { name: 'description', content: 'Welcome to Zork-AI!' }];
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

export async function loader() {
  const threadId = await new ZorkEngine().startNewThread();
  return threadId;
}

export default function Index() {
  const threadId = useLoaderData<typeof loader>();

  return (
    <div className="main-menu">
      <Welcome />
      <div className="card-container">
        {cardData.map((card: CardData) => (
          <Form key={card.id} method="post">
            <input type="hidden" name="threadId" value={threadId} />
            <input type="hidden" name="theme" value={card.theme} />
            <button className="card-button">
              <div className="transition-effect">
                <img
                  className="card-img"
                  src={card.src}
                  alt="Play"
                  style={{ maxWidth: '100%', height: '200px' }} // Adjust image size here
                />
                <div className="card-content">
                  <h2 className="card-title">{card.title}</h2>
                  <p className="card-description">{card.description}</p>
                </div>
              </div>
            </button>
          </Form>
        ))}
      </div>
      <CustomTheme />
    </div>
  );
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const threadId = (formData.get('threadId') || '').toString();
  const theme = (formData.get('theme') || '').toString();
  const { newThreadId } = await new ZorkEngine().startNewGame(threadId, theme);
  return redirect(`/game?threadId=${newThreadId}`);
}
