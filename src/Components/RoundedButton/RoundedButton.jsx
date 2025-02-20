import React from 'react';

function RoundedButton({ icon, onClick, size, color, backgroundColor, borderColor }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: size,
        height: size,
        backgroundColor,
        borderColor,
        borderRadius: '25%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid',
        cursor: 'pointer',
        outline: 'none',
        transition: 'background-color 0.3s ease, transform 0.3s ease',
      }}
      className="rounded-button"
    >
      <div
        style={{
          width: '60%',
          height: '60%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s ease, opacity 0.3s ease',
        }}
      >
        {icon}
      </div>
    </button>
  );
}


export default RoundedButton;
