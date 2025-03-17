import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SketchPicker } from 'react-color';
import {
  updateComponent,
  removeComponent,
  selectSelectedComponent
} from '../redux/editorSlice';
import { COMPONENT_TYPES } from '../constants';

function PropertyPanel() {
  const dispatch = useDispatch();
  const selectedComponent = useSelector(selectSelectedComponent);
  
  if (!selectedComponent) {
    return (
      <div className="property-panel">
        <h3>속성</h3>
        <p>컴포넌트를 선택하세요</p>
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
  
  // 게시판 데이터의 특정 항목 변경
  const handleBoardItemChange = (index, field, value) => {
    // 게시판 데이터가 배열인지 확인
    const boardData = Array.isArray(selectedComponent.data) 
      ? [...selectedComponent.data] 
      : (selectedComponent.data?.items ? [...selectedComponent.data.items] : []);
    
    // 해당 인덱스의 항목 업데이트
    boardData[index] = {
      ...boardData[index],
      [field]: value
    };
    
    // 데이터 구조에 따라 다르게 업데이트
    if (Array.isArray(selectedComponent.data)) {
      dispatch(updateComponent({
        id: selectedComponent.id,
        changes: {
          data: boardData
        }
      }));
    } else {
      dispatch(updateComponent({
        id: selectedComponent.id,
        changes: {
          data: {
            ...selectedComponent.data,
            items: boardData
          }
        }
      }));
    }
  };
  
  // 게시글 항목 추가
  const handleAddBoardItem = () => {
    // 게시판 데이터가 배열인지 확인
    const boardData = Array.isArray(selectedComponent.data) 
      ? [...selectedComponent.data] 
      : (selectedComponent.data?.items ? [...selectedComponent.data.items] : []);
    
    // 새 게시글 항목 생성
    const newItem = {
      id: boardData.length + 1,
      title: '새 게시글',
      author: '작성자',
      date: new Date().toISOString().split('T')[0],
      views: 0
    };
    
    // 데이터 구조에 따라 다르게 업데이트
    if (Array.isArray(selectedComponent.data)) {
      dispatch(updateComponent({
        id: selectedComponent.id,
        changes: {
          data: [...boardData, newItem]
        }
      }));
    } else {
      dispatch(updateComponent({
        id: selectedComponent.id,
        changes: {
          data: {
            ...selectedComponent.data,
            items: [...boardData, newItem]
          }
        }
      }));
    }
  };
  
  // 게시글 항목 삭제
  const handleRemoveBoardItem = (index) => {
    // 게시판 데이터가 배열인지 확인
    const boardData = Array.isArray(selectedComponent.data) 
      ? [...selectedComponent.data] 
      : (selectedComponent.data?.items ? [...selectedComponent.data.items] : []);
    
    // 해당 인덱스의 항목 삭제
    boardData.splice(index, 1);
    
    // 데이터 구조에 따라 다르게 업데이트
    if (Array.isArray(selectedComponent.data)) {
      dispatch(updateComponent({
        id: selectedComponent.id,
        changes: {
          data: boardData
        }
      }));
    } else {
      dispatch(updateComponent({
        id: selectedComponent.id,
        changes: {
          data: {
            ...selectedComponent.data,
            items: boardData
          }
        }
      }));
    }
  };
  
  // 상세 페이지 스펙 항목 변경
  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...selectedComponent.data.specs];
    newSpecs[index] = {
      ...newSpecs[index],
      [field]: value
    };
    
    dispatch(updateComponent({
      id: selectedComponent.id,
      changes: {
        data: {
          ...selectedComponent.data,
          specs: newSpecs
        }
      }
    }));
  };
  
  // 스펙 항목 추가
  const handleAddSpec = () => {
    const newSpecs = [
      ...(selectedComponent.data.specs || []),
      { label: '새 항목', value: '값' }
    ];
    
    dispatch(updateComponent({
      id: selectedComponent.id,
      changes: {
        data: {
          ...selectedComponent.data,
          specs: newSpecs
        }
      }
    }));
  };
  
  // 스펙 항목 삭제
  const handleRemoveSpec = (index) => {
    const newSpecs = [...selectedComponent.data.specs];
    newSpecs.splice(index, 1);
    
    dispatch(updateComponent({
      id: selectedComponent.id,
      changes: {
        data: {
          ...selectedComponent.data,
          specs: newSpecs
        }
      }
    }));
  };
  
  const handleDelete = () => {
    dispatch(removeComponent(selectedComponent.id));
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
                value={parseInt(selectedComponent.style.borderRadius || '8')} 
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
        
        return (
          <>
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
                          items: boardData
                        }
                      }
                    }));
                  } else {
                    handleDataChange('title', e.target.value);
                  }
                }}
              />
            </div>
            
            {/* <h4>게시글 목록</h4>
            {boardData.map((item, index) => (
              <div key={index} className="property-subgroup">
                <h5>게시글 {index + 1}</h5>
                <div className="property-field">
                  <label>제목</label>
                  <input 
                    type="text" 
                    value={item.title || ''} 
                    onChange={(e) => handleBoardItemChange(index, 'title', e.target.value)}
                  />
                </div>
                <div className="property-field">
                  <label>작성자</label>
                  <input 
                    type="text" 
                    value={item.author || ''} 
                    onChange={(e) => handleBoardItemChange(index, 'author', e.target.value)}
                  />
                </div>
                <div className="property-field">
                  <label>날짜</label>
                  <input 
                    type="text" 
                    value={item.date || ''} 
                    onChange={(e) => handleBoardItemChange(index, 'date', e.target.value)}
                  />
                </div>
                <div className="property-field">
                  <label>조회수</label>
                  <input 
                    type="number" 
                    value={item.views || 0} 
                    onChange={(e) => handleBoardItemChange(index, 'views', parseInt(e.target.value) || 0)}
                  />
                </div>
                <button 
                  className="remove-button" 
                  onClick={() => handleRemoveBoardItem(index)}
                >
                  게시글 삭제
                </button>
              </div>
            ))}
            <button 
              className="add-button" 
              onClick={handleAddBoardItem}
            >
              게시글 추가
            </button> */}
          </>
        );
        
      case COMPONENT_TYPES.DETAIL_PAGE:
        return (
          <>
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
            
            <h4>상품 정보</h4>
            <div className="property-group">
              <label>상품명</label>
              <input 
                type="text" 
                value={selectedComponent.data?.title || '상품 상세 페이지'} 
                onChange={(e) => handleDataChange('title', e.target.value)}
              />
            </div>
            <div className="property-group">
              <label>이미지 URL</label>
              <input 
                type="text" 
                value={selectedComponent.data?.image || ''} 
                onChange={(e) => handleDataChange('image', e.target.value)}
              />
            </div>
            <div className="property-group">
              <label>가격</label>
              <input 
                type="text" 
                value={selectedComponent.data?.price || ''} 
                onChange={(e) => handleDataChange('price', e.target.value)}
              />
            </div>
            <div className="property-group">
              <label>상품 설명</label>
              <textarea 
                value={selectedComponent.data?.description || ''} 
                onChange={(e) => handleDataChange('description', e.target.value)}
              />
            </div>
            
            <h4>상품 스펙</h4>
            {selectedComponent.data?.specs && selectedComponent.data.specs.map((spec, index) => (
              <div key={index} className="property-subgroup">
                <div className="property-field">
                  <label>항목명</label>
                  <input 
                    type="text" 
                    value={spec.label} 
                    onChange={(e) => handleSpecChange(index, 'label', e.target.value)}
                  />
                </div>
                <div className="property-field">
                  <label>값</label>
                  <input 
                    type="text" 
                    value={spec.value} 
                    onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                  />
                </div>
                <button 
                  className="remove-button" 
                  onClick={() => handleRemoveSpec(index)}
                >
                  항목 삭제
                </button>
              </div>
            ))}
            <button 
              className="add-button" 
              onClick={handleAddSpec}
            >
              스펙 항목 추가
            </button>
          </>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="property-panel" style={{ 
      height: '100%', 
      overflowY: 'auto', 
      paddingRight: '10px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h3>속성</h3>
      
      <div className="property-group">
        <label>위치 X</label>
        <input 
          type="number" 
          value={selectedComponent.position.x} 
          onChange={(e) => dispatch(updateComponent({
            id: selectedComponent.id,
            changes: { position: { ...selectedComponent.position, x: parseInt(e.target.value) } }
          }))}
        />
      </div>
      
      <div className="property-group">
        <label>위치 Y</label>
        <input 
          type="number" 
          value={selectedComponent.position.y} 
          onChange={(e) => dispatch(updateComponent({
            id: selectedComponent.id,
            changes: { position: { ...selectedComponent.position, y: parseInt(e.target.value) } }
          }))}
        />
      </div>
      
      <div className="property-group">
        <label>너비</label>
        <input 
          type="number" 
          value={selectedComponent.size.width} 
          onChange={(e) => dispatch(updateComponent({
            id: selectedComponent.id,
            changes: { size: { ...selectedComponent.size, width: parseInt(e.target.value) } }
          }))}
        />
      </div>
      
      <div className="property-group">
        <label>높이</label>
        <input 
          type="number" 
          value={selectedComponent.size.height} 
          onChange={(e) => dispatch(updateComponent({
            id: selectedComponent.id,
            changes: { size: { ...selectedComponent.size, height: parseInt(e.target.value) } }
          }))}
        />
      </div>
      
      {renderProperties()}
      
      <button className="delete-button" onClick={handleDelete} style={{ marginTop: '20px' }}>
        컴포넌트 삭제
      </button>
    </div>
  );
}

export default PropertyPanel;