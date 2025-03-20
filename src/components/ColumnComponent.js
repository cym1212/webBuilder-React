import React from 'react';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { addComponent, updateComponentPosition } from '../redux/editorSlice';
import './ComponentRenderer.css';
import ComponentRenderer from './ComponentRenderer';
import { COMPONENT_TYPES } from '../constants';

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
    height: '100%',
    minHeight: '80px',
    padding: '0',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible',
    backgroundColor: style.backgroundColor || 'rgba(237, 242, 247, 0.5)',
    border: style.border || '1px solid #e2e8f0',
    borderRadius: style.borderRadius || '4px',
    paddingLeft: style.paddingLeft || '20px',
    paddingRight: style.paddingRight || '20px',
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
      mergedStyle.gap = `${data.gutter}px`;
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
      
      // 컨테이너 내부 영역을 벗어나지 않도록 조정
      x = Math.max(0, Math.min(x, colRect.width - 50)); // 최소 50px 여백
      y = Math.max(0, Math.min(y, colRect.height - 50)); // 최소 50px 여백
      
      // 이미 있는 컴포넌트 위치 업데이트인 경우
      if (item.id) {
        // 현재 컴포넌트가 자신의 자식으로 드래그되는 것을 방지
        if (item.id === id) {
          return;
        }
        
        // 부모-자식 순환 참조 방지
        if (item.type === COMPONENT_TYPES.ROW || item.type === COMPONENT_TYPES.COLUMN) {
          // 현재 Column이 드래그하는 컴포넌트의 자식인지 확인
          const isChildOfDraggedComponent = checkIsChild(components, item.id, id);
          if (isChildOfDraggedComponent) {
            return; // 순환 참조가 발생하므로, 드롭 취소
          }
        }

        const existingComponent = components.find(comp => comp.id === item.id);
        if (existingComponent) {
          // 부모 영역 내에 맞게 크기 조정
          const newWidth = Math.min(existingComponent.size.width, colRect.width - x);
          const newHeight = Math.min(existingComponent.size.height, colRect.height - y);
          
          dispatch(updateComponentPosition({ 
            id: item.id, 
            newPosition: { x: 0, y }, // x를 항상 0으로 설정
            parentId: id, // 부모 ID 설정
            size: { width: '100%', height: newHeight } // 너비를 항상 100%로 설정
          }));
        }
      } else {
        // 새 컴포넌트 추가
        let newWidth = '100%';
        let newHeight = 50;
        
        // 타입에 따른 기본 크기 설정 (부모 영역 제한)
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
          parentId: id // 부모 ID 설정
        }));
      }
      return { isDropped: true, parentId: id, type: item.type };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  }), [id, components]);

  // 자식 컴포넌트 여부에 따른 스타일 및 힌트 표시
  const containerClass = `${className} ${isOver ? 'drop-target' : ''} ${childComponents.length === 0 ? 'empty-container' : ''}`;

  return (
    <div 
      id={`col-${id}`}
      ref={drop}
      className={containerClass} 
      style={mergedStyle}
      data-component-type="COLUMN"
    >
      {/* 자식이 없을 때 안내 메시지 표시 */}
      {childComponents.length === 0 && (
        <div className="component-placeholder-column" style={{ width: '100%', textAlign: 'center', padding: '20px 0' }}>
          여기에 컴포넌트를 끌어다 놓으세요
        </div>
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
    gutter: 10
  }
};

export default ColumnComponent; 