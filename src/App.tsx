import React, { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BrowserRouter } from 'react-router-dom';
import store from './redux/store'; 
import { 
  loadSavedProjects, 
  saveProject, 
  exportProjectToJSON, 
  importProjectFromJSON,
  selectSavedProjects,
  selectProjectName,
  loadProject
} from './redux/editorSlice';
import EditorCanvas from './components/EditorCanvas';
import ComponentLibrary from './components/ComponentLibrary';
import PropertyPanel from './components/PropertyPanel';
import ProjectManager from './components/ProjectManager';
import buildAndDownloadBuildFolder from './utils/buildAndDownloadBuildFolder';
import './App.css';

// 프로젝트 인터페이스 정의
interface Project {
  id: string;
  name: string;
  components: any[]; // 더 상세한 타입이 필요하면 확장할 수 있음
  timestamp?: string;
  canvasSize?: { width: number; height: number };
  layout?: any;
}

function AppContent() {
  const dispatch = useDispatch();
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const savedProjects = useSelector(selectSavedProjects) as Project[];
  const projectName = useSelector(selectProjectName);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(loadSavedProjects());
  }, [dispatch]);

  // 저장 기능 핸들러
  const handleSave = () => {
    dispatch(saveProject());
    alert('프로젝트가 저장되었습니다!');
  };

  // 불러오기 기능 핸들러
  const handleLoad = () => {
    setShowProjectSelector(true);
  };

  // 불러오기 선택 핸들러
  const handleLoadProject = (projectId: string) => {
    dispatch(loadProject(projectId));
    setShowProjectSelector(false);
  };

  // 내보내기 기능 핸들러
  const handleExport = () => {
    dispatch(exportProjectToJSON());
  };

  // 가져오기 기능 핸들러
  const handleImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const projectData = JSON.parse(event.target?.result as string);
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

  // 빌드 기능 핸들러
  const handleBuild = async () => {
    try {
      const result = await buildAndDownloadBuildFolder();
      
      if (result.success) {
        alert(result.message || '🚀 빌드 완료! 빌드 폴더가 다운로드됩니다.');
      } else {
        alert('❌ 빌드 실패: ' + (result.error || '알 수 없는 오류'));
      }
    } catch (error: any) {
      console.error('빌드 실패:', error);
      alert('❌ 빌드 실패: ' + (error.message || '알 수 없는 오류'));
    }
  };

  // 미리보기 기능 핸들러
  const handlePreview = () => {
    // 여기에 미리보기 기능 구현
    alert('미리보기 기능이 준비 중입니다.');
    // window.open('/preview', '_blank');
  };

  return (
    <DndProvider backend={HTML5Backend}>  
      <div className="app-container">
        <header className="app-header">
          <div className="header-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 6L8 12L14 18" stroke="#4361ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 6L12 12L18 18" stroke="#4361ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1>웹 빌더</h1>
          </div>
          <div className="header-actions">
            <button className="save-button" onClick={handleSave}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16.1716C16.702 3 17.2107 3.21071 17.5858 3.58579L20.4142 6.41421C20.7893 6.78929 21 7.29799 21 7.82843V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M7 3V8H15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M7 21V15H17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              저장
            </button>
            <button className="load-button" onClick={handleLoad}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 14V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 3V16M12 16L16 12M12 16L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              불러오기
            </button>
            <button className="export-button" onClick={handleExport}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 7V16M12 16L16 12M12 16L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 15V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              내보내기
            </button>
            <button className="import-button" onClick={handleImport}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16V7M12 7L8 11M12 7L16 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 15V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              가져오기
            </button>
            <button className="primary build-button" onClick={handleBuild}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4V16L12 14L8 16V4M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              빌드
            </button>
            <button className="preview-button" onClick={handlePreview}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12.5" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              미리보기
            </button>
          </div>
        </header>

        <main className="app-main">
          <ComponentLibrary />
          <EditorCanvas />
          <PropertyPanel />
        </main>
        
        {/* 프로젝트 선택기 모달 */}
        {showProjectSelector && (
          <div className="modal-overlay" onClick={() => setShowProjectSelector(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>프로젝트 불러오기</h3>
                <button className="modal-close" onClick={() => setShowProjectSelector(false)}>×</button>
              </div>
              
              {savedProjects.length > 0 ? (
                <div className="project-list">
                  {savedProjects.map((project: Project) => (
                    <div key={project.id} className="project-item">
                      <div className="project-item-name">{project.name}</div>
                      <div className="project-item-actions">
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleLoadProject(project.id)}
                        >
                          불러오기
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>저장된 프로젝트가 없습니다.</p>
              )}
            </div>
          </div>
        )}
        
        {/* 파일 입력(숨김) */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".json"
          onChange={handleFileChange}
        />
      </div>
    </DndProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

export default App;