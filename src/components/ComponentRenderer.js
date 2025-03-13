import React from 'react';
import { useDispatch } from 'react-redux';
import { useDrag } from 'react-dnd';
import { Resizable } from 'react-resizable';
import { updateComponent, selectComponent } from '../redux/editorSlice';
import TextComponent from './TextComponent';
import ImageComponent from './ImageComponent';
import ContainerComponent from './ContainerComponent';
import ButtonComponent from './ButtonComponent';

function ComponentRenderer({ component }) {
  const dispatch = useDispatch();
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'PLACED_COMPONENT',
    item: { id: component.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  
  const handleResize = (event, { size }) => {
    dispatch(updateComponent({
      id: component.id,
      changes: {
        size: { width: size.width, height: size.height }
      }
    }));
  };
  
  const handleSelect = () => {
    dispatch(selectComponent(component.id));
  };
  
  // 컴포넌트 타입별 렌더링
  const renderComponent = () => {
    switch(component.type) {
      case 'TEXT':
        return <TextComponent content={component.content} style={component.style} />;
      case 'IMAGE':
        return <ImageComponent src={component.content.src} alt={component.content.alt} style={component.style} />;
      case 'CONTAINER':
        return <ContainerComponent style={component.style} />;
      case 'BUTTON':
        return <ButtonComponent content={component.content} style={component.style} />;
      default:
        return null;
    }
  };
  
  return (
    <Resizable
      width={component.size.width}
      height={component.size.height}
      onResize={handleResize}
      handle={<div className="resize-handle" />}
    >
      <div
        ref={drag}
        className={`placed-component ${isDragging ? 'dragging' : ''}`}
        style={{
          position: 'absolute',
          left: `${component.position.x}px`,
          top: `${component.position.y}px`,
          width: `${component.size.width}px`,
          height: `${component.size.height}px`,
          cursor: 'move',
        }}
        onClick={handleSelect}
      >
        {renderComponent()}
      </div>
    </Resizable>
  );
}

export default ComponentRenderer;