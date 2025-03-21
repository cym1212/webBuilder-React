import React from 'react';

function ContainerComponent({ style, children }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: style.backgroundColor || 'transparent',
        border: style.border || 'none',
        borderRadius: style.borderRadius || '0',
        padding: style.padding || '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      {children || 
        <div style={{ 
          color: '#6c757d', 
          fontStyle: 'italic',
          padding: '0',
          textAlign: 'center'
        }}>
          컨테이너 영역
        </div>
      }
    </div>
  );
}

export default ContainerComponent;