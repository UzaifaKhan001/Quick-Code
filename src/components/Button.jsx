import React from 'react';
import './Button.css'; // Button specific styling

const Button = ({ text, className }) => {
  return (
    <button className={className}>
      {text}
    </button>
  );
};

export default Button;
