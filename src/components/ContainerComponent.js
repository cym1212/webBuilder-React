import React from 'react';

function ContainerComponent({ style, children }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: style.backgroundColor || '#f8f9fa',
        border: style.border || '1px solid #dee2e6',
        borderRadius: style.borderRadius || '4px',
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
          padding: '20px',
          textAlign: 'center'
        }}>
          컨테이너 영역
        </div>
      }
    </div>
  );
}

export default ContainerComponent;