import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { addComponent, selectComponents } from '../redux/editorSlice';
import ComponentRenderer from './ComponentRenderer';

function EditorCanvas() {
  const dispatch = useDispatch();
  const components = useSelector(selectComponents);
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const canvasRect = document.getElementById('editor-canvas').getBoundingClientRect();
      
      // 에디터 캔버스 내의 위치 계산
      const x = offset.x - canvasRect.left;
      const y = offset.y - canvasRect.top;
      
      // 새 컴포넌트 추가
      const newComponent = {
        id: uuidv4(),
        type: item.type,
        position: { x, y },
        size: { width: 150, height: 50 },
        style: {},
        content: getDefaultContent(item.type),
      };
      
      dispatch(addComponent(newComponent));
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  
  // 컴포넌트 타입별 기본 내용 설정
  const getDefaultContent = (type) => {
    switch(type) {
      case 'TEXT':
        return '텍스트를 입력하세요';
      case 'IMAGE':
        return { src: 'https://via.placeholder.com/150', alt: '이미지' };
      case 'BUTTON':
        return '버튼';
      default:
        return '';
    }
  };

  return (
    <div 
      id="editor-canvas"
      ref={drop} 
      className="editor-canvas"
      style={{ 
        backgroundColor: isOver ? '#f0f8ff' : 'white',
        position: 'relative',
        width: '100%',
        height: '100%'
      }}
    >
      {components.map(component => (
        <ComponentRenderer
          key={component.id}
          component={component}
        />
      ))}
    </div>
  );
}

export default EditorCanvas;
