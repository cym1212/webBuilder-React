import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { layoutOptions } from '../layouts';
import { selectLayout, updateLayoutProps, selectLayoutInfo } from '../redux/editorSlice';

const LayoutSelector = () => {
  const dispatch = useDispatch();
  const layoutInfo = useSelector(selectLayoutInfo);
  const { selectedLayout, layoutProps } = layoutInfo;
  
  // 레이아웃 선택 핸들러
  const handleLayoutSelect = (layoutId) => {
    dispatch(selectLayout(layoutId));
  };
  
  // 레이아웃 속성 변경 핸들러
  const handlePropertyChange = (propertyName, value) => {
    dispatch(updateLayoutProps({
      [propertyName]: value
    }));
  };
  
  // 선택된 레이아웃 정보 가져오기
  const selectedLayoutInfo = layoutOptions.find(layout => layout.id === selectedLayout);
  
  return (
    <div className="layout-selector">
      <h3 className="mb-3">레이아웃 옵션</h3>
      
      {/* 레이아웃 선택 영역 */}
      <div className="layout-selection mb-4">
        <div className="form-group">
          <label htmlFor="layout-select" className="form-label">레이아웃 템플릿</label>
          <select 
            id="layout-select" 
            className="form-select"
            value={selectedLayout}
            onChange={(e) => handleLayoutSelect(e.target.value)}
          >
            <option value="">레이아웃 선택...</option>
            {layoutOptions.map(layout => (
              <option key={layout.id} value={layout.id}>
                {layout.name}
              </option>
            ))}
          </select>
        </div>
        
        {selectedLayoutInfo && (
          <div className="layout-description mt-2">
            <p className="text-muted">{selectedLayoutInfo.description}</p>
            {selectedLayoutInfo.previewImage && (
              <div className="layout-preview mt-2">
                <img 
                  src={selectedLayoutInfo.previewImage} 
                  alt={selectedLayoutInfo.name} 
                  className="img-fluid border"
                />
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* 레이아웃 속성 설정 영역 */}
      {selectedLayoutInfo && (
        <div className="layout-properties">
          <h4 className="mb-3">레이아웃 속성</h4>
          
          {selectedLayoutInfo.options.map(option => (
            <div className="form-group mb-3" key={option.name}>
              <label className="form-label">{option.label}</label>
              
              {option.type === 'boolean' && (
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`layout-${option.name}`}
                    checked={layoutProps[option.name] ?? option.default}
                    onChange={(e) => handlePropertyChange(option.name, e.target.checked)}
                  />
                  <label 
                    className="form-check-label" 
                    htmlFor={`layout-${option.name}`}
                  >
                    {layoutProps[option.name] ? '켜짐' : '꺼짐'}
                  </label>
                </div>
              )}
              
              {option.type === 'select' && (
                <select
                  className="form-select"
                  value={layoutProps[option.name] ?? option.default}
                  onChange={(e) => handlePropertyChange(option.name, e.target.value)}
                >
                  {option.options.map(optionValue => (
                    <option key={optionValue} value={optionValue}>
                      {optionValue === 'left' ? '왼쪽' : 
                        optionValue === 'right' ? '오른쪽' : optionValue}
                    </option>
                  ))}
                </select>
              )}
              
              {option.type === 'number' && (
                <div className="d-flex align-items-center">
                  <input
                    type="range"
                    className="form-range me-2"
                    min={option.min || 1}
                    max={option.max || 10}
                    value={layoutProps[option.name] ?? option.default}
                    onChange={(e) => handlePropertyChange(option.name, parseInt(e.target.value))}
                  />
                  <span className="ms-2">{layoutProps[option.name] ?? option.default}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LayoutSelector; 