import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  style = {},
  className = '',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={className}
    >
      {children}
    </button>
  );
};

export default Button;
