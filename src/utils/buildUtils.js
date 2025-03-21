import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { store } from '../redux/store';
import { selectComponents, selectProjectName, selectLayoutInfo } from '../redux/editorSlice';
import { getLayoutComponentById } from '../layouts';

// 컴포넌트 데이터를 React 코드로 변환
const generateReactCode = (components, layoutInfo = null) => {
  let imports = `import React from 'react';\nimport './App.css';\n\n`;
  let componentCode = '';
  let styles = '';

  // 레이아웃 관련 코드 생성
  let layoutImport = '';
  let layoutComponent = null;
  let layoutProps = {};

  if (layoutInfo && layoutInfo.selectedLayout) {
    const { selectedLayout, layoutProps: props } = layoutInfo;
    // 레이아웃 컴포넌트 가져오기
    layoutComponent = getLayoutComponentById(selectedLayout);
    layoutProps = props || {};
    
    // 레이아웃 임포트 코드 추가 (실제 프로젝트 구조에 맞게 조정 필요)
    layoutImport = `import ${selectedLayout} from './layouts/${selectedLayout}';\n`;
    imports += layoutImport;
  }

  // 컴포넌트 타입별 코드 생성
  components.forEach(component => {
    switch(component.type) {
      case 'TEXT':
        componentCode += `
  <div 
    style={{
      position: 'absolute',
      left: ${component.position.x}px,
      top: ${component.position.y}px,
      width: ${component.size.width}px,
      height: ${component.size.height}px,
      ${Object.entries(component.style || {}).map(([key, value]) => `${key}: '${value}',`).join('\n      ')}
    }}
  >
    ${component.content}
  </div>`;
        break;
      case 'IMAGE':
        componentCode += `
  <img 
    src="${component.content.src}" 
    alt="${component.content.alt || ''}" 
    style={{
      position: 'absolute',
      left: ${component.position.x}px,
      top: ${component.position.y}px,
      width: ${component.size.width}px,
      height: ${component.size.height}px,
      ${Object.entries(component.style || {}).map(([key, value]) => `${key}: '${value}',`).join('\n      ')}
    }}
  />`;
        break;
      case 'CONTAINER':
        componentCode += `
  <div 
    style={{
      position: 'absolute',
      left: ${component.position.x}px,
      top: ${component.position.y}px,
      width: ${component.size.width}px,
      height: ${component.size.height}px,
      ${Object.entries(component.style || {}).map(([key, value]) => `${key}: '${value}',`).join('\n      ')}
    }}
  ></div>`;
        break;
      case 'BUTTON':
        componentCode += `
  <button 
    style={{
      position: 'absolute',
      left: ${component.position.x}px,
      top: ${component.position.y}px,
      width: ${component.size.width}px,
      height: ${component.size.height}px,
      ${Object.entries(component.style || {}).map(([key, value]) => `${key}: '${value}',`).join('\n      ')}
    }}
  >
    ${component.content}
  </button>`;
        break;
      default:
        break;
    }
  });

  // 레이아웃 유무에 따른 App 컴포넌트 생성
  let appComponent = '';
  
  if (layoutInfo && layoutInfo.selectedLayout) {
    // 레이아웃을 사용하는 경우
    const layoutPropsStr = JSON.stringify(layoutProps, null, 2)
      .replace(/"([^"]+)":/g, '$1:') // 따옴표 제거
      .replace(/"/g, "'"); // 문자열 값에 작은 따옴표 사용
      
    appComponent = `
function App() {
  return (
    <div className="App">
      <${layoutInfo.selectedLayout} ${Object.keys(layoutProps).map(key => `${key}={${typeof layoutProps[key] === 'string' ? `'${layoutProps[key]}'` : layoutProps[key]}}`).join(' ')}>
        <div className="layout-main-content" style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
          ${componentCode}
        </div>
      </${layoutInfo.selectedLayout}>
    </div>
  );
}`;
  } else {
    // 레이아웃을 사용하지 않는 경우 (기존 코드)
    appComponent = `
function App() {
  return (
    <div className="App">
      <div className="canvas" style={{ position: 'relative', width: '100%', height: '100vh' }}>
        ${componentCode}
      </div>
    </div>
  );
}`;
  }

  appComponent += `\n\nexport default App;`;

  return {
    appCode: imports + appComponent,
    styles
  };
};

