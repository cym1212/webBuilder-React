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
            <ProjectManager />
            <ProjectImportExport />
            <BuildButton />
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