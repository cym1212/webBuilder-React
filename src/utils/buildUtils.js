import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { store } from '../redux/store';
import { selectComponents, selectProjectName } from '../redux/editorSlice';

// 컴포넌트 데이터를 React 코드로 변환
const generateReactCode = (components) => {
  let imports = `import React from 'react';\nimport './App.css';\n\n`;
  let componentCode = '';
  let styles = '';

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

  // App 컴포넌트 생성
  const appComponent = `
function App() {
  return (
    <div className="App">
      <div className="canvas" style={{ position: 'relative', width: '100%', height: '100vh' }}>
        ${componentCode}
      </div>
    </div>
  );
}

export default App;
`;

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
`;
};

// 빌드된 HTML 생성 (정적 파일)
const generateStaticHTML = (projectName, components) => {
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
    </style>
  </head>
  <body>
    <div id="root">
      <div class="App">
        <div class="canvas">
          ${componentsHTML}
        </div>
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
    
    if (!components || components.length === 0) {
      return { success: false, error: '빌드할 컴포넌트가 없습니다. 먼저 컴포넌트를 추가해주세요.' };
    }
    
    // 정적 HTML 생성 (빌드된 버전)
    const staticHTML = generateStaticHTML(projectName, components);
    
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
    
    if (!components || components.length === 0) {
      return { success: false, error: '다운로드할 컴포넌트가 없습니다. 먼저 컴포넌트를 추가해주세요.' };
    }
    
    // 코드 생성
    const { appCode } = generateReactCode(components);
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