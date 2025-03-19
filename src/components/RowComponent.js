import React from 'react';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { addComponent, updateComponentPosition } from '../redux/editorSlice';
import './ComponentRenderer.css';
import ComponentRenderer from './ComponentRenderer';

const RowComponent = ({ content, style, data, children, id, components = [] }) => {
  const dispatch = useDispatch();

  // 기본 스타일과 사용자 스타일 병합
  const mergedStyle = {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    marginRight: '-15px',
    marginLeft: '-15px',
    minHeight: '50px', // 최소 높이 추가
    position: 'relative',
    padding: '10px',
    ...style
  };

  // gutter 속성 처리
  if (data && data.gutter) {
    mergedStyle.marginRight = `-${data.gutter / 2}px`;
    mergedStyle.marginLeft = `-${data.gutter / 2}px`;
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
      
      // 이미 있는 컴포넌트 위치 업데이트인 경우
      if (item.id) {
        dispatch(updateComponentPosition({ 
          id: item.id, 
          newPosition: { x, y },
          parentId: id  // 부모 ID 설정
        }));
      } else {
        // 새 컴포넌트 추가
        dispatch(addComponent({
          id: uuidv4(),
          type: item.type,
          position: { x, y },
          size: { width: 150, height: 50 },
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
  }), [id]);

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
        <div className="component-placeholder">여기에 컴포넌트를 끌어다 놓으세요</div>
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
    gutter: 30,
    verticalAlign: 'top',
    horizontalAlign: 'left'
  }
};

export default RowComponent; 