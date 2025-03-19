import React from 'react';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { addComponent, updateComponentPosition } from '../redux/editorSlice';
import './ComponentRenderer.css';
import ComponentRenderer from './ComponentRenderer';
import { COMPONENT_TYPES } from '../constants';

const RowComponent = ({ content, style, data, children, id, components = [] }) => {
  const dispatch = useDispatch();

  // 기본 스타일과 사용자 스타일 병합
  const mergedStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    minHeight: '80px',
    position: 'relative',
    padding: '0',
    boxSizing: 'border-box',
    ...style
  };

  // gutter 속성 처리
  if (data && data.gutter) {
    mergedStyle.gap = `${data.gutter}px`;
  }

  // 정렬 속성 처리
  if (data && data.verticalAlign) {
    switch (data.verticalAlign) {
      case 'top':
        mergedStyle.alignItems = 'flex-start';
        break;
      case 'middle':
        mergedStyle.alignItems = 'center';
        break;
      case 'bottom':
        mergedStyle.alignItems = 'flex-end';
        break;
      case 'stretch':
        mergedStyle.alignItems = 'stretch';
        break;
      default:
        break;
    }
  }

  if (data && data.horizontalAlign) {
    switch (data.horizontalAlign) {
      case 'left':
        mergedStyle.justifyContent = 'flex-start';
        break;
      case 'center':
        mergedStyle.justifyContent = 'center';
        break;
      case 'right':
        mergedStyle.justifyContent = 'flex-end';
        break;
      case 'between':
        mergedStyle.justifyContent = 'space-between';
        break;
      case 'around':
        mergedStyle.justifyContent = 'space-around';
        break;
      default:
        break;
    }
  }

  // 이 Row에 속한 자식 컴포넌트 필터링
  const childComponents = components.filter(comp => comp.parentId === id);

  // 드롭 기능 추가
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item, monitor) => {
      // 이미 다른 곳에서 처리된 경우
      if (monitor.didDrop()) {
        return;
      }

      const offset = monitor.getClientOffset();
      if (!offset) return;

      // 현재 row 엘리먼트의 위치 정보
      const rowEl = document.getElementById(`row-${id}`);
      if (!rowEl) return;
      
      const rowRect = rowEl.getBoundingClientRect();
      
      // row 내부의 상대적 위치
      let x = offset.x - rowRect.left;
      let y = offset.y - rowRect.top;
      
      // 컨테이너 내부 영역을 벗어나지 않도록 조정
      x = Math.max(0, Math.min(x, rowRect.width - 50)); // 최소 50px 여백
      y = Math.max(0, Math.min(y, rowRect.height - 50)); // 최소 50px 여백
      
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
        
        const existingComponent = components.find(comp => comp.id === item.id);
        if (existingComponent) {
          // 부모 영역 내에 맞게 크기 조정
          const newWidth = Math.min(existingComponent.size.width, rowRect.width - x);
          const newHeight = Math.min(existingComponent.size.height, rowRect.height - y);
          
          dispatch(updateComponentPosition({ 
            id: item.id, 
            newPosition: { x, y },
            parentId: id, // 부모 ID 설정
            size: { width: newWidth, height: newHeight } // 크기 제한
          }));
        }
      } else {
        // 새 컴포넌트 추가
        let newWidth = Math.min(150, rowRect.width - x);
        let newHeight = Math.min(50, rowRect.height - y);
        
        // 타입에 따른 기본 크기 설정 (부모 영역 제한)
        if (item.type === COMPONENT_TYPES.COLUMN) {
          newWidth = Math.min(200, rowRect.width - x);
          newHeight = Math.min(200, rowRect.height - y);
        } else if (item.type === COMPONENT_TYPES.ROW) {
          newWidth = Math.min(400, rowRect.width - x);
          newHeight = Math.min(100, rowRect.height - y);
        }
        
        dispatch(addComponent({
          id: uuidv4(),
          type: item.type,
          position: { x, y },
          size: { width: newWidth, height: newHeight },
          style: {},
          content: '',
          parentId: id  // 부모 ID 설정
        }));
      }
      return { isDropped: true, parentId: id };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  }), [id, components]);

  // 자식 컴포넌트 여부에 따른 스타일 및 힌트 표시
  const containerClass = `row-component ${isOver ? 'drop-target' : ''} ${childComponents.length === 0 ? 'empty-container' : ''}`;

  return (
    <div 
      id={`row-${id}`}
      ref={drop}
      className={containerClass} 
      style={mergedStyle}
    >
      {/* 자식이 없을 때 안내 메시지 표시 */}
      {childComponents.length === 0 && (
        <div className="component-placeholder-row">여기에 컴포넌트를 끌어다 놓으세요</div>
      )}

      {/* Row에 배정된 자식 컴포넌트 렌더링 */}
      {childComponents.map(component => (
        <ComponentRenderer key={component.id} component={component} />
      ))}
      
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