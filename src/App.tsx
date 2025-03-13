import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { loadSavedProjects } from './redux/editorSlice';
import EditorCanvas from './components/EditorCanvas';
import ComponentLibrary from './components/ComponentLibrary';
import PropertyPanel from './components/PropertyPanel';
import ProjectManager from './components/ProjectManager';
import ExportButton from './utils/ExportButton';
import './App.css';

function App() {
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
            <ExportButton />
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

export default App;