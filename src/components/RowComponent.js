import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { addComponent, updateComponent, updateComponentPosition } from '../redux/editorSlice';
import './ComponentRenderer.css';
import ComponentRenderer from './ComponentRenderer';
import { COMPONENT_TYPES } from '../constants';

const RowComponent = ({ content, style, data, children, id, components = [] }) => {
  const dispatch = useDispatch();
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragPosition, setDragPosition] = useState(null); // 'above' or 'below'

  // 기본 스타일과 사용자 스타일 병합
  const mergedStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '80px',
    position: 'relative',
    padding: '0',
    flex: '1 1 100%',
    boxSizing: 'border-box',
    backgroundColor: style.backgroundColor || 'rgba(247, 250, 252, 0.5)',
    border: style.border || '1px solid #e2e8f0',
    borderRadius: style.borderRadius || '4px',
    paddingLeft: style.paddingLeft || '20px',
    paddingRight: style.paddingRight || '20px',
    paddingTop: style.paddingTop || '10px',
    paddingBottom: style.paddingBottom || '10px',
    ...style
  };

  // gutter 속성 처리
  if (data && data.gutter) {
    mergedStyle.gap = `${data.gutter}px`;
  }

  // 정렬 속성 처리 - 세로 방향에 맞게 수정
  if (data && data.verticalAlign) {
    switch (data.verticalAlign) {
      case 'top':
        mergedStyle.justifyContent = 'flex-start';
        break;
      case 'middle':
        mergedStyle.justifyContent = 'center';
        break;
      case 'bottom':
        mergedStyle.justifyContent = 'flex-end';
        break;
      case 'stretch':
        mergedStyle.justifyContent = 'space-between';
        break;
      default:
        break;
    }
  }

  if (data && data.horizontalAlign) {
    switch (data.horizontalAlign) {
      case 'left':
        mergedStyle.alignItems = 'flex-start';
        break;
      case 'center':
        mergedStyle.alignItems = 'center';
        break;
      case 'right':
        mergedStyle.alignItems = 'flex-end';
        break;
      case 'between':
        mergedStyle.alignItems = 'stretch';
        break;
      case 'around':
        mergedStyle.alignItems = 'stretch';
        break;
      default:
        break;
    }
  }

  // 이 Row에 속한 자식 컴포넌트 필터링
  const childComponents = components.filter(comp => comp.parentId === id);

  // 자식 컴포넌트 너비 자동 분할 계산은 수동으로 조정 가능하게 제거
  // 대신 컴포넌트가 추가될 때 적절한 초기 위치 설정

  // 드롭 기능 추가
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    hover: (item, monitor) => {
      if (!item.id) return; // 새 컴포넌트는 처리하지 않음
      
      const offset = monitor.getClientOffset();
      if (!offset) return;
      
      // 현재 Row 엘리먼트의 위치 정보
      const rowEl = document.getElementById(`row-${id}`);
      if (!rowEl) return;
      
      const rowRect = rowEl.getBoundingClientRect();
      const y = offset.y - rowRect.top;
      
      // 현재 위치에 있는 컴포넌트 찾기
      const hoveredComponent = findComponentAtPosition(childComponents, 0, y);
      
      if (hoveredComponent && hoveredComponent.id !== item.id) {
        const componentEl = document.getElementById(`component-${hoveredComponent.id}`);
        if (componentEl) {
          const rect = componentEl.getBoundingClientRect();
          const middle = rect.top + (rect.height / 2);
          const position = offset.y < middle ? 'above' : 'below';
          
          setDragOverIndex(hoveredComponent.order || 0);
          setDragPosition(position);
        }
      } else {
        // 빈 공간에 드래그 중
        setDragOverIndex(null);
        setDragPosition(null);
      }
    },
    drop: (item, monitor) => {
      // 이미 다른 곳에서 처리된 경우
      if (monitor.didDrop()) {
        return;
      }

      
      // 직접 컴포넌트 타입 확인 + 카테고리 확인
      const dropComponentType = item.type;
      const category = item.category || 'unknown';
      
      const offset = monitor.getClientOffset();
      if (!offset) return;

      // 현재 row 엘리먼트의 위치 정보
      const rowEl = document.getElementById(`row-${id}`);
      if (!rowEl) return;
      
      const rowRect = rowEl.getBoundingClientRect();
      
      // row 내부의 상대적 위치
      let x = offset.x - rowRect.left;
      let y = offset.y - rowRect.top;
      
      // 이미 있는 컴포넌트 위치 업데이트인 경우
      if (item.id) {
        // 현재 컴포넌트가 자신의 자식으로 드래그되는 것을 방지
        if (item.id === id) {
          return;
        }
        
        // 부모-자식 순환 참조 방지
        if (item.type === COMPONENT_TYPES.ROW || item.type === COMPONENT_TYPES.COLUMN) {
          // 현재 Row가 드래그하는 컴포넌트의 자식인지 확인
          const isChildOfDraggedComponent = checkIsChild(components, item.id, id);
          if (isChildOfDraggedComponent) {
            return; // 순환 참조가 발생하므로 드롭 취소
          }
        }
        
        // 드롭 위치에 있는 컴포넌트 찾기
        const componentAtDropPosition = findComponentAtPosition(childComponents, x, y);
        
        let insertIndex;
        
        // 다른 컴포넌트 위에 드롭한 경우
        if (componentAtDropPosition) {
          console.log('Row 내에서 다른 컴포넌트 위에 드롭:', componentAtDropPosition.id);
          
          // 자기 자신 위에 드롭한 경우 무시
          if (componentAtDropPosition.id === item.id) {
            return;
          }
          
          // 드롭된 컴포넌트의 현재 순서
          const draggedComponent = childComponents.find(c => c.id === item.id);
          const currentOrder = draggedComponent ? draggedComponent.order || 0 : -1;
          const targetOrder = componentAtDropPosition.order || 0;
          
          // 드롭 위치에 있는 컴포넌트의 위아래 여부 판단
          const componentEl = document.getElementById(`component-${componentAtDropPosition.id}`);
          if (componentEl) {
            const componentRect = componentEl.getBoundingClientRect();
            const componentMiddleY = componentRect.top + (componentRect.height / 2);
            
            if (offset.y < componentMiddleY) {
              // 컴포넌트 위쪽에 드롭 - 해당 컴포넌트 위로 배치
              insertIndex = targetOrder;
              
              // 이미 부모의 자식인 경우 
              if (draggedComponent) {
                if (currentOrder > targetOrder) {
                  // 위로 이동 - 사이의 컴포넌트들은 한 칸씩 아래로
                  childComponents.forEach(comp => {
                    if (comp.id !== item.id && 
                        (comp.order || 0) >= targetOrder && 
                        (comp.order || 0) < currentOrder) {
                      dispatch(updateComponentPosition({
                        id: comp.id,
                        newPosition: comp.position,
                        order: (comp.order || 0) + 1
                      }));
                    }
                  });
                }
              } else {
                // 모든 컴포넌트의 순서 조정
                childComponents.forEach(comp => {
                  if ((comp.order || 0) >= targetOrder) {
                    dispatch(updateComponentPosition({
                      id: comp.id,
                      newPosition: comp.position,
                      order: (comp.order || 0) + 1
                    }));
                  }
                });
              }
            } else {
              // 컴포넌트 아래쪽에 드롭 - 해당 컴포넌트 아래로 배치
              insertIndex = targetOrder + 1;
              
              if (draggedComponent) {
                // 이미 부모의 자식인 경우
                if (currentOrder < targetOrder) {
                  // 아래로 이동 - 사이의 컴포넌트들은 한 칸씩 위로
                  childComponents.forEach(comp => {
                    if (comp.id !== item.id && 
                        (comp.order || 0) > currentOrder && 
                        (comp.order || 0) <= targetOrder) {
                      dispatch(updateComponentPosition({
                        id: comp.id,
                        newPosition: comp.position,
                        order: (comp.order || 0) - 1
                      }));
                    }
                  });
                }
              } else {
                // 외부에서 오는 경우, targetOrder보다 큰 컴포넌트들의 순서 업데이트
                childComponents.forEach(comp => {
                  if ((comp.order || 0) >= insertIndex) {
                    dispatch(updateComponentPosition({
                      id: comp.id,
                      newPosition: comp.position,
                      order: (comp.order || 0) + 1
                    }));
                  }
                });
              }
            }
          } else {
            // DOM 요소를 찾지 못한 경우, 기본 위치에 추가
            insertIndex = childComponents.length;
          }
        } else {
          // 빈 공간에 드롭한 경우, y 좌표 기준으로 가장 가까운 위치에 삽입
          insertIndex = findInsertIndexByY(childComponents, y);
        }
        
        console.log('Row 내 컴포넌트 이동:', {
          itemId: item.id,
          parentId: id,
          oldParentId: item.parentId,
          newOrder: insertIndex
        });
        
        dispatch(updateComponentPosition({ 
          id: item.id, 
          newPosition: { x: 0, y: 0 }, // 위치는 더 이상 중요하지 않음
          parentId: id,  // 부모 ID 설정
          size: { width: '100%', height: undefined }, // 너비를 항상 100%로 설정
          order: insertIndex // 새로운 순서 설정
        }));
      } else {
        // 새 컴포넌트 생성
        // 컴포넌트 타입에 따른 크기 설정
        let newWidth = '100%';
        let newHeight = 50;
        
        // 정확한 컴포넌트 타입 결정
        const newCompType = dropComponentType;
        
        // 직접 COMPONENT_TYPES와 비교
        switch(newCompType) {
          case COMPONENT_TYPES.TEXT:
            newHeight = 50;
            break;
          case COMPONENT_TYPES.CONTAINER:
            newHeight = 300;
            break;
          case COMPONENT_TYPES.COLUMN:
            newHeight = 200;
            break;
          case COMPONENT_TYPES.ROW:
            newHeight = 100;
            break;
          case COMPONENT_TYPES.BUTTON:
            newHeight = 40;
            break;
          case COMPONENT_TYPES.IMAGE:
            newHeight = 200;
            break;
          case COMPONENT_TYPES.LOGIN:
            newHeight = 400;
            break;
          default:
            console.warn('알 수 없는 컴포넌트 타입:', newCompType);
            newHeight = 50;
        }
        
        // 새 고유 ID 생성
        const newComponentId = uuidv4();
        
        // 기본 컨텐츠 생성
        let defaultContent = '';
        
        // 직접 COMPONENT_TYPES와 비교
        switch(newCompType) {
          case COMPONENT_TYPES.TEXT:
            defaultContent = '텍스트를 입력하세요';
            break;
          case COMPONENT_TYPES.IMAGE:
            defaultContent = { src: 'https://via.placeholder.com/150', alt: '이미지' };
            break;
          case COMPONENT_TYPES.BUTTON:
            defaultContent = '버튼';
            break;
          default:
            defaultContent = '';
        }
        
        // 자식 컴포넌트 순서 결정 (y 좌표 기준으로 가장 가까운 위치에 삽입)
        const childPositions = childComponents.map(child => ({
          id: child.id,
          y: child.position.y
        }));
        
        // 중간 위치 찾기
        let insertIndex = 0;
        if (childPositions.length > 0) {
          childPositions.sort((a, b) => a.y - b.y);
          insertIndex = childPositions.findIndex(child => y < child.y);
          if (insertIndex === -1) insertIndex = childPositions.length;
        }
        
        dispatch(addComponent({
          id: newComponentId,
          type: newCompType,
          position: { x: 0, y }, // x를 항상 0으로 설정
          size: { width: newWidth, height: newHeight },
          style: {},
          content: defaultContent,
          parentId: id, // 부모 ID 설정
          order: insertIndex // 순서 정보 추가
        }));
      }
      // 드롭 후 상태 초기화
      setDragOverIndex(null);
      setDragPosition(null);
      return { isDropped: true, parentId: id, type: item.type };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  }), [id, components, childComponents]);

  // 자식 컴포넌트 여부에 따른 스타일 및 힌트 표시
  const containerClass = `row-component ${isOver ? 'drop-target' : ''} ${childComponents.length === 0 ? 'empty-container' : ''}`;

  return (
    <div 
      id={`row-${id}`}
      ref={drop}
      className={containerClass} 
      style={mergedStyle}
      data-component-type="ROW"
    >
      {/* 자식이 없을 때 안내 메시지 표시 */}
      {childComponents.length === 0 && (
        <div className="component-placeholder-row" style={{ width: '100%', textAlign: 'center', padding: '20px 0' }}>
          여기에 컴포넌트를 끌어다 놓으세요
        </div>
      )}

      {/* Row에 배정된 자식 컴포넌트 렌더링 */}
      {childComponents
        .slice()
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((component, index) => {
          const order = component.order || index;
          const showAboveLine = dragOverIndex === order && dragPosition === 'above';
          const showBelowLine = dragOverIndex === order && dragPosition === 'below';
          
          return (
            <div key={component.id} style={{ position: 'relative' }}>
              {showAboveLine && (
                <div className="drop-indicator-line" style={{
                  position: 'absolute',
                  top: '-1px',
                  left: 0,
                  width: '100%',
                  height: '3px',
                  backgroundColor: '#007bff',
                  zIndex: 1000,
                  transform: 'translateY(-50%)'
                }} />
              )}
              <ComponentRenderer component={component} />
              {showBelowLine && (
                <div className="drop-indicator-line" style={{
                  position: 'absolute',
                  bottom: '-1px',
                  left: 0,
                  width: '100%',
                  height: '3px',
                  backgroundColor: '#007bff',
                  zIndex: 1000,
                  transform: 'translateY(50%)'
                }} />
              )}
            </div>
          );
        })
      }
      
      {content}
      {children}
    </div>
  );
};

