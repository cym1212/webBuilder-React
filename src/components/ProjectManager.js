import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  saveProject,
  loadProject,
  loadSavedProjects,
  deleteProject,
  setProjectName,
  selectProjectName,
  selectSavedProjects,
  selectComponents,
  loadComponents
} from '../redux/editorSlice';

function ProjectManager() {
  const dispatch = useDispatch();
  const projectName = useSelector(selectProjectName);
  const savedProjects = useSelector(selectSavedProjects);
  const components = useSelector(selectComponents);
  
  // 컴포넌트 마운트 시 저장된 프로젝트 로드
  useEffect(() => {
    dispatch(loadSavedProjects());
  }, [dispatch]);
  
  const handleSave = () => {
    dispatch(saveProject());
    alert('프로젝트가 저장되었습니다!');
  };
  
  const handleLoad = (projectId) => {
    dispatch(loadProject(projectId));
  };
  
  const handleDelete = (projectId) => {
    if (window.confirm('정말 이 프로젝트를 삭제하시겠습니까?')) {
      dispatch(deleteProject(projectId));
    }
  };

  const handleExportJSON = () => {
    const projectData = {
      projectName,
      components: components.map((comp) => ({
        id: comp.id,
        type: comp.type,
        content: comp.content,
        position: comp.position,
        size: comp.size,
        style: comp.style
      }))
    };

    const json = JSON.stringify(projectData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportJSON = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (e) => {
      const jsonData = JSON.parse(e.target.result);
  
      dispatch(setProjectName(jsonData.projectName));
      dispatch(loadComponents(jsonData.components));
  
      alert('프로젝트가 성공적으로 불러와졌습니다.');
    };
    reader.readAsText(file);
  };
  
  return (
    <div className="project-manager">
      <div className="project-name-container">
        <input
          type="text"
          value={projectName}
          onChange={(e) => dispatch(setProjectName(e.target.value))}
          placeholder="프로젝트 이름"
        />
        <button onClick={handleSave}>저장</button>
      </div>

      {/* JSON 불러오기 & 내보내기 버튼 추가 */}
    <div className="json-actions">
      <input type="file" accept=".json" onChange={handleImportJSON} />
      <button onClick={handleExportJSON}>JSON 내보내기</button>
    </div>
      
      {savedProjects.length > 0 && (
        <div className="saved-projects">
          <h4>저장된 프로젝트</h4>
          <ul>
            {savedProjects.map(project => (
              <li key={project.id}>
                <span>{project.name}</span>
                <span>{new Date(project.timestamp).toLocaleString()}</span>
                <button onClick={() => handleLoad(project.id)}>불러오기</button>
                <button onClick={() => handleDelete(project.id)}>삭제</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProjectManager;