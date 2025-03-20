import React, { useEffect } from 'react';
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

  // 기본 스타일과 사용자 스타일 병합
  const mergedStyle = {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
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

  // 자식 컴포넌트 너비 자동 분할 계산은 수동으로 조정 가능하게 제거
  // 대신 컴포넌트가 추가될 때 적절한 초기 위치 설정

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
        
        dispatch(updateComponentPosition({ 
          id: item.id, 
          newPosition: { x: 0, y }, // x를 항상 0으로 설정
          parentId: id,  // 부모 ID 설정
          size: { width: '100%', height: undefined } // 너비를 항상 100%로 설정
        }));
      } else {
        // 새 컴포넌트 추가
        let newWidth = '100%';
        let newHeight = 50;
        
        // 타입에 따른 기본 크기 설정
        if (item.type === COMPONENT_TYPES.COLUMN) {
          newHeight = 200;
        } else if (item.type === COMPONENT_TYPES.ROW) {
          newHeight = 100;
        } else if (item.type === COMPONENT_TYPES.BUTTON) {
          newHeight = 40;
        } else if (item.type === COMPONENT_TYPES.IMAGE) {
          newHeight = 200;
        } else if (item.type === COMPONENT_TYPES.LOGIN) {
          newHeight = 400;
        }
        
        dispatch(addComponent({
          id: uuidv4(),
          type: item.type,
          position: { x: 0, y }, // x를 항상 0으로 설정
          size: { width: newWidth, height: newHeight },
          style: {},
          content: '',
          parentId: id  // 부모 ID 설정
        }));
      }
      return { isDropped: true, parentId: id, type: item.type };
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
      data-component-type="ROW"
    >
      {/* 자식이 없을 때 안내 메시지 표시 */}
      {childComponents.length === 0 && (
        <div className="component-placeholder-row" style={{ width: '100%', textAlign: 'center', padding: '20px 0' }}>
          여기에 컴포넌트를 끌어다 놓으세요
        </div>
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