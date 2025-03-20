import { createSlice, createAction, createReducer } from '@reduxjs/toolkit';
import { COMPONENT_TYPES } from '../constants';
import { getLayoutDefaultPropsById } from '../layouts';

const initialState = {
  components: [],  // 캔버스에 추가된 컴포넌트 목록
  selectedComponentId: null,  // 현재 선택된 컴포넌트의 ID
  canvasSize: { width: 1200, height: 800 },  // 캔버스 크기
  projectName: '새 프로젝트',  // 프로젝트 이름
  savedProjects: [],  // 저장된 프로젝트 목록
  layout: {
    selectedLayout: '', // 선택된 레이아웃 ID
    layoutProps: {}     // 레이아웃 속성
  }
};

// 컴포넌트 타입별 기본 크기 설정
const defaultComponentSizes = {
  [COMPONENT_TYPES.TEXT]: { width: '100%', height: 50 },
  [COMPONENT_TYPES.IMAGE]: { width: '100%', height: 200 },
  [COMPONENT_TYPES.CONTAINER]: { width: '100%', height: 300 },
  [COMPONENT_TYPES.BUTTON]: { width: '100%', height: 40 },
  [COMPONENT_TYPES.LOGIN]: { width: '100%', height: 400 },
  [COMPONENT_TYPES.BOARD]: { width: '100%', height: 600 },
  [COMPONENT_TYPES.DETAIL_PAGE]: { width: '100%', height: 800 },
  [COMPONENT_TYPES.ROW]: { width: '100%', height: 100 },
  [COMPONENT_TYPES.COLUMN]: { width: '100%', height: 200 },
};

// 컴포넌트 타입별 기본 데이터 구조
const defaultComponentData = {
  [COMPONENT_TYPES.TEXT]: '',
  [COMPONENT_TYPES.IMAGE]: { src: 'https://via.placeholder.com/150', alt: '이미지' },
  [COMPONENT_TYPES.CONTAINER]: '',
  [COMPONENT_TYPES.BUTTON]: '버튼',
  [COMPONENT_TYPES.LOGIN]: { 
    title: '로그인', 
    apiUrl: 'https://api.example.com/login' 
  },
  [COMPONENT_TYPES.BOARD]: { 
    title: '게시판', 
    parameter: '1',
    items: [] 
  },
  [COMPONENT_TYPES.DETAIL_PAGE]: { 
    productId: '1',
    apiUrl: 'https://api.example.com/products'
  },
  [COMPONENT_TYPES.ROW]: {
    gutter: 30,
    verticalAlign: 'top',
    horizontalAlign: 'left'
  },
  [COMPONENT_TYPES.COLUMN]: {
    xs: 12,
    sm: undefined,
    md: undefined,
    lg: undefined,
    xl: undefined,
    offset: 0,
    gutter: 30
  }
};

