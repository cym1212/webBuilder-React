import React, { useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { 
  addComponent, 
  updateComponentPosition, 
  selectComponents, 
  selectSelectedComponentId,
  selectLayoutInfo
} from '../redux/editorSlice';
import ComponentRenderer from './ComponentRenderer';
import { getLayoutComponentById } from '../layouts';

function EditorCanvas() {
  const dispatch = useDispatch();
  const components = useSelector(selectComponents);
  const selectedComponentId = useSelector(selectSelectedComponentId);
  const layoutInfo = useSelector(selectLayoutInfo);
  const { selectedLayout, layoutProps } = layoutInfo;

  // 선택된 레이아웃 컴포넌트 가져오기
  const LayoutComponent = selectedLayout ? getLayoutComponentById(selectedLayout) : null;

  // ✅ 겹치지 않는 위치 찾기 함수
  // const getNonOverlappingPosition = (x, y, width, height) => {
  //   let newX = x;
  //   let newY = y;

  //   // 다른 컴포넌트와 충돌하는지 검사
  //   const isOverlapping = (nx, ny) => {
  //     return components.some(comp => {
  //       return (
  //         nx < comp.position.x + comp.size.width &&
  //         nx + width > comp.position.x &&
  //         ny < comp.position.y + comp.size.height &&
  //         ny + height > comp.position.y
  //       );
  //     });
  //   };

  //   // 겹치는 경우, 일정 간격(5px)씩 이동하여 빈 공간 찾기
  //   while (isOverlapping(newX, newY)) {
  //     newX += 5;  
  //     if (newX + width > 1200) {  
  //       newX = x;
  //       newY += 5;
  //     }
  //     if (newY + height > 800) {  
  //       break;
  //     }
  //   }

  //   return { x: newX, y: newY };
  // };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!selectedComponentId) return;

      const selectedComponent = components.find(comp => comp.id === selectedComponentId);
      if (!selectedComponent) return;

      let { x, y } = selectedComponent.position;
      const step = 10;  // 이동 간격 (10px)

      switch (event.key) {
        case 'ArrowUp':
          y = Math.max(0, y - step);
          break;
        case 'ArrowDown':
          y = Math.min(800 - selectedComponent.size.height, y + step);
          break;
        case 'ArrowLeft':
          x = Math.max(0, x - step);
          break;
        case 'ArrowRight':
          x = Math.min(1200 - selectedComponent.size.width, x + step);
          break;
        default:
          return;
      }

      // const { x: newX, y: newY } = getNonOverlappingPosition(x, y, selectedComponent.size.width, selectedComponent.size.height, selectedComponent.id);

      dispatch(updateComponentPosition({ id: selectedComponentId, newPosition: { x, y } }));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch, selectedComponentId, components]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset) return; 

      const canvas = document.getElementById('editor-canvas');
      if (!canvas) return; 

      const canvasRect = canvas.getBoundingClientRect();
      let x = offset.x - canvasRect.left;
      let y = offset.y - canvasRect.top;

      // 컴포넌트 타입에 따른 기본 크기 설정
      let defaultWidth = 150;
      let defaultHeight = 50;
      
      if (item.type === 'LOGIN') {
        defaultWidth = 300;
        defaultHeight = 300;
      }

      if (item.id) {
        dispatch(updateComponentPosition({ id: item.id, newPosition: { x: x, y: y } }));
      } else {
        dispatch(addComponent({
          id: uuidv4(),
          type: item.type,
          position: { x: x, y: y },
          size: { width: defaultWidth, height: defaultHeight },
          style: {},
          content: getDefaultContent(item.type),
        }));
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const getDefaultContent = (type) => {
    switch(type) {
      case 'TEXT':
        return '텍스트를 입력하세요';
      case 'IMAGE':
        return { src: 'https://via.placeholder.com/150', alt: '이미지' };
      case 'BUTTON':
        return '버튼';
      case 'LOGIN':
        return '로그인 폼';
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
        height: '100%',
        overflow: 'auto'
      }}
    >
      {LayoutComponent ? (
        <div className="layout-container" style={{ position: 'relative', height: '100%', width: '100%' }}>
          <LayoutComponent {...layoutProps}>
            {/* 레이아웃 내부에 기존 컴포넌트들 렌더링 */}
            <div className="layout-content">
              {components.map(component => (
                <ComponentRenderer key={component.id} component={component} />
              ))}
            </div>
          </LayoutComponent>
        </div>
      ) : (
        // 기존 방식으로 컴포넌트 렌더링
        <>
          {components.map(component => (
            <ComponentRenderer key={component.id} component={component} />
          ))}
        </>
      )}
    </div>
  );
}

export default EditorCanvas;