// 기본 CSS 생성
const generateCSS = () => {
  return `
.App {
  text-align: center;
}

.canvas {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
}

.layout-main-content {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
}
`;
};

// 빌드된 HTML 생성 (정적 파일)
const generateStaticHTML = (projectName, components, layoutInfo = null) => {
  // 컴포넌트 HTML 생성
  let componentsHTML = '';
  components.forEach(component => {
    switch(component.type) {
      case 'TEXT':
        componentsHTML += `
  <div 
    style="
      position: absolute;
      left: ${component.position.x}px;
      top: ${component.position.y}px;
      width: ${component.size.width}px;
      height: ${component.size.height}px;
      ${Object.entries(component.style || {}).map(([key, value]) => `${key}: ${value};`).join('\n      ')}
    "
  >
    ${component.content}
  </div>`;
        break;
      case 'IMAGE':
        componentsHTML += `
  <img 
    src="${component.content.src}" 
    alt="${component.content.alt || ''}" 
    style="
      position: absolute;
      left: ${component.position.x}px;
      top: ${component.position.y}px;
      width: ${component.size.width}px;
      height: ${component.size.height}px;
      ${Object.entries(component.style || {}).map(([key, value]) => `${key}: ${value};`).join('\n      ')}
    "
  />`;
        break;
      case 'CONTAINER':
        componentsHTML += `
  <div 
    style="
      position: absolute;
      left: ${component.position.x}px;
      top: ${component.position.y}px;
      width: ${component.size.width}px;
      height: ${component.size.height}px;
      ${Object.entries(component.style || {}).map(([key, value]) => `${key}: ${value};`).join('\n      ')}
    "
  ></div>`;
        break;
      case 'BUTTON':
        componentsHTML += `
  <button 
    style="
      position: absolute;
      left: ${component.position.x}px;
      top: ${component.position.y}px;
      width: ${component.size.width}px;
      height: ${component.size.height}px;
      ${Object.entries(component.style || {}).map(([key, value]) => `${key}: ${value};`).join('\n      ')}
    "
  >
    ${component.content}
  </button>`;
        break;
      default:
        break;
    }
  });

  // 레이아웃 관련 CSS 및 HTML
  let layoutCSS = '';
  let layoutHTML = '';
  let contentWrapperStart = '<div class="canvas">';
  let contentWrapperEnd = '</div>';
  
  if (layoutInfo && layoutInfo.selectedLayout) {
    // 실제 레이아웃 구현에 맞게 CSS 및 HTML 생성
    layoutCSS = `
/* ${layoutInfo.selectedLayout} 레이아웃 스타일 */
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.layout-header {
  padding: 16px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.layout-sidebar {
  padding: 16px;
  background-color: #f8f9fa;
  border-right: 1px solid #e9ecef;
}

.layout-main-content {
  flex: 1;
  padding: 16px;
  position: relative;
}

.layout-footer {
  padding: 16px;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
}
`;
    
    // 레이아웃 구조에 맞게 컨텐츠 래퍼 설정
    contentWrapperStart = `<div class="layout-container">
  <div class="layout-header">${layoutInfo.layoutProps.title || projectName}</div>
  <div class="layout-main-content">`;
    
    contentWrapperEnd = `
  </div>
  <div class="layout-footer">${layoutInfo.layoutProps.footer || '© ' + new Date().getFullYear()}</div>
</div>`;
  }

  // 전체 HTML 생성
  return `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${projectName}</title>
    <style>
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
          'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      * {
        box-sizing: border-box;
      }
      
      .App {
        text-align: center;
      }
      
      .canvas {
        position: relative;
        width: 100%;
        height: 100vh;
        background-color: #ffffff;
      }
      ${layoutCSS}
    </style>
  </head>
  <body>
    <div id="root">
      <div class="App">
        ${contentWrapperStart}
          ${componentsHTML}
        ${contentWrapperEnd}
      </div>
    </div>
  </body>
</html>
`;
};

