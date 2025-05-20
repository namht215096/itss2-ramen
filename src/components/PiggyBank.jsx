import React from 'react';

const PiggyBank = ({ value }) => {
  // Define animation style
  const animateStyle = {
    animation: 'pulse 2s infinite',
    transformOrigin: 'center center',
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}
      </style>
      {value < 25 && (
        <svg width="100" height="100" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={animateStyle}>
          <circle cx="32" cy="32" r="30" fill="#FFC0CB" stroke="#000" strokeWidth="2"/>
          <text x="32" y="37" fontSize="20" textAnchor="middle" fill="#000">Empty</text>
        </svg>
      )}
      {value >= 25 && value < 50 && (
        <svg width="100" height="100" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={animateStyle}>
          <circle cx="32" cy="32" r="30" fill="#FF69B4" stroke="#000" strokeWidth="2"/>
          <text x="32" y="37" fontSize="20" textAnchor="middle" fill="#000">Low</text>
        </svg>
      )}
      {value >= 50 && value < 75 && (
        <svg width="100" height="100" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={animateStyle}>
          <circle cx="32" cy="32" r="30" fill="#DB7093" stroke="#000" strokeWidth="2"/>
          <text x="32" y="37" fontSize="20" textAnchor="middle" fill="#000">Medium</text>
        </svg>
      )}
      {value >= 75 && (
        <svg width="100" height="100" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={animateStyle}>
          <circle cx="32" cy="32" r="30" fill="#C71585" stroke="#000" strokeWidth="2"/>
          <text x="32" y="37" fontSize="20" textAnchor="middle" fill="#FFF">Full</text>
        </svg>
      )}
    </>
  );
};

export default PiggyBank;
