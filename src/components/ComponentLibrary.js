import React from 'react';
import { useDrag } from 'react-dnd';
import { COMPONENT_TYPES } from '../constants';

const DraggableComponent = ({ type, name, icon }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="draggable-component"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="component-icon">{icon}</div>
      <div className="component-name">{name}</div>
    </div>
  );
};

function ComponentLibrary() {
  return (
    <div className="component-library">
      <h3>구성 요소</h3>
      <div className="components-list">
        <DraggableComponent 
          type={COMPONENT_TYPES.TEXT} 
          name="텍스트" 
          icon="T" 
        />
        <DraggableComponent 
          type={COMPONENT_TYPES.IMAGE} 
          name="이미지" 
          icon="🖼️" 
        />
        <DraggableComponent 
          type={COMPONENT_TYPES.CONTAINER} 
          name="영역" 
          icon="⬚" 
        />
        <DraggableComponent 
          type={COMPONENT_TYPES.BUTTON} 
          name="버튼" 
          icon="⏺" 
        />
      </div>
    </div>
  );
}

export default ComponentLibrary;