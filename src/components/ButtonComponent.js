import React from 'react';

function ButtonComponent({ content, style }) {
  return (
    <button
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: style.backgroundColor || '#007bff',
        color: style.color || 'white',
        border: style.border || 'none',
        borderRadius: style.borderRadius || '4px',
        cursor: 'pointer',
        ...style
      }}
    >
      {content}
    </button>
  );
}

export default ButtonComponent;
