import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDrag, useDrop } from 'react-dnd';
import { updateComponent, selectComponent, updateComponentPosition, selectComponents } from '../redux/editorSlice';
import TextComponent from './TextComponent';
import ImageComponent from './ImageComponent';
import ContainerComponent from './ContainerComponent';
import ButtonComponent from './ButtonComponent';
import LoginForm from './LoginForm';
import BoardComponent from './BoardComponent';
import DetailPageComponent from './DetailPageComponent';
import RowComponent from './RowComponent';
import ColumnComponent from './ColumnComponent';
import { COMPONENT_TYPES } from '../constants';
import './ComponentRenderer.css';

function ComponentRenderer({ component }) {
  const dispatch = useDispatch();
  const allComponents = useSelector(selectComponents);
  const [resizing, setResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const componentRef = useRef(null);
  
  // 이 컴포넌트의 자식 컴포넌트들 찾기
  const childComponents = allComponents.filter(comp => comp.parentId === component.id);
  
  // 부모 컴포넌트 찾기
  const parentComponent = component.parentId ? allComponents.find(comp => comp.id === component.parentId) : null;
  const isChildOfColumn = parentComponent?.type === COMPONENT_TYPES.COLUMN;
  const isChildOfRow = parentComponent?.type === COMPONENT_TYPES.ROW;
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: { 
      id: component.id, 
      type: component.type,
      hasChildren: childComponents.length > 0  // 자식이 있는지 여부 전달
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    // 드래그 종료 시 호출되는 함수
    end: (item, monitor) => {
      // 드롭이 성공하지 않았다면 원래 위치로 복귀
      if (!monitor.didDrop() && item.hasChildren) {
        // 자식이 있는 컴포넌트가 사라지지 않도록 원래 위치 유지
        dispatch(updateComponentPosition({ 
          id: component.id, 
          newPosition: component.position,
          parentId: component.parentId
        }));
      }
    }
  }), [component.id, component.type, childComponents.length, component.position, component.parentId]);

  const [, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item, monitor) => {
      // Row나 Column 컴포넌트는 자체적으로 드롭 처리
      if (component.type === COMPONENT_TYPES.ROW || component.type === COMPONENT_TYPES.COLUMN) {
        return;
      }
      
      const offset = monitor.getClientOffset();
      if (!offset) return;

      const canvas = document.getElementById('editor-canvas');
      if (!canvas) return;

      const canvasRect = canvas.getBoundingClientRect();
      let x = offset.x - canvasRect.left;
      let y = offset.y - canvasRect.top;

      // ✅ 기존 컴포넌트라면 위치 업데이트
      if (item.id === component.id) {
        dispatch(updateComponentPosition({ 
          id: component.id, 
          newPosition: { x, y },
          parentId: null // 최상위로 이동
        }));
      }
    },
  }), [component.id, component.type]);
  
  const handleSelect = (e) => {
    e.stopPropagation();
    dispatch(selectComponent(component.id));
  };
  
  // 부모 컴포넌트의 너비와 높이 구하기
  const getParentDimensions = () => {
    if (!component.parentId) return null;
    
    const parentEl = document.getElementById(
      parentComponent?.type === COMPONENT_TYPES.ROW 
        ? `row-${component.parentId}`
        : parentComponent?.type === COMPONENT_TYPES.COLUMN
          ? `col-${component.parentId}`
          : null
    );
    
    if (!parentEl) return null;
    
    const rect = parentEl.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  };
  
  // 리사이즈 시작 핸들러
  const handleResizeStart = (e, direction) => {
    e.stopPropagation();
    e.preventDefault();
    
    handleSelect(e); // 컴포넌트 선택
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
    
    // 부모 컴포넌트 크기 제한 적용
    if (component.parentId) {
      const parentDimensions = getParentDimensions();
      if (parentDimensions) {
        // 부모 컴포넌트의 크기와 현재 컴포넌트의 위치를 고려하여 최대 크기 계산
        const maxWidth = parentDimensions.width - newX;
        const maxHeight = parentDimensions.height - newY;
        
        // 부모 컴포넌트 영역을 넘지 않도록 제한
        if (newWidth > maxWidth) {
          newWidth = maxWidth;
          // 왼쪽으로 리사이즈할 때 위치 조정
          if (resizeDirection.includes('w')) {
            newX = component.position.x + (startSize.width - newWidth);
          }
        }
        
        if (newHeight > maxHeight) {
          newHeight = maxHeight;
          // 위로 리사이즈할 때 위치 조정
          if (resizeDirection.includes('n')) {
            newY = component.position.y + (startSize.height - newHeight);
          }
        }
      }
    }
    
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
      case COMPONENT_TYPES.TEXT:
        return <TextComponent content={component.content} style={component.style} />;
      case COMPONENT_TYPES.IMAGE:
        return <ImageComponent src={component.content.src} alt={component.content.alt} style={component.style} />;
      case COMPONENT_TYPES.CONTAINER:
        return <ContainerComponent style={component.style} />;
      case COMPONENT_TYPES.BUTTON:
        return <ButtonComponent content={component.content} style={component.style} />;
      case COMPONENT_TYPES.LOGIN:
        return <LoginForm style={component.style} />;
      case COMPONENT_TYPES.BOARD:
        return <BoardComponent style={component.style} data={component.data} />;
      case COMPONENT_TYPES.DETAIL_PAGE:
        return <DetailPageComponent style={component.style} data={component.data} />;
      case COMPONENT_TYPES.ROW:
        return (
          <RowComponent 
            content={component.content} 
            style={component.style} 
            data={component.data} 
            id={component.id}
            components={allComponents}
          />
        );
      case COMPONENT_TYPES.COLUMN:
        return (
          <ColumnComponent 
            content={component.content} 
            style={component.style} 
            data={component.data} 
            id={component.id}
            components={allComponents}
          />
        );
      default:
        return null;
    }
  };
  
  // Row나 Column이 다른 Row나 Column의 하위에 있을 때 포지션을 absolute로 설정하지 않도록 처리
  const isGridComponent = component.type === COMPONENT_TYPES.ROW || component.type === COMPONENT_TYPES.COLUMN;
  const isChildOfGridComponent = component.parentId !== undefined && component.parentId !== null;
  
  // 그리드 내부 자식 컴포넌트의 스타일 조정
  let componentStyle;
  
  if (isGridComponent && isChildOfGridComponent) {
    // 다른 그리드 컴포넌트 내부에 있는 Row, Column - 자유 배치
    componentStyle = {
      cursor: resizing ? 'auto' : 'move',
      opacity: isDragging ? 0.5 : 1,
      border: component.isSelected ? '1px dashed #007bff' : '1px dashed #ccc',
      boxSizing: 'border-box',
      margin: '0',
      position: 'absolute',
      width: `${component.size.width}px`,
      height: `${component.size.height}px`,
      left: `${component.position.x}px`,
      top: `${component.position.y}px`,
      zIndex: component.isSelected ? 100 : 1
    };
  } else if (isGridComponent) {
    // 최상위 그리드 컴포넌트 - 크기 조절 가능
    componentStyle = {
      cursor: resizing ? 'auto' : 'move',
      opacity: isDragging ? 0.5 : 1,
      border: component.isSelected ? '1px dashed #007bff' : '1px dashed #ccc',
      boxSizing: 'border-box',
      margin: '0',
      position: 'absolute',
      width: `${component.size.width}px`,
      height: `${component.size.height}px`,
      left: `${component.position.x}px`,
      top: `${component.position.y}px`,
      zIndex: component.isSelected ? 100 : 1
    };
  } else if (isChildOfGridComponent) {
    // 그리드 내부의 일반 컴포넌트 - 자유 배치
    componentStyle = {
      position: 'absolute',
      left: `${component.position.x}px`,
      top: `${component.position.y}px`,
      width: `${component.size.width}px`,
      height: `${component.size.height}px`,
      margin: '0',
      cursor: resizing ? 'auto' : 'move',
      opacity: isDragging ? 0.5 : 1,
      border: component.isSelected ? '1px dashed #007bff' : '1px dashed #ccc',
      boxSizing: 'border-box',
      zIndex: component.isSelected ? 100 : 1
    };
  } else {
    // 최상위 컴포넌트 - 가로 세로 크기 조절 모두 가능
    componentStyle = {
      position: 'absolute',
      left: `${component.position.x}px`,
      top: `${component.position.y}px`,
      width: `${component.size.width}px`,
      height: `${component.size.height}px`,
      cursor: resizing ? 'auto' : 'move',
      opacity: isDragging ? 0.5 : 1,
      border: component.isSelected ? '1px dashed #007bff' : '1px dashed #ccc',
      boxSizing: 'border-box',
      zIndex: component.isSelected ? 100 : 1
    };
  }
  
  return (
    <div
      ref={(node) => {
        componentRef.current = node;
        drag(drop(node));
      }}
      className={`placed-component ${isDragging ? 'dragging' : ''} ${component.isSelected ? 'selected-component' : ''} ${isChildOfGridComponent ? 'grid-child' : ''}`}
      style={componentStyle}
      onClick={handleSelect}
    >
      {renderComponent()}
      
      {/* 리사이즈 핸들 - 모든 컴포넌트에 제공 */}
      <>
        <div className="resize-handle e" onMouseDown={(e) => handleResizeStart(e, 'e')}></div>
        <div className="resize-handle w" onMouseDown={(e) => handleResizeStart(e, 'w')}></div>
        <div className="resize-handle s" onMouseDown={(e) => handleResizeStart(e, 's')}></div>
        <div className="resize-handle n" onMouseDown={(e) => handleResizeStart(e, 'n')}></div>
        <div className="resize-handle se" onMouseDown={(e) => handleResizeStart(e, 'se')}></div>
        <div className="resize-handle sw" onMouseDown={(e) => handleResizeStart(e, 'sw')}></div>
        <div className="resize-handle ne" onMouseDown={(e) => handleResizeStart(e, 'ne')}></div>
        <div className="resize-handle nw" onMouseDown={(e) => handleResizeStart(e, 'nw')}></div>
      </>
    </div>
  );
}

export default ComponentRenderer;

