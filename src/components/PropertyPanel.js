import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SketchPicker } from 'react-color';
import {
  updateComponent,
  removeComponent,
  selectSelectedComponent
} from '../redux/editorSlice';

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
  
  const handleDelete = () => {
    dispatch(removeComponent(selectedComponent.id));
  };
  
  // 컴포넌트 타입별 속성 편집 UI
  const renderProperties = () => {
    switch(selectedComponent.type) {
      case 'TEXT':
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
        
      case 'IMAGE':
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
        
      case 'CONTAINER':
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
        
      case 'BUTTON':
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
        
      default:
        return null;
    }
  };
  
  return (
    <div className="property-panel">
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
      
      <button className="delete-button" onClick={handleDelete}>
        컴포넌트 삭제
      </button>
    </div>
  );
}

export default PropertyPanel;