// 컴포넌트 타입별 기본 스타일
const defaultComponentStyles = {
  [COMPONENT_TYPES.TEXT]: { 
    color: '#000000', 
    fontSize: '16px', 
    fontWeight: 'normal',
    paddingLeft: '0px',
    paddingRight: '0px' 
  },
  [COMPONENT_TYPES.IMAGE]: { 
    border: 'none', 
    borderRadius: '0px',
    paddingLeft: '0px',
    paddingRight: '0px' 
  },
  [COMPONENT_TYPES.CONTAINER]: { 
    backgroundColor: '#f8f9fa', 
    border: '1px solid #dee2e6', 
    borderRadius: '4px',
    paddingLeft: '0px',
    paddingRight: '0px' 
  },
  [COMPONENT_TYPES.BUTTON]: { 
    backgroundColor: '#4a90e2', 
    color: '#ffffff', 
    border: 'none', 
    borderRadius: '4px', 
    padding: '8px 16px', 
    fontSize: '14px',
    paddingLeft: '20px',
    paddingRight: '20px' 
  },
  [COMPONENT_TYPES.LOGIN]: { 
    backgroundColor: '#f8f9fa', 
    borderRadius: '8px', 
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', 
    padding: '20px',
    buttonColor: '#4a90e2',
    paddingLeft: '20px',
    paddingRight: '20px'
  },
  [COMPONENT_TYPES.BOARD]: { 
    backgroundColor: '#ffffff', 
    borderRadius: '8px', 
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', 
    padding: '20px',
    paddingLeft: '20px',
    paddingRight: '20px'
  },
  [COMPONENT_TYPES.DETAIL_PAGE]: { 
    backgroundColor: '#ffffff', 
    borderRadius: '8px', 
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', 
    padding: '20px',
    buttonColor: '#4a90e2',
    paddingLeft: '20px',
    paddingRight: '20px'
  },
  [COMPONENT_TYPES.ROW]: {
    backgroundColor: 'transparent',
    paddingLeft: '20px',
    paddingRight: '20px'
  },
  [COMPONENT_TYPES.COLUMN]: {
    backgroundColor: 'transparent',
    paddingLeft: '20px',
    paddingRight: '20px'
  }
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    addComponent: (state, action) => { 
      const component = action.payload;
      
      
      // 유효한 컴포넌트 타입인지 확인
      if (!component.type || !Object.values(COMPONENT_TYPES).includes(component.type)) {
        console.error('유효하지 않은 컴포넌트 타입:', component.type);
        return; // 유효하지 않은 타입이면 추가하지 않음
      }
      
      // 컴포넌트 타입에 따른 기본 크기 설정
      const defaultSize = defaultComponentSizes[component.type] || { width: 200, height: 100 };
      
      // 컴포넌트 타입에 따른 기본 스타일 설정
      const componentStyle = { ...defaultComponentStyles[component.type], ...component.style };
      
      // 기본 데이터 설정
      let defaultData = defaultComponentData[component.type] || {};
      
      // 컴포넌트 추가
      state.components.push({
        id: component.id,
        type: component.type,
        position: component.position || { x: 0, y: 0 },
        size: component.size || defaultSize,
        style: componentStyle,
        content: component.content !== undefined ? component.content : '', // 내용이 빈 문자열이 될 수 있도록 수정
        data: component.data || defaultData,
        parentId: component.parentId || null // 부모 컴포넌트 ID
      });
      
      state.selectedComponentId = component.id;
    },
    updateComponent: (state, action) => {
      const { id, changes } = action.payload;
      const component = state.components.find(comp => comp.id === id);
      if (component) {
        Object.assign(component, changes);
      }
    },
    removeComponent: (state, action) => {
      const componentId = action.payload;
      
      // 삭제할 컴포넌트의 자식 컴포넌트들도 함께 삭제
      const componentsToRemove = [componentId];
      
      // 자식 컴포넌트들 찾기 (재귀적으로)
      const findChildren = (parentId) => {
        state.components.forEach(comp => {
          if (comp.parentId === parentId) {
            componentsToRemove.push(comp.id);
            findChildren(comp.id);
          }
        });
      };
      
      findChildren(componentId);
      
      // 모든 관련 컴포넌트 삭제
      state.components = state.components.filter(comp => !componentsToRemove.includes(comp.id));
      
      if (state.selectedComponentId === componentId) {
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
        layout: { ...state.layout },
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
        state.layout = project.layout ? { ...project.layout } : initialState.layout;
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
      const { id, newPosition, parentId, size } = action.payload;
      const component = state.components.find(comp => comp.id === id);
      if (component) {
        // 항상 x 위치를 0으로 설정하여 가로로 전체 너비를 사용할 수 있게 함
        component.position = {
          x: 0,
          y: newPosition.y
        };
        
        // parentId가 지정되었다면 업데이트 (부모 컴포넌트 변경)
        if (parentId !== undefined) {
          component.parentId = parentId;
        }
        
        // size가 지정되었다면 컴포넌트 크기 업데이트
        if (size) {
          component.size = {
            width: '100%',  // 항상 width를 100%로 설정
            height: size.height
          };
        } else {
          // size를 지정하지 않았더라도 width는 100%로 설정
          component.size = {
            width: '100%',
            height: component.size.height
          };
        }
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
    },
    selectLayout: (state, action) => {
      const layoutId = action.payload;
      state.layout.selectedLayout = layoutId;
      // 기본 속성 설정
      state.layout.layoutProps = getLayoutDefaultPropsById(layoutId);
    },
    updateLayoutProps: (state, action) => {
      state.layout.layoutProps = {
        ...state.layout.layoutProps,
        ...action.payload
      };
    },
    resetLayout: (state) => {
      state.layout.selectedLayout = '';
      state.layout.layoutProps = {};
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
  importProjectFromJSON,
  selectLayout,
  updateLayoutProps,
  resetLayout
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
export const selectLayoutInfo = (state) => state.editor.layout;

export const loadComponets = createAction('editor/loadComponents');

const editorReducer = createReducer(initialState, (builder) => {
  builder.addCase(loadComponents, (state, action) => {
    state.components = action.payload;
  });
});

export default editorSlice.reducer;