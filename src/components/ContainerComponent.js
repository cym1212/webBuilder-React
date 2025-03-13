import React from 'react';

function ContainerComponent({ style, children }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: style.backgroundColor || 'transparent',
        border: style.border || '1px solid #dee2e6',
        borderRadius: style.borderRadius || '0',
        padding: style.padding || '0',
        ...style
      }}
    >
      {children}
    </div>
  );
}

export default ContainerComponent;