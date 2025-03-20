import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BrowserRouter } from 'react-router-dom';
import store from './redux/store'; 
import { loadSavedProjects } from './redux/editorSlice';
import EditorCanvas from './components/EditorCanvas';
import ComponentLibrary from './components/ComponentLibrary';
import PropertyPanel from './components/PropertyPanel';
import ProjectManager from './components/ProjectManager';
import BuildButton from './utils/BuildButton';
import ProjectImportExport from './utils/ProjectImportExport';
import './App.css';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadSavedProjects());
  }, [dispatch]);

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
            <button className="save-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16.1716C16.702 3 17.2107 3.21071 17.5858 3.58579L20.4142 6.41421C20.7893 6.78929 21 7.29799 21 7.82843V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M7 3V8H15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M7 21V15H17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              저장
            </button>
            <button className="export-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 7V16M12 16L16 12M12 16L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 15V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              내보내기
            </button>
            <button className="primary build-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4V16L12 14L8 16V4M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              빌드
            </button>
            <button className="preview-button">
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