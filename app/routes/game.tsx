// import { useState } from 'react';
// import { TextField, Button, Container, Typography, Input } from '@mui/material';

export default function Game() {
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

  const health = 100;

  const messagesList = [
    {
      role: 'ZorkBot',
      text: 'You are standing in an open field west of a white house, with a boarded front door. There is a small mailbox here.',
    },
    {
      role: 'Player',
      text: 'I want to open the mailbox.',
    },
    {
      role: 'ZorkBot',
      text: 'Opening the mailbox reveals a leaflet.',
    },
    {
      role: 'Player',
      text: 'I want to read the leaflet.',
    },
    {
      role: 'ZorkBot',
      text: 'Welcome to Zork! You are about to embark on a journey into the world of Zork. Your mission is to find the treasures hidden throughout the land. Be warned, the land is filled with danger and you will need to use your wits to survive.',
    },
    {
      role: 'ZorkBot',
      text: 'You are standing in an open field west of a white house, with a boarded front door. There is a small mailbox here.',
    },
    {
      role: 'Player',
      text: 'I want to open the mailbox.',
    },
    {
      role: 'ZorkBot',
      text: 'Opening the mailbox reveals a leaflet.',
    },
    {
      role: 'Player',
      text: 'I want to read the leaflet.',
    },
    {
      role: 'ZorkBot',
      text: 'Welcome to Zork! You are about to embark on a journey into the world of Zork. Your mission is to find the treasures hidden throughout the land. Be warned, the land is filled with danger and you will need to use your wits to survive.',
    },
    {
      role: 'ZorkBot',
      text: 'You are standing in an open field west of a white house, with a boarded front door. There is a small mailbox here.',
    },
    {
      role: 'Player',
      text: 'I want to open the mailbox.',
    },
    {
      role: 'ZorkBot',
      text: 'Opening the mailbox reveals a leaflet.',
    },
    {
      role: 'Player',
      text: 'I want to read the leaflet.',
    },
    {
      role: 'ZorkBot',
      text: 'Welcome to Zork! You are about to embark on a journey into the world of Zork. Your mission is to find the treasures hidden throughout the land. Be warned, the land is filled with danger and you will need to use your wits to survive.',
    },
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
          <form>
            <input
              type="text"
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
        <div className="health-bar">
          {Array.from({ length: health / 10 }, (_, index) => (
            <img
              key={index}
              src="https://cdn.pixabay.com/photo/2017/09/23/16/33/pixel-heart-2779422_1280.png"
              className="pixelized--heart"
              alt="heart"
            />
          ))}
        </div>
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
