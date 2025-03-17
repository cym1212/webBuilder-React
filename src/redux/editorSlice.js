import { createSlice, createAction, createReducer } from '@reduxjs/toolkit';
import { COMPONENT_TYPES } from '../constants';

const initialState = {
  components: [],  // 캔버스에 추가된 컴포넌트 목록
  selectedComponentId: null,  // 현재 선택된 컴포넌트의 ID
  canvasSize: { width: 1200, height: 800 },  // 캔버스 크기
  projectName: '새 프로젝트',  // 프로젝트 이름
  savedProjects: []  // 저장된 프로젝트 목록
};

// 컴포넌트 타입별 기본 크기 설정
const defaultComponentSizes = {
  [COMPONENT_TYPES.TEXT]: { width: 200, height: 50 },
  [COMPONENT_TYPES.IMAGE]: { width: 300, height: 200 },
  [COMPONENT_TYPES.CONTAINER]: { width: 400, height: 300 },
  [COMPONENT_TYPES.BUTTON]: { width: 120, height: 40 },
  [COMPONENT_TYPES.LOGIN]: { width: 1200, height: 800 },
  [COMPONENT_TYPES.BOARD]: { width: 1800, height: 1200 },
  [COMPONENT_TYPES.DETAIL_PAGE]: { width: 1800, height: 1600 },
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    addComponent: (state, action) => { 
      const component = action.payload;
      
      // 컴포넌트 타입에 따른 기본 크기 설정
      const defaultSize = defaultComponentSizes[component.type] || { width: 200, height: 100 };
      
      // 기본 데이터 설정
      let defaultData = {};
      if (component.type === COMPONENT_TYPES.BOARD) {
        defaultData = {
          title: '게시판',
          items: [
            { id: 1, title: '게시판 제목 예시 1', author: '작성자1', date: '2023-05-01', views: 42 },
            { id: 2, title: '게시판 제목 예시 2', author: '작성자2', date: '2023-05-02', views: 31 },
            { id: 3, title: '게시판 제목 예시 3', author: '작성자3', date: '2023-05-03', views: 28 },
          ]
        };
      } else if (component.type === COMPONENT_TYPES.DETAIL_PAGE) {
        defaultData = {
          title: '상품 상세 페이지',
          image: 'https://via.placeholder.com/400x300',
          price: '50,000원',
          description: '이 제품은 고품질의 소재로 제작되었으며, 다양한 용도로 활용할 수 있습니다.',
          specs: [
            { label: '제조사', value: '샘플 제조사' },
            { label: '원산지', value: '대한민국' },
          ]
        };
      }
      
      // 컴포넌트에 기본 속성 추가
      const enhancedComponent = {
        ...component,
        position: component.position || { x: 50, y: 50 },
        size: component.size || defaultSize,
        style: component.style || {},
        data: component.data || defaultData,
        isSelected: true
      };
      
      state.components.push(enhancedComponent);
      state.selectedComponentId = enhancedComponent.id;
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
      // 이전에 선택된 컴포넌트의 선택 상태 해제
      state.components.forEach(comp => {
        comp.isSelected = comp.id === action.payload;
      });
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
    },
    exportProjectToJSON: (state) => {
      const projectData = {
        name: state.projectName,
        components: state.components,
        canvasSize: state.canvasSize,
        timestamp: new Date().toISOString()
      };
      
      // JSON 문자열로 변환
      const jsonString = JSON.stringify(projectData, null, 2);
      
      // 다운로드 링크 생성 및 클릭
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${state.projectName.replace(/\s+/g, '-').toLowerCase()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    importProjectFromJSON: (state, action) => {
      const projectData = action.payload;
      if (projectData && projectData.components) {
        state.projectName = projectData.name || '가져온 프로젝트';
        state.components = projectData.components;
        state.canvasSize = projectData.canvasSize || state.canvasSize;
        state.selectedComponentId = null;
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
  updateComponentPosition,
  exportProjectToJSON,
  importProjectFromJSON
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