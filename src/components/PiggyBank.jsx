import React from 'react';
import emptyGif from './empty.gif';
import standardGif from './standard.gif';
import fullGif from './full.gif';

const PiggyBank = ({ value }) => {
  let src;
  if (value === 0) {
    src = emptyGif;
  } else if (value > 0 && value < 100) {
    src = standardGif;
  } else if (value >= 100) {
    src = fullGif;
  } else {
    src = standardGif; // fallback
  }

  return (
    <img src={src} alt="Piggy Bank" width="200" height="200" />
  );
};

export default PiggyBank;
