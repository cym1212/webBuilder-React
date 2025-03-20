import React from 'react';

function ButtonComponent({ content, style }) {
  // 기본 스타일과 사용자 스타일 병합
  const buttonStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: style.backgroundColor || '#007bff',
    color: style.color || 'white',
    border: style.border || 'none',
    borderRadius: style.borderRadius || '4px',
    padding: style.padding || '8px 16px',
    fontSize: style.fontSize || '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    boxSizing: 'border-box',
    ...style
  };

  return (
    <button style={buttonStyle}>
      {content}
    </button>
  );
}

export default ButtonComponent;
