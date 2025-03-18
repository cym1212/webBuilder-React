import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { COMPONENT_TYPES } from '../constants';
import LoginForm from "./LoginForm";
import BoardComponent from './BoardComponent';
import DetailPageComponent from './DetailPageComponent';

const DraggableComponent = ({ type, name, icon }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="draggable-component"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="component-icon">{icon}</div>
      <div className="component-name">{name}</div>
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

// 추가된 탭 컴포넌트
const NavButtons = ({ activeTab, setActiveTab }) => {
  return (
    <div className="nav-buttons">
      <button 
        className={activeTab === 1 ? "nav-button active" : "nav-button"} 
        onClick={() => setActiveTab(1)}
      >
        1
      </button>
      <button 
        className={activeTab === 2 ? "nav-button active" : "nav-button"} 
        onClick={() => setActiveTab(2)}
      >
        2
      </button>
      <button 
        className={activeTab === 3 ? "nav-button active" : "nav-button"} 
        onClick={() => setActiveTab(3)}
      >
        3
      </button>
    </div>
  );
};

function ComponentLibrary() {
  const [activeTab, setActiveTab] = useState(1);

  // 탭 1에 표시할 기본 컴포넌트
  const renderComponentsTab1 = () => (
    <div className="components-list">
      <DraggableComponent 
        type={COMPONENT_TYPES.TEXT} 
        name="텍스트" 
        icon="T" 
      />
      <DraggableComponent 
        type={COMPONENT_TYPES.IMAGE} 
        name="이미지" 
        icon="🖼️" 
      />
      <DraggableComponent 
        type={COMPONENT_TYPES.CONTAINER} 
        name="영역" 
        icon="⬚" 
      />
      <DraggableComponent 
        type={COMPONENT_TYPES.BUTTON} 
        name="버튼" 
        icon="⏺" 
      />
      <DraggableComponent 
        type={COMPONENT_TYPES.LOGIN} 
        name="로그인" 
        icon="🔑" 
      /> 
      <DraggableComponent 
        type={COMPONENT_TYPES.BOARD} 
        name="게시판" 
        icon="📋" 
      />
      <DraggableComponent 
        type={COMPONENT_TYPES.DETAIL_PAGE} 
        name="상세 페이지" 
        icon="📄" 
      />
    </div>
  );

  // 탭 2에 표시할 컴포넌트 (예시)
  const renderComponentsTab2 = () => (
    <div className="components-list">
      {/* <DraggableComponent 
        type={COMPONENT_TYPES.TEXT} 
        name="테마 텍스트" 
        icon="T" 
      />
      <DraggableComponent 
        type={COMPONENT_TYPES.CONTAINER} 
        name="테마 영역" 
        icon="⬚" 
      />
      <DraggableComponent 
        type={COMPONENT_TYPES.BUTTON} 
        name="테마 버튼" 
        icon="⏺" 
      /> */}
    </div>
  );

  // 탭 3에 표시할 컴포넌트 (예시)
  const renderComponentsTab3 = () => (
    <div className="components-list">
      {/* <DraggableComponent 
        type={COMPONENT_TYPES.BOARD} 
        name="고급 게시판" 
        icon="📋" 
      />
      <DraggableComponent 
        type={COMPONENT_TYPES.DETAIL_PAGE} 
        name="고급 상세 페이지" 
        icon="📄" 
      /> */}
    </div>
  );

  const renderActiveTabContent = () => {
    switch(activeTab) {
      case 1:
        return renderComponentsTab1();
      case 2:
        return renderComponentsTab2();
      case 3:
        return renderComponentsTab3();
      default:
        return renderComponentsTab1();
    }
  };

  return (
    <div className="component-library">
      <NavButtons activeTab={activeTab} setActiveTab={setActiveTab} />
      <h3>구성 요소</h3>
      {renderActiveTabContent()}
    </div>
  );
}

export default ComponentLibrary;