// 프로젝트 빌드 및 ZIP 파일 생성 (정적 파일 버전)
export const buildAndDownloadProject = async () => {
  try {
    // Redux 스토어에서 데이터 가져오기
    const state = store.getState();
    const components = selectComponents(state);
    const projectName = selectProjectName(state);
    const layoutInfo = selectLayoutInfo(state);
    
    if (!components || components.length === 0) {
      return { success: false, error: '빌드할 컴포넌트가 없습니다. 먼저 컴포넌트를 추가해주세요.' };
    }
    
    // 레이아웃 정보를 포함한 정적 HTML 생성
    const staticHTML = generateStaticHTML(projectName, components, layoutInfo);
    
    // ZIP 파일 생성
    const zip = new JSZip();
    
    // 정적 파일 추가
    zip.file('index.html', staticHTML);
    
    // 이미지 파일이 있는 경우 추가 (URL이 아닌 로컬 이미지인 경우)
    // 이 부분은 실제 이미지 파일을 처리하는 로직이 필요합니다
    
    // ZIP 파일 생성 및 다운로드
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${projectName.replace(/\s+/g, '-').toLowerCase()}-static.zip`);
    
    return { success: true, message: `${projectName} 프로젝트가 성공적으로 빌드되었습니다. 정적 파일이 다운로드됩니다.` };
  } catch (error) {
    console.error('빌드 실패:', error);
    return { success: false, error: error.message };
  }
};

// 소스 코드 다운로드 (기존 기능)
export const downloadSourceCode = async () => {
  try {
    // Redux 스토어에서 데이터 가져오기
    const state = store.getState();
    const components = selectComponents(state);
    const projectName = selectProjectName(state);
    const layoutInfo = selectLayoutInfo(state);
    
    if (!components || components.length === 0) {
      return { success: false, error: '다운로드할 컴포넌트가 없습니다. 먼저 컴포넌트를 추가해주세요.' };
    }
    
    // 레이아웃 정보를 포함한 코드 생성
    const { appCode } = generateReactCode(components, layoutInfo);
    const css = generateCSS();
    const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;
    const indexJS = `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
    const packageJSON = JSON.stringify({
      name: projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      version: '0.1.0',
      private: true,
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        'react-scripts': '5.0.1',
      },
      scripts: {
        start: 'react-scripts start',
        build: 'react-scripts build',
        test: 'react-scripts test',
        eject: 'react-scripts eject',
      },
      eslintConfig: {
        extends: ['react-app'],
      },
      browserslist: {
        production: ['>0.2%', 'not dead', 'not op_mini all'],
        development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version'],
      },
    }, null, 2);
    
    // ZIP 파일 생성
    const zip = new JSZip();
    
    // 소스 파일 추가
    const src = zip.folder('src');
    src.file('App.js', appCode);
    src.file('App.css', css);
    src.file('index.js', indexJS);
    src.file('index.css', css);
    
    // 공용 파일 추가
    const publicFolder = zip.folder('public');
    publicFolder.file('index.html', html);
    
    // 루트 파일 추가
    zip.file('package.json', packageJSON);
    zip.file('README.md', `# ${projectName}\n\n이 프로젝트는 웹 빌더로 생성되었습니다.`);
    
    // ZIP 파일 생성 및 다운로드
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${projectName.replace(/\s+/g, '-').toLowerCase()}-source.zip`);
    
    return { success: true, message: `${projectName} 프로젝트 소스 코드가 다운로드됩니다.` };
  } catch (error) {
    console.error('다운로드 실패:', error);
    return { success: false, error: error.message };
  }
};