// 부모-자식 관계 확인 헬퍼 함수
const checkIsChild = (components, parentId, childId) => {
  // 직접적인 자식인 경우
  if (parentId === childId) return true;
  
  // 현재 부모의 자식들 찾기
  const children = components.filter(comp => comp.parentId === parentId);
  
  // 자식들에 대해 재귀적으로 확인
  for (const child of children) {
    if (checkIsChild(components, child.id, childId)) {
      return true;
    }
  }
  
  return false;
};

// Y 좌표를 기준으로 삽입 위치 찾기
const findInsertIndexByY = (components, dropY) => {
  if (!components || components.length === 0) return 0;
  
  // 컴포넌트들의 위치 정보
  const componentsWithPosition = [];
  
  for (const component of components) {
    const componentEl = document.getElementById(`component-${component.id}`);
    if (componentEl) {
      const rect = componentEl.getBoundingClientRect();
      componentsWithPosition.push({
        id: component.id,
        order: component.order || 0,
        top: rect.top,
        bottom: rect.bottom,
        middle: rect.top + (rect.height / 2)
      });
    }
  }
  
  // y 위치에 따라 정렬
  componentsWithPosition.sort((a, b) => a.top - b.top);
  
  // dropY보다 큰 첫 번째 컴포넌트 위치 찾기
  for (let i = 0; i < componentsWithPosition.length; i++) {
    if (dropY < componentsWithPosition[i].middle) {
      return componentsWithPosition[i].order;
    }
  }
  
  // 가장 아래에 추가
  return components.length;
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

RowComponent.propTypes = {
  content: PropTypes.node,
  style: PropTypes.object,
  id: PropTypes.string,
  components: PropTypes.array,
  children: PropTypes.node,
  data: PropTypes.shape({
    gutter: PropTypes.number,
    verticalAlign: PropTypes.oneOf(['top', 'middle', 'bottom', 'stretch']),
    horizontalAlign: PropTypes.oneOf(['left', 'center', 'right', 'between', 'around'])
  })
};

RowComponent.defaultProps = {
  content: null,
  style: {},
  components: [],
  data: {
    gutter: 10,
    verticalAlign: 'top',
    horizontalAlign: 'left'
  }
};

export default RowComponent; 