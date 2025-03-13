import React from 'react';

function ImageComponent({ src, alt, style }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        ...style
      }}
    />
  );
}

export default ImageComponent;