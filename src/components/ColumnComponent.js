import React from 'react';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { addComponent, updateComponentPosition } from '../redux/editorSlice';
import './ComponentRenderer.css';
import ComponentRenderer from './ComponentRenderer';

const ColumnComponent = ({ content, style, data, children, id, components = [] }) => {
  const dispatch = useDispatch();
  
  // 컬럼 너비 계산을 위한 헬퍼 함수
  const getColumnWidth = (size) => {
    if (!size) return null;
    return size === 0 ? 'auto' : `${(size / 12) * 100}%`;
  };

  // 기본 스타일과 사용자 스타일 병합
  const mergedStyle = {
    position: 'relative',
    width: '100%',
    paddingRight: '15px',
    paddingLeft: '15px',
    minHeight: '50px', // 최소 높이 추가
    padding: '10px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    ...style
  };

  // 반응형 크기 처리
  if (data) {
    // 기본 (xs) 크기
    if (data.xs !== undefined) {
      mergedStyle.flex = data.xs === 0 ? '0 0 auto' : `0 0 ${(data.xs / 12) * 100}%`;
      mergedStyle.maxWidth = getColumnWidth(data.xs);
    }

    // 작은 (sm) 화면 크기
    if (data.sm !== undefined) {
      mergedStyle['@media (min-width: 576px)'] = {
        flex: data.sm === 0 ? '0 0 auto' : `0 0 ${(data.sm / 12) * 100}%`,
        maxWidth: getColumnWidth(data.sm)
      };
    }

    // 중간 (md) 화면 크기
    if (data.md !== undefined) {
      mergedStyle['@media (min-width: 768px)'] = {
        flex: data.md === 0 ? '0 0 auto' : `0 0 ${(data.md / 12) * 100}%`,
        maxWidth: getColumnWidth(data.md)
      };
    }

    // 큰 (lg) 화면 크기
    if (data.lg !== undefined) {
      mergedStyle['@media (min-width: 992px)'] = {
        flex: data.lg === 0 ? '0 0 auto' : `0 0 ${(data.lg / 12) * 100}%`,
        maxWidth: getColumnWidth(data.lg)
      };
    }

    // 아주 큰 (xl) 화면 크기
    if (data.xl !== undefined) {
      mergedStyle['@media (min-width: 1200px)'] = {
        flex: data.xl === 0 ? '0 0 auto' : `0 0 ${(data.xl / 12) * 100}%`,
        maxWidth: getColumnWidth(data.xl)
      };
    }

    // gutter 속성 처리
    if (data.gutter) {
      mergedStyle.paddingRight = `${data.gutter / 2}px`;
      mergedStyle.paddingLeft = `${data.gutter / 2}px`;
    }

    // 오프셋 처리
    if (data.offset) {
      mergedStyle.marginLeft = `${(data.offset / 12) * 100}%`;
    }
  }

  // 반응형 스타일을 지원하기 위한 클래스 이름 생성
  let className = 'column-component';
  if (data) {
    if (data.xs !== undefined) className += ` col-${data.xs}`;
    if (data.sm !== undefined) className += ` col-sm-${data.sm}`;
    if (data.md !== undefined) className += ` col-md-${data.md}`;
    if (data.lg !== undefined) className += ` col-lg-${data.lg}`;
    if (data.xl !== undefined) className += ` col-xl-${data.xl}`;
    if (data.offset) className += ` offset-${data.offset}`;
  }

  // 이 Column에 속한 자식 컴포넌트 필터링
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

      // 현재 column 엘리먼트의 위치 정보
      const colEl = document.getElementById(`col-${id}`);
      if (!colEl) return;
      
      const colRect = colEl.getBoundingClientRect();
      
      // column 내부의 상대적 위치
      let x = offset.x - colRect.left;
      let y = offset.y - colRect.top;
      
      // 이미 있는 컴포넌트 위치 업데이트인 경우
      if (item.id) {
        dispatch(updateComponentPosition({ 
          id: item.id, 
          newPosition: { x, y },
          parentId: id // 부모 ID 설정 
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
          parentId: id // 부모 ID 설정
        }));
      }
      return { isDropped: true, parentId: id };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  }), [id]);

  // 자식 컴포넌트 여부에 따른 스타일 및 힌트 표시
  const containerClass = `${className} ${isOver ? 'drop-target' : ''} ${childComponents.length === 0 ? 'empty-container' : ''}`;

  return (
    <div 
      id={`col-${id}`}
      ref={drop}
      className={containerClass} 
      style={mergedStyle}
    >
      {/* 자식이 없을 때 안내 메시지 표시 */}
      {childComponents.length === 0 && (
        <div className="component-placeholder">여기에 컴포넌트를 끌어다 놓으세요</div>
      )}

      {/* Column에 배정된 자식 컴포넌트 렌더링 */}
      {childComponents.map(component => (
        <ComponentRenderer key={component.id} component={component} />
      ))}
      
      {content}
      {children}
    </div>
  );
};

ColumnComponent.propTypes = {
  content: PropTypes.node,
  style: PropTypes.object,
  id: PropTypes.string,
  components: PropTypes.array,
  children: PropTypes.node,
  data: PropTypes.shape({
    xs: PropTypes.number,
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number,
    offset: PropTypes.number,
    gutter: PropTypes.number
  })
};

ColumnComponent.defaultProps = {
  content: null,
  style: {},
  components: [],
  data: {
    xs: 12,
    sm: undefined,
    md: undefined,
    lg: undefined,
    xl: undefined,
    offset: 0,
    gutter: 30
  }
};

export default ColumnComponent; 