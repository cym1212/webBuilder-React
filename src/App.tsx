import React, { useEffect, useState } from 'react';
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
          <h1>웹 빌더</h1>
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