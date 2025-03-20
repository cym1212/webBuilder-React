import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { COMPONENT_TYPES } from '../constants';
import LoginForm from "./LoginForm";
import BoardComponent from './BoardComponent';
import DetailPageComponent from './DetailPageComponent';

const DraggableComponent = ({ type, name, icon, category }) => {
  console.log('드래그할 컴포넌트 생성:', { type, name, category }); // 디버깅 로그

  // 컴포넌트 타입이 문자열인지 확인
  const typeStr = typeof type === 'string' ? type : String(type);
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: () => {
      // 드래그 시작할 때 호출되는 함수
      console.log('드래그 시작:', { type, name, typeStr, category });
      
      return { 
        id: null, // 신규 컴포넌트임을 나타내는 null ID
        name,
        // 타입 정보 명확하게 전달
        type,
        componentType: type,
        category, // 카테고리 정보 추가
        // 디버깅용 정보
        _debug: {
          type,
          typeStr,
          category,
          isContainer: type === COMPONENT_TYPES.CONTAINER,
          isRow: type === COMPONENT_TYPES.ROW,
          isColumn: type === COMPONENT_TYPES.COLUMN,
          isText: type === COMPONENT_TYPES.TEXT,
          isImage: type === COMPONENT_TYPES.IMAGE,
          isButton: type === COMPONENT_TYPES.BUTTON,
          componentTypeValues: Object.values(COMPONENT_TYPES)
        }
      };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="draggable-component"
      style={{ opacity: isDragging ? 0.5 : 1 }}
      data-component-type={typeStr}
      data-category={category}
    >
      <div className="component-icon">{icon}</div>
      <div className="component-label">{name}</div>
      {/* 디버깅용 타입 표시 */}
      <div style={{ display: 'none' }}>{typeStr}</div>
    </div>
  );
};

const DropZone = ({ components, setComponents }) => {
  const [, drop] = useDrop(() => ({
    accept: "COMPONENT",
    drop: (item) => {
      // 컴포넌트 타입에 따라 고유 ID 생성
      let componentId;
      switch (item.type) {
        case COMPONENT_TYPES.LOGIN:
          componentId = `login-${Date.now()}`;
          break;
        case COMPONENT_TYPES.BOARD:
          componentId = `board-${Date.now()}`;
          break;
        case COMPONENT_TYPES.DETAIL_PAGE:
          componentId = `detail-${Date.now()}`;
          break;
        default:
          componentId = `comp-${Date.now()}`;
      }
      
      const newComponent = {
        id: componentId,
        type: item.type,
        content: item.name || "",
      };
      setComponents((prev) => [...prev, newComponent]);
    },
  }));

  return (
    <div ref={drop} className="drop-zone">
      <h3>캔버스</h3>
      {components.map((component) => (
        <div key={component.id} className="dropped-component">
          {component.type === COMPONENT_TYPES.LOGIN ? (
            <LoginForm id={component.id} />
          ) : component.type === COMPONENT_TYPES.BOARD ? (
            <BoardComponent id={component.id} />
          ) : component.type === COMPONENT_TYPES.DETAIL_PAGE ? (
            <DetailPageComponent id={component.id} />
          ) : (
            <p>{component.content}</p>
          )}
        </div>
      ))}
    </div>
  );
};

// 탭 네비게이션 컴포넌트
const NavButtons = ({ activeTab, setActiveTab }) => {
  return (
    <div className="nav-buttons">
      <button 
        className={activeTab === 'basic' ? "nav-button active" : "nav-button"} 
        onClick={() => setActiveTab('basic')}
        title="기본 요소"
      >
        <i className="nav-icon">🧩</i>
      </button>
      <button 
        className={activeTab === 'layout' ? "nav-button active" : "nav-button"} 
        onClick={() => setActiveTab('layout')}
        title="레이아웃 요소"
      >
        <i className="nav-icon">📐</i>
      </button>
      <button 
        className={activeTab === 'advanced' ? "nav-button active" : "nav-button"} 
        onClick={() => setActiveTab('advanced')}
        title="고급 요소"
      >
        <i className="nav-icon">⚙️</i>
      </button>
      <button 
        className={activeTab === 'menutree' ? "nav-button active" : "nav-button"} 
        onClick={() => setActiveTab('menutree')}
        title="메뉴 트리"
      >
        <i className="nav-icon">🗂️</i>
      </button>
    </div>
  );
};

