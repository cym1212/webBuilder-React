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
      type: component.type.toString(),
      componentType: component.type,
      parentId: component.parentId,
      order: component.order,
      hasChildren: childComponents.length > 0  // 자식이 있는지 여부 전달
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    // 드래그 종료 시 호출되는 함수
    end: (item, monitor) => {
      // 드롭이 성공하지 않았다면 원래 위치로 복귀
      if (!monitor.didDrop()) {
        // 원래 위치로 복귀
        dispatch(updateComponentPosition({ 
          id: component.id, 
          newPosition: component.position,
          parentId: component.parentId
        }));
      }
    }
  }), [component.id, component.type, component.parentId, component.order, childComponents.length, component.position]);

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
    let newWidth = '100%'; // 항상 width를 100%로 설정
    let newHeight = startSize.height;
    let newX = 0; // x 좌표는 항상 0
    let newY = component.position.y;
    
    // 방향에 따른 크기 및 위치 조정
    switch (resizeDirection) {
      case 'e':
        // width는 100%로 고정, paddingRight 조정
        dispatch(updateComponent({
          id: component.id,
          changes: {
            style: {
              ...component.style,
              paddingRight: Math.max(0, parseInt(component.style.paddingRight || '0') - Math.floor(deltaX)) + 'px'
            }
          }
        }));
        return;
      case 'w':
        // width는 100%로 고정, paddingLeft 조정
        dispatch(updateComponent({
          id: component.id,
          changes: {
            style: {
              ...component.style,
              paddingLeft: Math.max(0, parseInt(component.style.paddingLeft || '0') + Math.floor(deltaX)) + 'px'
            }
          }
        }));
        return;
      case 's':
        newHeight = startSize.height + deltaY;
        break;
      case 'n':
        newHeight = startSize.height - deltaY;
        newY = component.position.y + deltaY;
        break;
      case 'se':
        // width는 100%로 고정, 높이만 조정
        newHeight = startSize.height + deltaY;
        dispatch(updateComponent({
          id: component.id,
          changes: {
            style: {
              ...component.style,
              paddingRight: Math.max(0, parseInt(component.style.paddingRight || '0') - Math.floor(deltaX)) + 'px'
            }
          }
        }));
        break;
      case 'sw':
        // width는 100%로 고정, 높이만 조정
        newHeight = startSize.height + deltaY;
        dispatch(updateComponent({
          id: component.id,
          changes: {
            style: {
              ...component.style,
              paddingLeft: Math.max(0, parseInt(component.style.paddingLeft || '0') + Math.floor(deltaX)) + 'px'
            }
          }
        }));
        break;
      case 'ne':
        // width는 100%로 고정, 높이만 조정
        newHeight = startSize.height - deltaY;
        newY = component.position.y + deltaY;
        dispatch(updateComponent({
          id: component.id,
          changes: {
            style: {
              ...component.style,
              paddingRight: Math.max(0, parseInt(component.style.paddingRight || '0') - Math.floor(deltaX)) + 'px'
            }
          }
        }));
        break;
      case 'nw':
        // width는 100%로 고정, 높이만 조정
        newHeight = startSize.height - deltaY;
        newY = component.position.y + deltaY;
        dispatch(updateComponent({
          id: component.id,
          changes: {
            style: {
              ...component.style,
              paddingLeft: Math.max(0, parseInt(component.style.paddingLeft || '0') + Math.floor(deltaX)) + 'px'
            }
          }
        }));
        break;
      default:
        break;
    }
    
    // 최소 크기 제한
    newHeight = Math.max(20, newHeight);
    
    // 부모 컴포넌트 크기 제한 적용
    if (component.parentId) {
      const parentDimensions = getParentDimensions();
      if (parentDimensions) {
        // 부모 컴포넌트의 크기와 현재 컴포넌트의 위치를 고려하여 최대 크기 계산
        const maxHeight = parentDimensions.height - newY;
        
        // 부모 컴포넌트 영역을 넘지 않도록 제한
        if (newHeight > maxHeight) {
          newHeight = maxHeight;
          // 위로 리사이즈할 때 위치 조정
          if (resizeDirection.includes('n')) {
            newY = component.position.y + (startSize.height - newHeight);
          }
        }
      }
    }
    
    // 높이만 업데이트
    if (resizeDirection.includes('n') || resizeDirection.includes('s')) {
      dispatch(updateComponent({
        id: component.id,
        changes: {
          size: { width: '100%', height: newHeight },
          position: { x: 0, y: newY }
        }
      }));
    }
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
    const componentType = `${component.type}`.toUpperCase();
    
    switch(componentType) {
      case 'TEXT':
        return <TextComponent content={component.content} style={component.style} />;
      case 'IMAGE':
        return <ImageComponent src={component.content?.src || ''} alt={component.content?.alt || ''} style={component.style} />;
      case 'CONTAINER':
        return (
          <ContainerComponent style={component.style}>
            {childComponents.length > 0 ? 
              childComponents.map(child => (
                <ComponentRenderer key={child.id} component={child} />
              )) 
              : component.content
            }
          </ContainerComponent>
        );
      case 'BUTTON':
        return <ButtonComponent content={component.content || '버튼'} style={component.style} />;
      case 'LOGIN':
        return <LoginForm style={component.style} />;
      case 'BOARD':
        return <BoardComponent style={component.style} data={component.data} />;
      case 'DETAIL_PAGE':
        return <DetailPageComponent style={component.style} data={component.data} />;
      case 'ROW':
        return (
          <RowComponent 
            content={component.content} 
            style={component.style} 
            data={component.data} 
            id={component.id}
            components={allComponents}
          />
        );
      case 'COLUMN':
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
        console.warn('알 수 없는 컴포넌트 타입:', component.type);
        return <div>알 수 없는 컴포넌트 타입: {component.type}</div>;
    }
  };
  
  // 그리드 컴포넌트 여부 확인 (Row 또는 Column)
  const isGridComponent = component.type === COMPONENT_TYPES.ROW || component.type === COMPONENT_TYPES.COLUMN;
  
  // 부모가 그리드 컴포넌트인지 확인
  const isChildOfGridComponent = parentComponent && (parentComponent.type === COMPONENT_TYPES.ROW || parentComponent.type === COMPONENT_TYPES.COLUMN);
  
  // 그리드 내부 자식 컴포넌트의 스타일 조정
  let componentStyle;
  
  if (isGridComponent && isChildOfGridComponent) {
    // 다른 그리드 컴포넌트 내부에 있는 Row, Column
    componentStyle = {
      cursor: resizing ? 'auto' : 'move',
      opacity: isDragging ? 0.5 : 1,
      border: component.isSelected ? '2px solid #007bff' : 'none',
      boxSizing: 'border-box',
      margin: '0 0 5px 0',
      position: 'relative', // absolute에서 relative로 변경
      width: '100%', // 항상 100% 너비 보장
      height: `${component.size.height}px`,
      zIndex: component.isSelected ? 10 : 1,
      paddingLeft: '0px',
      paddingRight: '0px',
      paddingTop: component.style.paddingTop || '0px',
      paddingBottom: component.style.paddingBottom || '0px',
      ...component.style
    };
  } else if (isGridComponent) {
    // 최상위 그리드 컴포넌트
    componentStyle = {
      cursor: 'default',
      opacity: isDragging ? 0.5 : 1,
      border: component.isSelected ? '2px solid #007bff' : 'none',
      boxSizing: 'border-box',
      margin: '0 0 5px 0',
      position: 'relative', // absolute에서 relative로 변경
      width: '100%', // 항상 100% 너비 보장
      height: `${component.size.height}px`,
      zIndex: component.isSelected ? 10 : 1,
      backgroundColor: 'transparent',
      borderRadius: '0px',
      paddingLeft: '0px',
      paddingRight: '0px',
      paddingTop: '0px',
      paddingBottom: '0px',
      ...component.style
    };
  } else if (isChildOfGridComponent) {
    // 그리드 내부의 일반 컴포넌트
    componentStyle = {
      position: 'relative', // absolute에서 relative로 변경
      width: '100%', // 항상 100% 너비 보장
      height: `${component.size.height}px`,
      margin: '0 0 5px 0',
      cursor: 'default',
      opacity: isDragging ? 0.5 : 1,
      border: component.isSelected ? '2px solid #007bff' : 'none',
      boxSizing: 'border-box',
      zIndex: component.isSelected ? 10 : 1,
      paddingLeft: '0px',
      paddingRight: '0px',
      paddingTop: component.style.paddingTop || '0px',
      paddingBottom: component.style.paddingBottom || '0px',
      ...component.style
    };
  } else {
    // 최상위 컴포넌트
    componentStyle = {
      position: 'relative', // absolute에서 relative로 변경
      width: '100%', // 항상 100% 너비 보장
      height: `${component.size.height}px`,
      margin: '0 0 5px 0',
      opacity: isDragging ? 0.5 : 1,
      border: component.isSelected ? '2px solid #007bff' : 'none',
      boxSizing: 'border-box',
      paddingLeft: '0px',
      paddingRight: '0px',
      paddingTop: component.style.paddingTop || '0px',
      paddingBottom: component.style.paddingBottom || '0px',
      transition: 'padding 0.2s ease',
      ...component.style
    };
  }
  
  return (
    <div
      id={`component-${component.id}`}
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

