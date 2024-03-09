import { useState } from 'react';
// import { TextField, Button, Container, Typography, Input } from '@mui/material';

export default function Game() {
  const [inputValue, setInputValue] = useState<string>('');
  // const [outputValue, setOutputValue] = useState<string>('');
  const [messagesList, setMessagesList] = useState<Array<{ role: string; text: string }>>([
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
  ]);
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>, value: string) => {
    if (event.key === 'Enter') {
      const newMessage = {
        role: 'Player',
        text: value,
      };
      setMessagesList((prevMessages) => [...prevMessages, newMessage]);
      setInputValue('');
    }
  };

  const submitStuff = () => {
    const newMessage = {
      role: 'Player',
      text: inputValue,
    };
    setMessagesList((prevMessages) => [...prevMessages, newMessage]);
    setInputValue('');
  };

  return (
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
        <form onSubmit={(event) => event.preventDefault()}>
          <input
            type="text"
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            placeholder=""
            value={inputValue}
            className="command-input"
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => handleKeyPress(event, inputValue)}
            style={{ width: '400px' }} // Adjust the width as needed
          />
          <button onClick={submitStuff}>Button</button>
        </form>
      </div>
    </div>
  );
}
