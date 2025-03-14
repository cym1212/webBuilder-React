import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useDrag, useDrop } from 'react-dnd';
import { updateComponent, selectComponent, updateComponentPosition } from '../redux/editorSlice';
import TextComponent from './TextComponent';
import ImageComponent from './ImageComponent';
import ContainerComponent from './ContainerComponent';
import ButtonComponent from './ButtonComponent';
import './ComponentRenderer.css';

function ComponentRenderer({ component }) {
  const dispatch = useDispatch();
  const [resizing, setResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const componentRef = useRef(null);
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: { id: component.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset) return;

      const canvas = document.getElementById('editor-canvas');
      if (!canvas) return;

      const canvasRect = canvas.getBoundingClientRect();
      let x = offset.x - canvasRect.left;
      let y = offset.y - canvasRect.top;

      // ✅ 기존 컴포넌트라면 위치 업데이트
      if (item.id === component.id) {
        dispatch(updateComponentPosition({ id: component.id, newPosition: { x, y } }));
      }
    },
  }));
  
  const handleSelect = () => {
    dispatch(selectComponent(component.id));
  };
  
  // 리사이즈 시작 핸들러
  const handleResizeStart = (e, direction) => {
    e.stopPropagation();
    e.preventDefault();
    
    handleSelect(); // 컴포넌트 선택
    setResizing(true);
    setResizeDirection(direction);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize({ width: component.size.width, height: component.size.height });
    
    // 전역 이벤트 리스너 등록
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };
  
  // 리사이즈 중 핸들러
  const handleResizeMove = (e) => {
    if (!resizing) return;
    
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    let newWidth = startSize.width;
    let newHeight = startSize.height;
    let newX = component.position.x;
    let newY = component.position.y;
    
    // 방향에 따른 크기 및 위치 조정
    switch (resizeDirection) {
      case 'e':
        newWidth = startSize.width + deltaX;
        break;
      case 'w':
        newWidth = startSize.width - deltaX;
        newX = component.position.x + deltaX;
        break;
      case 's':
        newHeight = startSize.height + deltaY;
        break;
      case 'n':
        newHeight = startSize.height - deltaY;
        newY = component.position.y + deltaY;
        break;
      case 'se':
        newWidth = startSize.width + deltaX;
        newHeight = startSize.height + deltaY;
        break;
      case 'sw':
        newWidth = startSize.width - deltaX;
        newX = component.position.x + deltaX;
        newHeight = startSize.height + deltaY;
        break;
      case 'ne':
        newWidth = startSize.width + deltaX;
        newHeight = startSize.height - deltaY;
        newY = component.position.y + deltaY;
        break;
      case 'nw':
        newWidth = startSize.width - deltaX;
        newX = component.position.x + deltaX;
        newHeight = startSize.height - deltaY;
        newY = component.position.y + deltaY;
        break;
      default:
        break;
    }
    
    // 최소 크기 제한
    newWidth = Math.max(20, newWidth);
    newHeight = Math.max(20, newHeight);
    
    // 크기와 위치 업데이트
    dispatch(updateComponent({
      id: component.id,
      changes: {
        size: { width: newWidth, height: newHeight },
        position: { x: newX, y: newY }
      }
    }));
  };
  
  // 리사이즈 종료 핸들러
  const handleResizeEnd = () => {
    setResizing(false);
    setResizeDirection(null);
    
    // 전역 이벤트 리스너 제거
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  };
  
  // 컴포넌트 언마운트 시 이벤트 리스너 정리
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [resizing]);
  
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
    <div
      ref={(node) => {
        componentRef.current = node;
        drag(drop(node));
      }}
      className={`placed-component ${isDragging ? 'dragging' : ''} ${component.isSelected ? 'selected-component' : ''}`}
      style={{
        position: 'absolute',
        left: `${component.position.x}px`,
        top: `${component.position.y}px`,
        width: `${component.size.width}px`,
        height: `${component.size.height}px`,
        cursor: resizing ? 'auto' : 'move',
        opacity: isDragging ? 0.5 : 1,
        border: '1px dashed #ccc',
        boxSizing: 'border-box'
      }}
      onClick={handleSelect}
    >
      {renderComponent()}
      
      {/* 리사이즈 핸들 */}
      <div className="resize-handle e" onMouseDown={(e) => handleResizeStart(e, 'e')}></div>
      <div className="resize-handle w" onMouseDown={(e) => handleResizeStart(e, 'w')}></div>
      <div className="resize-handle s" onMouseDown={(e) => handleResizeStart(e, 's')}></div>
      <div className="resize-handle n" onMouseDown={(e) => handleResizeStart(e, 'n')}></div>
      <div className="resize-handle se" onMouseDown={(e) => handleResizeStart(e, 'se')}></div>
      <div className="resize-handle sw" onMouseDown={(e) => handleResizeStart(e, 'sw')}></div>
      <div className="resize-handle ne" onMouseDown={(e) => handleResizeStart(e, 'ne')}></div>
      <div className="resize-handle nw" onMouseDown={(e) => handleResizeStart(e, 'nw')}></div>
    </div>
  );
}

export default ComponentRenderer;