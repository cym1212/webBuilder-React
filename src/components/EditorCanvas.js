import React, { useState, useEffect } from 'react';
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
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragPosition, setDragPosition] = useState(null); // 'above' or 'below'

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
    hover: (item, monitor) => {
      if (!item.id) return; // 새 컴포넌트는 처리하지 않음
      
      const offset = monitor.getClientOffset();
      if (!offset) return;
      
      // 현재 마우스 위치에서 컴포넌트 찾기
      const canvas = document.getElementById('editor-canvas');
      if (!canvas) return;
      
      const canvasRect = canvas.getBoundingClientRect();
      const y = offset.y - canvasRect.top;
      
      // 현재 위치에 있는 컴포넌트 찾기
      const hoveredComponent = findComponentAtPosition(rootComponents, 0, y);
      
      if (hoveredComponent && hoveredComponent.id !== item.id) {
        const componentEl = document.getElementById(`component-${hoveredComponent.id}`);
        if (componentEl) {
          const rect = componentEl.getBoundingClientRect();
          const middle = rect.top + (rect.height / 2);
          const position = offset.y < middle ? 'above' : 'below';
          
          // 드래그 오버 상태 업데이트
          setDragOverIndex(hoveredComponent.order || 0);
          setDragPosition(position);
        }
      } else {
        // 빈 공간에 드래그 중이거나 자기 자신 위에 드래그 중
        // 가장 가까운 컴포넌트 찾기
        const closestComponent = findClosestComponent(rootComponents, y, item.id);
        if (closestComponent) {
          const componentEl = document.getElementById(`component-${closestComponent.component.id}`);
          if (componentEl) {
            setDragOverIndex(closestComponent.component.order || 0);
            setDragPosition(closestComponent.position);
          }
        } else {
          setDragOverIndex(null);
          setDragPosition(null);
        }
      }
    },
    drop: (item, monitor) => {
      // 이미 다른 곳에서 드롭된 경우 처리하지 않음
      if (monitor.didDrop()) {
        return;
      }
      
      // 디버깅용 로그 추가
      console.log('캔버스에 드롭된 아이템:', item);
      
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
        }
      }

      // 이미 존재하는 컴포넌트의 경우 위치 업데이트 및 순서 변경
      if (item.id) {
        // 자기 자신 위에 드롭한 경우 무시
        if (dragOverIndex === null || dragPosition === null) {
          return;
        }
        
        // 현재 드래그 중인 컴포넌트
        const draggedComponent = rootComponents.find(comp => comp.id === item.id);
        if (!draggedComponent) return;
        
        // 현재 순서
        const currentOrder = draggedComponent.order || 0;
        
        // 타겟 컴포넌트 (드롭할 위치의 컴포넌트)
        const targetComponent = rootComponents.find(comp => (comp.order || 0) === dragOverIndex);
        if (!targetComponent) return;
        
        // 새로운 순서 계산
        let newOrder = dragOverIndex;
        if (dragPosition === 'below') {
          newOrder = dragOverIndex + 1;
        }
        
        console.log('컴포넌트 이동:', {
          draggedComponentId: item.id,
          currentOrder,
          targetOrder: newOrder,
          targetPosition: dragPosition
        });
        
        // 다른 컴포넌트들의 순서 조정
        rootComponents.forEach(comp => {
          if (comp.id === item.id) return;
          
          const compOrder = comp.order || 0;
          
          if (currentOrder < newOrder) {
            // 위에서 아래로 이동: 중간에 있는 컴포넌트들의 순서를 한칸씩 위로
            if (compOrder > currentOrder && compOrder < newOrder) {
              dispatch(updateComponentPosition({
                id: comp.id,
                newPosition: comp.position,
                order: compOrder - 1
              }));
            }
          } else if (currentOrder > newOrder) {
            // 아래에서 위로 이동: 중간에 있는 컴포넌트들의 순서를 한칸씩 아래로
            if (compOrder >= newOrder && compOrder < currentOrder) {
              dispatch(updateComponentPosition({
                id: comp.id,
                newPosition: comp.position,
                order: compOrder + 1
              }));
            }
          }
        });
        
        // 드래그 중인 컴포넌트를 새 위치로 이동
        dispatch(updateComponentPosition({
          id: item.id,
          newPosition: { x: 0, y: 0 },
          order: newOrder
        }));
      } else {
        // 새 컴포넌트 추가
        let defaultWidth = '100%';
        let defaultHeight = 50;
        
        // 정확한 컴포넌트 타입 결정
        const newCompType = item.type;
        
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
          parentId: null, // 최상위 컴포넌트
          order: findInsertPosition(rootComponents, y) // 순서 정보 추가
        }));
      }
      
      // 드롭 후 상태 초기화
      setDragOverIndex(null);
      setDragPosition(null);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  }), [rootComponents]);

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

  // 순서 기반으로 삽입 위치 찾기
  const findInsertPosition = (components, dropY) => {
    if (!components || components.length === 0) return 0;
    
    // y 좌표로 정렬된 컴포넌트 목록
    const sortedComponents = [...components].sort((a, b) => a.position.y - b.position.y);
    
    // 드롭 위치보다 아래에 있는 첫 번째 컴포넌트 찾기
    const insertIndex = sortedComponents.findIndex(comp => comp.position.y > dropY);
    
    // 찾지 못했다면 맨 뒤에 추가
    return insertIndex === -1 ? components.length : insertIndex;
  };

  // 특정 좌표에 있는 컴포넌트 찾기
  const findComponentAtPosition = (components, x, y) => {
    if (!components || components.length === 0) return null;
    
    // 모든 컴포넌트 DOM 요소를 확인
    for (const component of components) {
      const componentEl = document.getElementById(`component-${component.id}`);
      if (!componentEl) continue;
      
      const rect = componentEl.getBoundingClientRect();
      
      // 좌표가 컴포넌트 내에 있는지 확인
      if (y >= rect.top && y <= rect.bottom) {
        return component;
      }
    }
    
    return null;
  };

  // 가장 가까운 컴포넌트와 위치 찾기
  const findClosestComponent = (components, y, excludeId) => {
    if (!components || components.length === 0) return null;
    
    let closestDistance = Infinity;
    let closestComponent = null;
    let position = null;
    
    for (const component of components) {
      if (component.id === excludeId) continue;
      
      const componentEl = document.getElementById(`component-${component.id}`);
      if (!componentEl) continue;
      
      const rect = componentEl.getBoundingClientRect();
      const topDistance = Math.abs(y - rect.top);
      const bottomDistance = Math.abs(y - rect.bottom);
      
      if (topDistance < closestDistance) {
        closestDistance = topDistance;
        closestComponent = component;
        position = 'above';
      }
      
      if (bottomDistance < closestDistance) {
        closestDistance = bottomDistance;
        closestComponent = component;
        position = 'below';
      }
    }
    
    return closestComponent ? { component: closestComponent, position } : null;
  };

  // 컴포넌트 드래그 종료 시 상태 초기화
  useEffect(() => {
    if (!isOver) {
      setDragOverIndex(null);
      setDragPosition(null);
    }
  }, [isOver]);

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
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch'
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
                padding: '0px',
                width: '100%',
                backgroundColor: isOver ? 'rgba(0, 123, 255, 0.05)' : 'transparent',
                border: isOver ? '2px dashed #007bff' : 'none',
                transition: 'background-color 0.3s, border 0.3s',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}
              onClick={handleCanvasClick}
            >
              {/* 위치가 아닌 order 값으로 정렬하여 렌더링 */}
              {rootComponents
                .slice()
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((component, index) => {
                  const order = component.order || index;
                  const showAboveLine = dragOverIndex === order && dragPosition === 'above';
                  const showBelowLine = dragOverIndex === order && dragPosition === 'below';
                  
                  return (
                    <div key={component.id} style={{ position: 'relative' }}>
                      {showAboveLine && (
                        <div 
                          className="drop-indicator-line" 
                          style={{
                            position: 'absolute',
                            top: '-5px',
                            left: 0,
                            transform: 'translateY(-50%)'
                          }} 
                        />
                      )}
                      <ComponentRenderer component={component} />
                      {showBelowLine && (
                        <div 
                          className="drop-indicator-line" 
                          style={{
                            position: 'absolute',
                            bottom: '-5px',
                            left: 0,
                            transform: 'translateY(50%)'
                          }} 
                        />
                      )}
                    </div>
                  );
                })
              }
            </div>
          </LayoutComponent>
        </div>
      ) : (
        // 레이아웃이 없는 경우 순서대로 컴포넌트 렌더링
        <div className="editor-content" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '15px',
          width: '100%',
          padding: '0px' 
        }}>
          {/* 위치가 아닌 order 값으로 정렬하여 렌더링 */}
          {rootComponents
            .slice()
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((component, index) => {
              const order = component.order || index;
              const showAboveLine = dragOverIndex === order && dragPosition === 'above';
              const showBelowLine = dragOverIndex === order && dragPosition === 'below';
              
              return (
                <div key={component.id} style={{ position: 'relative' }}>
                  {showAboveLine && (
                    <div 
                      className="drop-indicator-line" 
                      style={{
                        position: 'absolute',
                        top: '-5px',
                        left: 0,
                        transform: 'translateY(-50%)'
                      }} 
                    />
                  )}
                  <ComponentRenderer component={component} />
                  {showBelowLine && (
                    <div 
                      className="drop-indicator-line" 
                      style={{
                        position: 'absolute',
                        bottom: '-5px',
                        left: 0,
                        transform: 'translateY(50%)'
                      }} 
                    />
                  )}
                </div>
              );
            })
          }
        </div>
      )}
    </div>
  );
}

export default EditorCanvas;