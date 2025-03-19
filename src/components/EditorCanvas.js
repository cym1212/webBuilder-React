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

  // 컴포넌트의 최대 Y 위치를 계산하여 메인 영역 높이 결정
  const calculateMainContentHeight = () => {
    if (components.length === 0) return 300; // 기본 최소 높이

    let maxY = 0;
    components.forEach(comp => {
      const bottomY = comp.position.y + comp.size.height;
      if (bottomY > maxY) {
        maxY = bottomY;
      }
    });

    return Math.max(300, maxY + 50); // 최소 300px, 컴포넌트가 있으면 가장 낮은 지점 + 50px 여백
  };

  const mainContentHeight = calculateMainContentHeight();

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
          y = Math.min(mainContentHeight - selectedComponent.size.height, y + step);
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

      dispatch(updateComponentPosition({ id: selectedComponentId, newPosition: { x, y } }));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch, selectedComponentId, components, mainContentHeight]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset) return; 

      const canvas = document.getElementById('editor-canvas');
      if (!canvas) return; 

      const canvasRect = canvas.getBoundingClientRect();
      
      // 캔버스 좌표로 변환
      let x = offset.x - canvasRect.left;
      let y = offset.y - canvasRect.top;
      
      // 레이아웃 사용 시 메인 컨텐츠 영역 내에 배치되도록 제한
      if (LayoutComponent) {
        const mainContent = document.querySelector('.layout-main-content');
        if (mainContent) {
          const mainContentRect = mainContent.getBoundingClientRect();
          // 메인 컨텐츠 영역 내 상대적 위치로 변환
          x = offset.x - mainContentRect.left;
          y = offset.y - mainContentRect.top;
          
          // 메인 컨텐츠 영역 내에 있는지 확인
          if (x < 0 || x > mainContentRect.width || y < 0) {
            // 영역 밖이면 가장 가까운 메인 컨텐츠 영역 내 지점으로 조정
            x = Math.max(0, Math.min(x, mainContentRect.width));
            y = Math.max(0, y);
          }
        }
      }

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
      className={`editor-canvas ${isOver ? 'drop-active' : ''}`}
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
            {/* 레이아웃 내부에 메인 컨텐츠 영역을 정의하고, 그 안에 컴포넌트 배치 */}
            <div 
              className="layout-main-content" 
              style={{ 
                position: 'relative', 
                minHeight: `${mainContentHeight}px`, 
                padding: '20px',
                width: '100%',
                backgroundColor: isOver ? 'rgba(0, 123, 255, 0.05)' : 'transparent',
                border: isOver ? '2px dashed #007bff' : 'none',
                transition: 'background-color 0.3s, border 0.3s'
              }}
            >
              {components.map(component => (
                <ComponentRenderer key={component.id} component={component} />
              ))}
            </div>
          </LayoutComponent>
        </div>
      ) : (
        // 레이아웃이 없는 경우 기존 방식으로 컴포넌트 렌더링
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