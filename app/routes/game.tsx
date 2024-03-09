// import { useState } from 'react';
// import { TextField, Button, Container, Typography, Input } from '@mui/material';
import heart from '~/assets/heart.png';
import hearthalf from '~/assets/heart-half.png';
import heartempty from '~/assets/heart-empty.png';
import ZorkEngine from '~/services/zork-engine';

export default function Game() {
  const [threadId] = useThreadId();
  // const [inputValue, setInputValue] = useState<string>('');
  // const [outputValue, setOutputValue] = useState<string>('');

  // const handleKeyPress = (event) => {
  //   if (event.key === 'Enter') {
  //     // Call your function here
  //     handleEnterPress();
  //   }
  // };

  // const handleEnterPress = () => {
  //   console.log('Enter key pressed!');
  //   // Add your logic here
  // };

  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setInputValue(event.target.value);
  // };

  const health = 65;

  const messagesList = [
    {
      role: 'ZorkBot',
      text: 'You are standing in an open field west of a white house, with a boarded front door. There is a small mailbox here.'
    },
    {
      role: 'Player',
      text: 'I want to open the mailbox.'
    },
    {
      role: 'ZorkBot',
      text: 'Opening the mailbox reveals a leaflet.'
    },
    {
      role: 'Player',
      text: 'I want to read the leaflet.'
    },
    {
      role: 'ZorkBot',
      text: 'Welcome to Zork! You are about to embark on a journey into the world of Zork. Your mission is to find the treasures hidden throughout the land. Be warned, the land is filled with danger and you will need to use your wits to survive.'
    },
    {
      role: 'ZorkBot',
      text: 'You are standing in an open field west of a white house, with a boarded front door. There is a small mailbox here.'
    },
    {
      role: 'Player',
      text: 'I want to open the mailbox.'
    },
    {
      role: 'ZorkBot',
      text: 'Opening the mailbox reveals a leaflet.'
    },
    {
      role: 'Player',
      text: 'I want to read the leaflet.'
    },
    {
      role: 'ZorkBot',
      text: 'Welcome to Zork! You are about to embark on a journey into the world of Zork. Your mission is to find the treasures hidden throughout the land. Be warned, the land is filled with danger and you will need to use your wits to survive.'
    },
    {
      role: 'ZorkBot',
      text: 'You are standing in an open field west of a white house, with a boarded front door. There is a small mailbox here.'
    },
    {
      role: 'Player',
      text: 'I want to open the mailbox.'
    },
    {
      role: 'ZorkBot',
      text: 'Opening the mailbox reveals a leaflet.'
    },
    {
      role: 'Player',
      text: 'I want to read the leaflet.'
    },
    {
      role: 'ZorkBot',
      text: 'Welcome to Zork! You are about to embark on a journey into the world of Zork. Your mission is to find the treasures hidden throughout the land. Be warned, the land is filled with danger and you will need to use your wits to survive.'
    }
  ];

  return (
    <div className="game-screen">
      <div className="command-terminal-container">
        <div className="command-messages">
          {messagesList.map((message, index) => (
            <div key={index} className="message">
              {message.role === 'ZorkBot' ? (
                <span className="message-role">{message.role}: </span>
              ) : (
                <span>&gt; </span>
              )}
              <span className="message-text">{message.text}</span>
            </div>
          ))}
        </div>
        <div className="command-input-container">
          <div className="command-prompt">&gt;</div>
          <form method="post">
            <input type="hidden" name="threadId" value={threadId} />
            <input
              type="text"
              name="decision"
              autoFocus // eslint-disable-line jsx-a11y/no-autofocus
              placeholder=""
              className="command-input"
              // onKeyPress={handleKeyPress}
              style={{ width: '400px' }} // Adjust the width as needed
            />
          </form>
        </div>
      </div>
      <div className="vertical-divider"></div>
      <div className="side-panel">
        <div className="health-bar">{renderHearts(health)}</div>
        <div className="backpack-header">Backpack</div>
        <div className="backpack-items">
          <div className="backpack-item">Sword</div>
          <div className="backpack-item">Shield</div>
          <div className="backpack-item">Potion</div>
        </div>
      </div>
    </div>
  );
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const threadId = formData.get('threadId') || '';
  const playerDecision = formData.get('decision') || '';
  const zorkResponse = await ZorkEngine.postUserDecision(
    threadId.toString(),
    playerDecision.toString()
  );
  console.log(zorkResponse);
}
// Function to render hearts based on health
function renderHearts(health: number) {
  const fullHearts = Math.floor(health / 10); // Number of full hearts
  const halfHeart = health % 10 >= 5; // Check if there's a half heart needed
  const emptyHearts = 10 - fullHearts - (halfHeart ? 1 : 0); // Calculate number of empty hearts

  return (
    <>
      {[...Array(emptyHearts)].map((_, index) => (
        <img key={`empty-${index}`} src={heartempty} className="pixelized--heart" alt="heart" />
      ))}
      {halfHeart && <img key="half" src={hearthalf} className="pixelized--heart" alt="heart" />}
      {[...Array(fullHearts)].map((_, index) => (
        <img key={index} src={heart} className="pixelized--heart" alt="heart" />
      ))}
    </>
  );
}
