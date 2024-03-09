import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Input } from '@mui/material';
const ariaLabel = { 'aria-label': 'description' };
export default function Game() {
    const [inputValue, setInputValue] = useState<string>('');
    const [outputValue, setOutputValue] = useState<string>('');
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    };
  
    const handleExecuteCommand = () => {
      // You can implement your logic to process commands here
      // For now, let's just echo back the input
      setOutputValue(inputValue);
      setInputValue('');
    };
  
    return (
        <div className="command-terminal-container">
          <div className="command-output">
            <span>{outputValue}</span>
          </div>
          <div className="command-input-container">
            <input
              type="text"
              placeholder="Type your command here..."
              value={inputValue}
              onChange={handleInputChange}
              className="command-input"
              style={{ width: '400px' }} // Adjust the width as needed
            />
            <button onClick={handleExecuteCommand} className="execute-button">Execute</button>
          </div>
        </div>
    );
}