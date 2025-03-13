import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateComponent } from '../redux/editorSlice';

function TextComponent({ content, style, id }) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);
  
  const handleDoubleClick = () => {
    setIsEditing(true);
  };
  
  const handleBlur = () => {
    setIsEditing(false);
    dispatch(updateComponent({
      id,
      changes: { content: editValue }
    }));
  };
  
  if (isEditing) {
    return (
      <textarea
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        autoFocus
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          outline: 'none',
          resize: 'none',
          ...style
        }}
      />
    );
  }
  
  return (
    <div
      onDoubleClick={handleDoubleClick}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...style
      }}
    >
      {content}
    </div>
  );
}

export default TextComponent;