function ComponentLibrary() {
  const [activeTab, setActiveTab] = useState('basic');

  // 기본 컴포넌트 탭
  const renderBasicComponents = () => (
    <div className="components-category">
      <h4 className="components-category-title">기본 요소</h4>
      <div className="components-list">
        <DraggableComponent 
          key="basic-text"
          type={COMPONENT_TYPES.TEXT} 
          name="텍스트" 
          icon="T" 
          category="basic"
        />
        <DraggableComponent 
          key="basic-image"
          type={COMPONENT_TYPES.IMAGE} 
          name="이미지" 
          icon="🖼️" 
          category="basic"
        />
        <DraggableComponent 
          key="basic-button"
          type={COMPONENT_TYPES.BUTTON} 
          name="버튼" 
          icon="⏺" 
          category="basic"
        />
      </div>
    </div>
  );

  // 레이아웃 컴포넌트 탭
  const renderLayoutComponents = () => (
    <div className="components-category">
      <h4 className="components-category-title">구조 요소</h4>
      <div className="components-list">
        <DraggableComponent 
          key="layout-container"
          type={COMPONENT_TYPES.CONTAINER} 
          name="컨테이너" 
          icon="⬚" 
          category="layout"
        />
        <DraggableComponent 
          key="layout-row"
          type={COMPONENT_TYPES.ROW} 
          name="행 (Row)" 
          icon="↔️" 
          category="layout"
        />
        <DraggableComponent 
          key="layout-column"
          type={COMPONENT_TYPES.COLUMN} 
          name="열 (Column)" 
          icon="↕️" 
          category="layout"
        />
      </div>
    </div>
  );

  // 고급 컴포넌트 탭
  const renderAdvancedComponents = () => (
    <>
      <div className="components-category">
        <h4 className="components-category-title">기능 요소</h4>
        <div className="components-list">
          <DraggableComponent 
            key="advanced-login"
            type={COMPONENT_TYPES.LOGIN} 
            name="로그인 폼" 
            icon="🔑" 
            category="advanced"
          />
          <DraggableComponent 
            key="advanced-board"
            type={COMPONENT_TYPES.BOARD} 
            name="게시판" 
            icon="📋" 
            category="advanced"
          />
          <DraggableComponent 
            key="advanced-detail"
            type={COMPONENT_TYPES.DETAIL_PAGE} 
            name="상세 페이지" 
            icon="📄" 
            category="advanced"
          />
        </div>
      </div>
    </>
  );

  // 메뉴트리 탭
  const renderMenuTree = () => (
    <div className="menu-tree">
      <h4 className="components-category-title">메뉴 구조</h4>
      <div className="menu-tree-container">
        <div className="menu-item root-menu">
          <span className="menu-icon">📁</span>
          <span className="menu-name">메인 메뉴</span>
        </div>
        <div className="menu-item sub-menu">
          <span className="menu-icon">📄</span>
          <span className="menu-name">홈</span>
        </div>
        <div className="menu-item sub-menu">
          <span className="menu-icon">📄</span>
          <span className="menu-name">소개</span>
        </div>
        <div className="menu-item sub-menu">
          <span className="menu-icon">📄</span>
          <span className="menu-name">서비스</span>
        </div>
        <div className="menu-item sub-menu">
          <span className="menu-icon">📄</span>
          <span className="menu-name">연락처</span>
        </div>
      </div>
      <div className="menu-actions">
        <button className="btn btn-primary btn-sm">메뉴 추가</button>
        <button className="btn btn-secondary btn-sm">순서 변경</button>
      </div>
    </div>
  );

  const renderActiveTabContent = () => {
    switch(activeTab) {
      case 'basic':
        return renderBasicComponents();
      case 'layout':
        return renderLayoutComponents();
      case 'advanced':
        return renderAdvancedComponents();
      case 'menutree':
        return renderMenuTree();
      default:
        return renderBasicComponents();
    }
  };

  return (
    <div className="component-library">
      <h3>컴포넌트</h3>
      <NavButtons activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderActiveTabContent()}
    </div>
  );
}

export default ComponentLibrary;