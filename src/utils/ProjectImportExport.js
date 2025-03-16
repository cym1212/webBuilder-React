import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { exportProjectToJSON, importProjectFromJSON } from '../redux/editorSlice';

function ProjectImportExport() {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const handleExport = () => {
    dispatch(exportProjectToJSON());
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const projectData = JSON.parse(event.target.result);
        dispatch(importProjectFromJSON(projectData));
        alert('프로젝트를 성공적으로 가져왔습니다.');
      } catch (error) {
        console.error('JSON 파일 파싱 오류:', error);
        alert('유효하지 않은 프로젝트 파일입니다.');
      }
    };
    reader.readAsText(file);
    
    // 파일 입력 초기화 (같은 파일을 다시 선택할 수 있도록)
    e.target.value = '';
  };

  return (
    <div className="project-import-export">
      <button 
        className="export-button" 
        onClick={handleExport}
        title="현재 프로젝트를 JSON 파일로 내보냅니다"
      >
        📤 JSON 내보내기
      </button>
      
      <button 
        className="import-button" 
        onClick={handleImportClick}
        title="JSON 파일에서 프로젝트를 가져옵니다"
      >
        📥 JSON 가져오기
      </button>
      
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".json"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default ProjectImportExport; 