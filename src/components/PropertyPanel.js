import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SketchPicker } from 'react-color';
import {
  updateComponent,
  removeComponent,
  selectSelectedComponent,
  selectComponents
} from '../redux/editorSlice';
import { COMPONENT_TYPES } from '../constants';
import LayoutSelector from './LayoutSelector';

function PropertyPanel() {
  const dispatch = useDispatch();
  const selectedComponent = useSelector(selectSelectedComponent);
  const allComponents = useSelector(selectComponents);
  const [activeTab, setActiveTab] = useState('layout'); // 'layout' 또는 'component'
  
  // 컴포넌트 선택 상태에 따라 활성 탭 자동 변경
  useEffect(() => {
    if (selectedComponent) {
      setActiveTab('component');
    } else {
      setActiveTab('layout');
    }
  }, [selectedComponent]);
  
  // 탭 선택 핸들러
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // 패널 상단 탭 UI
  const renderTabs = () => (
    <div className="panel-tabs">
      <button 
        className={`panel-tab ${activeTab === 'layout' ? 'active' : ''}`}
        onClick={() => handleTabChange('layout')}
      >
        레이아웃
      </button>
      <button 
        className={`panel-tab ${activeTab === 'component' ? 'active' : ''}`}
        onClick={() => handleTabChange('component')}
      >
        컴포넌트
      </button>
    </div>
  );
  
  // 컴포넌트 선택 핸들러
  const handleComponentSelect = (id) => {
    // dispatch 선택 액션 (이미 구현되어 있는 기능)
  };
  
  if (!selectedComponent) {
    return (
      <div className="property-panel">
        {renderTabs()}
        
        {activeTab === 'layout' ? (
          <div className="layout-options">
            <LayoutSelector />
          </div>
        ) : (
          <div className="component-properties">
            <h3>컴포넌트 속성</h3>
            <div className="no-component-selected">
              <img src="https://via.placeholder.com/64" alt="No selection" />
              <p>편집할 컴포넌트를 선택하세요</p>
              <p>또는 왼쪽 패널에서 새 컴포넌트를 추가하세요</p>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  const handleStyleChange = (property, value) => {
    dispatch(updateComponent({
      id: selectedComponent.id,
      changes: {
        style: {
          ...selectedComponent.style,
          [property]: value
        }
      }
    }));
  };
  
  const handleContentChange = (value) => {
    dispatch(updateComponent({
      id: selectedComponent.id,
      changes: {
        content: value
      }
    }));
  };
  
  const handleImageChange = (field, value) => {
    dispatch(updateComponent({
      id: selectedComponent.id,
      changes: {
        content: {
          ...selectedComponent.content,
          [field]: value
        }
      }
    }));
  };
  
  // 게시판, 상세 페이지 등 복잡한 컴포넌트의 데이터 변경 처리
  const handleDataChange = (field, value) => {
    dispatch(updateComponent({
      id: selectedComponent.id,
      changes: {
        data: {
          ...selectedComponent.data,
          [field]: value
        }
      }
    }));
  };
  
  const handleDelete = () => {
    dispatch(removeComponent(selectedComponent.id));
  };
  
  const renderPaddingControls = () => {
    // 모든 컴포넌트에 패딩 컨트롤 렌더링
    return (
      <div className="property-group">
        <div className="property-group-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M7 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M7 17H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          여백 설정
        </div>
        <div className="padding-controls">
          <div className="padding-control">
            <label>좌측 여백</label>
            <div className="input-with-unit">
              <input 
                type="number" 
                value={parseInt(selectedComponent.style.paddingLeft || '0')} 
                onChange={(e) => handleStyleChange('paddingLeft', `${e.target.value}px`)}
              />
              <span className="unit">px</span>
            </div>
          </div>
          <div className="padding-control">
            <label>우측 여백</label>
            <div className="input-with-unit">
              <input 
                type="number" 
                value={parseInt(selectedComponent.style.paddingRight || '0')} 
                onChange={(e) => handleStyleChange('paddingRight', `${e.target.value}px`)}
              />
              <span className="unit">px</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // 컴포넌트 타입별 속성 편집 UI
  const renderProperties = () => {
    switch(selectedComponent.type) {
      case COMPONENT_TYPES.TEXT:
        return (
          <>
            <div className="property-group">
              <label>텍스트 내용</label>
              <textarea 
                value={selectedComponent.content} 
                onChange={(e) => handleContentChange(e.target.value)}
              />
            </div>
            {renderPaddingControls()}
            <div className="property-group">
              <label>폰트 크기</label>
              <input 
                type="number" 
                value={parseInt(selectedComponent.style.fontSize || '16')} 
                onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
              />
            </div>
            <div className="property-group">
              <label>색상</label>
              <SketchPicker 
                color={selectedComponent.style.color || '#000000'} 
                onChange={(color) => handleStyleChange('color', color.hex)}
              />
            </div>
            <div className="property-group">
              <label>폰트 두께</label>
              <select 
                value={selectedComponent.style.fontWeight || 'normal'} 
                onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
              >
                <option value="normal">보통</option>
                <option value="bold">굵게</option>
                <option value="lighter">얇게</option>
              </select>
            </div>
          </>
        );
        
      case COMPONENT_TYPES.IMAGE:
        return (
          <>
            <div className="property-group">
              <label>이미지 URL</label>
              <input 
                type="text" 
                value={selectedComponent.content.src} 
                onChange={(e) => handleImageChange('src', e.target.value)}
              />
            </div>
            {renderPaddingControls()}
            <div className="property-group">
              <label>대체 텍스트</label>
              <input 
                type="text" 
                value={selectedComponent.content.alt} 
                onChange={(e) => handleImageChange('alt', e.target.value)}
              />
            </div>
            <div className="property-group">
              <label>테두리 둥글기</label>
              <input 
                type="number" 
                value={parseInt(selectedComponent.style.borderRadius || '0')} 
                onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
              />
            </div>
          </>
        );
        
      case COMPONENT_TYPES.CONTAINER:
        return (
          <>
            {renderPaddingControls()}
            <div className="property-group">
              <label>배경색</label>
              <SketchPicker 
                color={selectedComponent.style.backgroundColor || '#ffffff'} 
                onChange={(color) => handleStyleChange('backgroundColor', color.hex)}
              />
            </div>
            <div className="property-group">
              <label>테두리</label>
              <input 
                type="text" 
                value={selectedComponent.style.border || '1px solid #000'} 
                onChange={(e) => handleStyleChange('border', e.target.value)}
              />
            </div>
            <div className="property-group">
              <label>테두리 둥글기</label>
              <input 
                type="number" 
                value={parseInt(selectedComponent.style.borderRadius || '0')} 
                onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
              />
            </div>
          </>
        );
        
      case COMPONENT_TYPES.BUTTON:
        return (
          <>
            <div className="property-group">
              <label>버튼 텍스트</label>
              <input 
                type="text" 
                value={selectedComponent.content} 
                onChange={(e) => handleContentChange(e.target.value)}
              />
            </div>
            {renderPaddingControls()}
            <div className="property-group">
              <label>배경색</label>
              <SketchPicker 
                color={selectedComponent.style.backgroundColor || '#007bff'} 
                onChange={(color) => handleStyleChange('backgroundColor', color.hex)}
              />
            </div>
            <div className="property-group">
              <label>텍스트 색상</label>
              <SketchPicker 
                color={selectedComponent.style.color || '#ffffff'} 
                onChange={(color) => handleStyleChange('color', color.hex)}
              />
            </div>
            <div className="property-group">
              <label>테두리 둥글기</label>
              <input 
                type="number" 
                value={parseInt(selectedComponent.style.borderRadius || '4')} 
                onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
              />
            </div>
          </>
        );
        
      case COMPONENT_TYPES.LOGIN:
        return (
          <>
            {renderPaddingControls()}
            <div className="property-group">
              <label>배경색</label>
              <SketchPicker 
                color={selectedComponent.style.backgroundColor || '#f8f9fa'} 
                onChange={(color) => handleStyleChange('backgroundColor', color.hex)}
              />
            </div>
            <div className="property-group">
              <label>테두리 둥글기</label>
              <input 
                type="number" 
                value={parseInt(selectedComponent.style.borderRadius || '4')} 
                onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
              />
            </div>
            <div className="property-group">
              <label>제목 텍스트</label>
              <input 
                type="text" 
                value={selectedComponent.data?.title || '로그인'} 
                onChange={(e) => handleDataChange('title', e.target.value)}
              />
            </div>
            <div className="property-group">
              <label>API URL</label>
              <input 
                type="text" 
                value={selectedComponent.data?.apiUrl || 'https://api.example.com/login'} 
                onChange={(e) => handleDataChange('apiUrl', e.target.value)}
              />
              <small style={{ color: '#6c757d', marginTop: '5px', display: 'block' }}>
                로그인 요청을 보낼 API 엔드포인트
              </small>
            </div>
            <div className="property-group">
              <label>버튼 색상</label>
              <SketchPicker 
                color={selectedComponent.style.buttonColor || '#4a90e2'} 
                onChange={(color) => handleStyleChange('buttonColor', color.hex)}
              />
            </div>
          </>
        );
        
      case COMPONENT_TYPES.BOARD:
        // 게시판 데이터 처리
        const boardData = Array.isArray(selectedComponent.data) 
          ? selectedComponent.data 
          : (selectedComponent.data?.items || []);
        
        const boardTitle = Array.isArray(selectedComponent.data)
          ? (selectedComponent.data.title || '게시판')
          : (selectedComponent.data?.title || '게시판');
        
        const boardParameter = Array.isArray(selectedComponent.data)
          ? (selectedComponent.data.parameter || '')
          : (selectedComponent.data?.parameter || '');
        
        return (
          <>
            {renderPaddingControls()}
            <div className="property-group">
              <label>배경색</label>
              <SketchPicker 
                color={selectedComponent.style.backgroundColor || '#ffffff'} 
                onChange={(color) => handleStyleChange('backgroundColor', color.hex)}
              />
            </div>
            <div className="property-group">
              <label>테두리 둥글기</label>
              <input 
                type="number" 
                value={parseInt(selectedComponent.style.borderRadius || '8')} 
                onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
              />
            </div>
            <div className="property-group">
              <label>제목</label>
              <input 
                type="text" 
                value={boardTitle} 
                onChange={(e) => {
                  if (Array.isArray(selectedComponent.data)) {
                    dispatch(updateComponent({
                      id: selectedComponent.id,
                      changes: {
                        data: {
                          title: e.target.value,
                          items: boardData,
                          parameter: boardParameter
                        }
                      }
                    }));
                  } else {
                    handleDataChange('title', e.target.value);
                  }
                }}
              />
            </div>
            
            <div className="property-group">
              <label>파라미터</label>
              <input 
                type="text" 
                value={boardParameter} 
                onChange={(e) => {
                  if (Array.isArray(selectedComponent.data)) {
                    dispatch(updateComponent({
                      id: selectedComponent.id,
                      changes: {
                        data: {
                          title: boardTitle,
                          items: boardData,
                          parameter: e.target.value
                        }
                      }
                    }));
                  } else {
                    handleDataChange('parameter', e.target.value);
                  }
                }}
              />
              <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                파라미터 값에 따라 다른 API 엔드포인트에서 데이터를 가져옵니다.
              </small>
            </div>
          </>
        );
        
      case COMPONENT_TYPES.DETAIL_PAGE:
        return (
          <>
            {renderPaddingControls()}
            <div className="property-group">
              <label>배경색</label>
              <SketchPicker 
                color={selectedComponent.style.backgroundColor || '#ffffff'} 
                onChange={(color) => handleStyleChange('backgroundColor', color.hex)}
              />
            </div>
            <div className="property-group">
              <label>테두리 둥글기</label>
              <input 
                type="number" 
                value={parseInt(selectedComponent.style.borderRadius || '8')} 
                onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
              />
            </div>
            <div className="property-group">
              <label>상품 ID</label>
              <input 
                type="text" 
                value={selectedComponent.data?.productId || '1'} 
                onChange={(e) => handleDataChange('productId', e.target.value)}
              />
              <small style={{ color: '#6c757d', marginTop: '5px', display: 'block' }}>
                상세 정보를 가져올 상품 ID
              </small>
            </div>
            <div className="property-group">
              <label>버튼 색상</label>
              <SketchPicker 
                color={selectedComponent.style.buttonColor || '#4a90e2'} 
                onChange={(color) => handleStyleChange('buttonColor', color.hex)}
              />
            </div>
          </>
        );
        
      case COMPONENT_TYPES.ROW:
        return (
          <>
            <div className="property-group">
              <label>여백 (gutter)</label>
              <input 
                type="number" 
                value={selectedComponent.data?.gutter || 30} 
                onChange={(e) => handleDataChange('gutter', parseInt(e.target.value))}
              />
            </div>
            <div className="property-group">
              <label>세로 정렬</label>
              <select 
                value={selectedComponent.data?.verticalAlign || 'top'} 
                onChange={(e) => handleDataChange('verticalAlign', e.target.value)}
              >
                <option value="top">위</option>
                <option value="middle">가운데</option>
                <option value="bottom">아래</option>
                <option value="stretch">늘이기</option>
              </select>
            </div>
            <div className="property-group">
              <label>가로 정렬</label>
              <select 
                value={selectedComponent.data?.horizontalAlign || 'left'} 
                onChange={(e) => handleDataChange('horizontalAlign', e.target.value)}
              >
                <option value="left">왼쪽</option>
                <option value="center">가운데</option>
                <option value="right">오른쪽</option>
                <option value="between">균등 분배</option>
                <option value="around">주변 균등</option>
              </select>
            </div>
            <div className="property-group">
              <label>배경색</label>
              <SketchPicker 
                color={selectedComponent.style.backgroundColor || 'transparent'} 
                onChange={(color) => handleStyleChange('backgroundColor', color.hex)}
              />
            </div>
          </>
        );
        
      case COMPONENT_TYPES.COLUMN:
        return (
          <>
            <div className="property-group">
              <label>기본 너비 (xs)</label>
              <select 
                value={selectedComponent.data?.xs || 12} 
                onChange={(e) => handleDataChange('xs', parseInt(e.target.value))}
              >
                <option value="0">자동</option>
                <option value="1">1/12</option>
                <option value="2">2/12</option>
                <option value="3">3/12</option>
                <option value="4">4/12</option>
                <option value="5">5/12</option>
                <option value="6">6/12</option>
                <option value="7">7/12</option>
                <option value="8">8/12</option>
                <option value="9">9/12</option>
                <option value="10">10/12</option>
                <option value="11">11/12</option>
                <option value="12">12/12</option>
              </select>
            </div>
            <div className="property-group">
              <label>태블릿 너비 (md)</label>
              <select 
                value={selectedComponent.data?.md || ''} 
                onChange={(e) => e.target.value ? handleDataChange('md', parseInt(e.target.value)) : handleDataChange('md', undefined)}
              >
                <option value="">기본값</option>
                <option value="0">자동</option>
                <option value="1">1/12</option>
                <option value="2">2/12</option>
                <option value="3">3/12</option>
                <option value="4">4/12</option>
                <option value="5">5/12</option>
                <option value="6">6/12</option>
                <option value="7">7/12</option>
                <option value="8">8/12</option>
                <option value="9">9/12</option>
                <option value="10">10/12</option>
                <option value="11">11/12</option>
                <option value="12">12/12</option>
              </select>
            </div>
            <div className="property-group">
              <label>데스크탑 너비 (lg)</label>
              <select 
                value={selectedComponent.data?.lg || ''} 
                onChange={(e) => e.target.value ? handleDataChange('lg', parseInt(e.target.value)) : handleDataChange('lg', undefined)}
              >
                <option value="">기본값</option>
                <option value="0">자동</option>
                <option value="1">1/12</option>
                <option value="2">2/12</option>
                <option value="3">3/12</option>
                <option value="4">4/12</option>
                <option value="5">5/12</option>
                <option value="6">6/12</option>
                <option value="7">7/12</option>
                <option value="8">8/12</option>
                <option value="9">9/12</option>
                <option value="10">10/12</option>
                <option value="11">11/12</option>
                <option value="12">12/12</option>
              </select>
            </div>
            <div className="property-group">
              <label>오프셋</label>
              <select 
                value={selectedComponent.data?.offset || 0} 
                onChange={(e) => handleDataChange('offset', parseInt(e.target.value))}
              >
                <option value="0">없음</option>
                <option value="1">1/12</option>
                <option value="2">2/12</option>
                <option value="3">3/12</option>
                <option value="4">4/12</option>
                <option value="5">5/12</option>
                <option value="6">6/12</option>
                <option value="7">7/12</option>
                <option value="8">8/12</option>
                <option value="9">9/12</option>
                <option value="10">10/12</option>
                <option value="11">11/12</option>
              </select>
            </div>
            <div className="property-group">
              <label>배경색</label>
              <SketchPicker 
                color={selectedComponent.style.backgroundColor || 'transparent'} 
                onChange={(color) => handleStyleChange('backgroundColor', color.hex)}
              />
            </div>
          </>
        );
        
      default:
        return null;
    }
  };
  
  // 속성 패널 렌더링
  return (
    <div className="property-panel">
      {renderTabs()}
      
      {activeTab === 'layout' ? (
        <div className="layout-options">
          <LayoutSelector />
        </div>
      ) : (
        <div className="component-properties">
          <h3>컴포넌트 속성</h3>
          {renderProperties()}
          <button 
            className="delete-button" 
            onClick={handleDelete}
          >
            컴포넌트 삭제
          </button>
        </div>
      )}
    </div>
  );
}

export default PropertyPanel;