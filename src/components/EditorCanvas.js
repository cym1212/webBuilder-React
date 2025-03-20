import React, { useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { 
  addComponent, 
  updateComponentPosition, 
  selectComponents, 
  selectSelectedComponentId,
  selectLayoutInfo,
  selectComponent
} from '../redux/editorSlice';
import ComponentRenderer from './ComponentRenderer';
import { getLayoutComponentById } from '../layouts';
import { COMPONENT_TYPES } from '../constants';

function EditorCanvas() {
  const dispatch = useDispatch();
  const components = useSelector(selectComponents);
  const selectedComponentId = useSelector(selectSelectedComponentId);
  const layoutInfo = useSelector(selectLayoutInfo);
  const { selectedLayout, layoutProps } = layoutInfo;

  // 선택된 레이아웃 컴포넌트 가져오기
  const LayoutComponent = selectedLayout ? getLayoutComponentById(selectedLayout) : null;

  // 최상위 컴포넌트만 필터링 (부모가 없는 컴포넌트)
  const rootComponents = components.filter(comp => !comp.parentId);

  // 빈 캔버스 영역 클릭 핸들러
  const handleCanvasClick = (e) => {
    // 이벤트가 캔버스 자체에서 발생했는지 확인 (버블링된 이벤트가 아닌지)
    if (e.target === e.currentTarget ||
        e.target.className === 'layout-main-content' ||
        e.target.className.includes('editor-canvas')) {
      // 모든 컴포넌트 선택 해제 (selectComponent에 null 전달)
      dispatch(selectComponent(null));
    }
  };

  // 컴포넌트의 최대 Y 위치를 계산하여 메인 영역 높이 결정
  const calculateMainContentHeight = () => {
    if (rootComponents.length === 0) return 300; // 기본 최소 높이

    let maxY = 0;
    rootComponents.forEach(comp => {
      const bottomY = comp.position.y + comp.size.height;
      if (bottomY > maxY) {
        maxY = bottomY;
      }
    });

    return Math.max(300, maxY + 50); // 최소 300px, 컴포넌트가 있으면 가장 낮은 지점 + 50px 여백
  };

  const mainContentHeight = calculateMainContentHeight();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item, monitor) => {
      // 이미 다른 곳에서 드롭된 경우 처리하지 않음
      if (monitor.didDrop()) {
        return;
      }
      
      
      // 직접 컴포넌트 타입 확인 + 카테고리 확인
      const dropComponentType = item.type;
      const category = item.category || 'unknown';
      
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

      // 이미 존재하는 컴포넌트의 경우 위치 업데이트 (부모에서 최상위로 이동)
      if (item.id) {
        dispatch(updateComponentPosition({ 
          id: item.id, 
          newPosition: { x: 0, y }, // x를 항상 0으로 설정
          parentId: null,  // 부모 제거 (최상위로 이동)
          size: { width: '100%', height: undefined } // 너비를 항상 100%로 설정
        }));
      } else {
        // 컴포넌트 타입에 따른 기본 크기 설정
        let defaultWidth = '100%';
        let defaultHeight = 50;
        
        // 정확한 컴포넌트 타입 결정
        const newCompType = dropComponentType;
        
        switch(newCompType) {
          case COMPONENT_TYPES.TEXT:
            defaultHeight = 50;
            break;
          case COMPONENT_TYPES.IMAGE:
            defaultHeight = 200;
            break;
          case COMPONENT_TYPES.BUTTON:
            defaultHeight = 40;
            break;
          case COMPONENT_TYPES.CONTAINER:
            defaultHeight = 300;
            break;
          case COMPONENT_TYPES.ROW:
            defaultHeight = 100;
            break;
          case COMPONENT_TYPES.COLUMN:
            defaultHeight = 200;
            break;
          case COMPONENT_TYPES.LOGIN:
            defaultHeight = 400;
            break;
          case COMPONENT_TYPES.BOARD:
            defaultHeight = 600;
            break;
          case COMPONENT_TYPES.DETAIL_PAGE:
            defaultHeight = 800;
            break;
          default:
            console.warn('알 수 없는 컴포넌트 타입:', newCompType);
            defaultHeight = 50;
        }

        // 새 고유 ID 생성
        const newComponentId = uuidv4();
        
        // 새 컴포넌트 추가
        dispatch(addComponent({
          id: newComponentId,
          type: newCompType, // 명확한 타입 사용
          position: { x: 0, y }, // x를 0으로 설정하여 왼쪽부터 시작하도록 함
          size: { width: defaultWidth, height: defaultHeight },
          style: {},
          content: getDefaultContent(newCompType),
          parentId: null // 최상위 컴포넌트
        }));
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  }), []);

  const getDefaultContent = (type) => {
    
    // COMPONENT_TYPES와 직접 비교
    switch(type) {
      case COMPONENT_TYPES.TEXT:
        return '텍스트를 입력하세요';
      case COMPONENT_TYPES.IMAGE:
        return { src: 'https://via.placeholder.com/150', alt: '이미지' };
      case COMPONENT_TYPES.BUTTON:
        return '버튼';
      case COMPONENT_TYPES.LOGIN:
        return '';
      case COMPONENT_TYPES.BOARD:
        return '';
      case COMPONENT_TYPES.DETAIL_PAGE:
        return '';
      case COMPONENT_TYPES.ROW:
        return '';
      case COMPONENT_TYPES.COLUMN:
        return '';
      case COMPONENT_TYPES.CONTAINER:
        return '';
      default:
        console.warn('알 수 없는 컴포넌트 타입(컨텐츠 생성):', type);
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
      onClick={handleCanvasClick}
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
              onClick={handleCanvasClick}
            >
              {rootComponents.map(component => (
                <ComponentRenderer key={component.id} component={component} />
              ))}
            </div>
          </LayoutComponent>
        </div>
      ) : (
        // 레이아웃이 없는 경우 기존 방식으로 컴포넌트 렌더링
        <>
          {rootComponents.map(component => (
            <ComponentRenderer key={component.id} component={component} />
          ))}
        </>
      )}
    </div>
  );
}

export default EditorCanvas;