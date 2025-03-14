import { createSlice, createAction, createReducer } from '@reduxjs/toolkit';

const initialState = {
  components: [],  // 캔버스에 추가된 컴포넌트 목록
  selectedComponentId: null,  // 현재 선택된 컴포넌트의 ID
  canvasSize: { width: 1200, height: 800 },  // 캔버스 크기
  projectName: '새 프로젝트',  // 프로젝트 이름
  savedProjects: []  // 저장된 프로젝트 목록
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    addComponent: (state, action) => { 
      state.components.push(action.payload);
      state.selectedComponentId = action.payload.id;
    },
    updateComponent: (state, action) => {
      const { id, changes } = action.payload;
      const component = state.components.find(comp => comp.id === id);
      if (component) {
        Object.assign(component, changes);
      }
    },
    removeComponent: (state, action) => {
      state.components = state.components.filter(comp => comp.id !== action.payload);
      if (state.selectedComponentId === action.payload) {
        state.selectedComponentId = null;
      }
    },
    loadComponents: (state, action) => {  
      state.components = action.payload;
    },
    selectComponent: (state, action) => {
      state.selectedComponentId = action.payload;
    },
    setProjectName: (state, action) => {
      state.projectName = action.payload;
    },
    saveProject: (state) => {
      const projectToSave = {
        id: Date.now().toString(),
        name: state.projectName,
        components: [...state.components],
        canvasSize: { ...state.canvasSize },
        timestamp: new Date().toISOString()
      };
      
      // 기존 프로젝트를 덮어쓰기 또는 새로 추가
      const existingIndex = state.savedProjects.findIndex(p => p.name === state.projectName);
      if (existingIndex >= 0) {
        state.savedProjects[existingIndex] = projectToSave;
      } else {
        state.savedProjects.push(projectToSave);
      }
      
      // 로컬 스토리지에도 저장
      localStorage.setItem('savedProjects', JSON.stringify(state.savedProjects));
    },
    loadProject: (state, action) => {
      const project = state.savedProjects.find(p => p.id === action.payload);
      if (project) {
        state.components = [...project.components];
        state.projectName = project.name;
        state.canvasSize = { ...project.canvasSize };
        state.selectedComponentId = null;
      }
    },
    loadSavedProjects: (state) => {
      const saved = localStorage.getItem('savedProjects');
      if (saved) {
        state.savedProjects = JSON.parse(saved);
      }
    },
    deleteProject: (state, action) => {
      state.savedProjects = state.savedProjects.filter(p => p.id !== action.payload);
      localStorage.setItem('savedProjects', JSON.stringify(state.savedProjects));
    },
    updateComponentPosition: (state, action) => {
      const { id, newPosition } = action.payload;
      const component = state.components.find(comp => comp.id === id);
      if (component) {
        component.position = newPosition;  
      }
    }
  }
});

export const {
  addComponent,
  updateComponent,
  removeComponent,
  selectComponent,
  setProjectName,
  saveProject,
  loadProject,
  loadSavedProjects,
  deleteProject,
  loadComponents,
  updateComponentPosition
} = editorSlice.actions;

export const selectComponents = (state) => state.editor.components;
export const selectSelectedComponentId = (state) => state.editor.selectedComponentId;
export const selectSelectedComponent = (state) => {
  const id = state.editor.selectedComponentId;
  return id ? state.editor.components.find(comp => comp.id === id) : null;
};
export const selectCanvasSize = (state) => state.editor.canvasSize;
export const selectProjectName = (state) => state.editor.projectName;
export const selectSavedProjects = (state) => state.editor.savedProjects;

export const loadComponets = createAction('editor/loadComponents');

const editorReducer = createReducer(initialState, (builder) => {
  builder.addCase(loadComponents, (state, action) => {
    state.components = action.payload;
  });
});

export default editorSlice.reducer;