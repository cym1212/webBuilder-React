import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { store } from '../redux/store';
import { selectComponents, selectProjectName } from '../redux/editorSlice';

// 리액트 빌드 파일 생성 (index.html, static 폴더 등)
const buildAndDownloadBuildFolder = async () => {
  try {
    // Redux 스토어에서 데이터 가져오기
    const state = store.getState();
    const components = selectComponents(state);
    const projectName = selectProjectName(state);
    
    if (!components || components.length === 0) {
      return { success: false, error: '빌드할 컴포넌트가 없습니다. 먼저 컴포넌트를 추가해주세요.' };
    }
    
    // 빌드된 HTML 생성 (index.html)
    const indexHTML = generateBuildHTML(projectName, components);
    
    // CSS 생성 (main.css)
    const mainCSS = generateMainCSS();
    
    // JavaScript 생성 (main.js)
    const mainJS = generateMainJS(components);
    
    // ZIP 파일 생성 (build 폴더 구조 모방)
    const zip = new JSZip();
    
    // index.html 추가
    zip.file('index.html', indexHTML);
    
    // static 폴더 생성
    const staticFolder = zip.folder('static');
    
    // CSS 파일 추가
    const cssFolder = staticFolder.folder('css');
    cssFolder.file('main.css', mainCSS);
    
    // JS 파일 추가
    const jsFolder = staticFolder.folder('js');
    jsFolder.file('main.js', mainJS);
    
    // 이미지 파일이 있는 경우 추가
    const mediaFolder = staticFolder.folder('media');
    
    // 컴포넌트에서 이미지 URL 추출하여 추가
    const imageUrls = extractImageUrls(components);
    for (let i = 0; i < imageUrls.length; i++) {
      try {
        const imageUrl = imageUrls[i];
        if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
          // 로컬 이미지인 경우 처리 (실제 구현에서는 이미지 파일을 가져와야 함)
          // 여기서는 예시로 빈 이미지 데이터를 추가
          mediaFolder.file(`image${i}.jpg`, '');
        }
      } catch (error) {
        console.error('이미지 처리 중 오류:', error);
      }
    }
    
    // 기타 필요한 파일 추가
    zip.file('asset-manifest.json', JSON.stringify({
      files: {
        'main.css': '/static/css/main.css',
        'main.js': '/static/js/main.js',
        'index.html': '/index.html'
      },
      entrypoints: ['/static/css/main.css', '/static/js/main.js']
    }, null, 2));
    
    // robots.txt 추가
    zip.file('robots.txt', 'User-agent: *\nDisallow:');
    
    // favicon.ico 추가 (빈 파일)
    zip.file('favicon.ico', '');
    
    // manifest.json 추가
    zip.file('manifest.json', JSON.stringify({
      short_name: projectName,
      name: projectName,
      icons: [
        {
          src: 'favicon.ico',
          sizes: '64x64 32x32 24x24 16x16',
          type: 'image/x-icon'
        }
      ],
      start_url: '.',
      display: 'standalone',
      theme_color: '#000000',
      background_color: '#ffffff'
    }, null, 2));
    
    // ZIP 파일 생성 및 다운로드
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${projectName.replace(/\s+/g, '-').toLowerCase()}-build.zip`);
    
    return { success: true, message: `${projectName} 프로젝트가 성공적으로 빌드되었습니다. build 폴더가 다운로드됩니다.` };
  } catch (error) {
    console.error('빌드 실패:', error);
    return { success: false, error: error.message };
  }
};

// 빌드된 HTML 생성
const generateBuildHTML = (projectName, components) => {
  return `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="${projectName} - 웹 빌더로 생성된 웹사이트" />
    <link rel="apple-touch-icon" href="logo192.png" />
    <link rel="manifest" href="manifest.json" />
    <title>${projectName}</title>
    <link href="static/css/main.css" rel="stylesheet">
  </head>
  <body>
    <noscript>이 앱을 실행하려면 JavaScript를 활성화해야 합니다.</noscript>
    <div id="root"></div>
    <script src="static/js/main.js"></script>
  </body>
</html>`;
};

// 메인 CSS 생성
const generateMainCSS = () => {
  return `body {
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

/* 컴포넌트별 스타일은 JavaScript에서 동적으로 적용됩니다 */
`;
};

// 메인 JavaScript 생성
const generateMainJS = (components) => {
  // 컴포넌트 렌더링 코드 생성
  let componentsJS = '';
  components.forEach((component, index) => {
    const componentVar = `component${index}`;
    
    // 컴포넌트 요소 생성
    componentsJS += `
  // ${component.type} 컴포넌트 생성
  const ${componentVar} = document.createElement('${component.type === 'TEXT' || component.type === 'CONTAINER' ? 'div' : component.type === 'IMAGE' ? 'img' : 'button'}');
  ${componentVar}.style.position = 'absolute';
  ${componentVar}.style.left = '${component.position.x}px';
  ${componentVar}.style.top = '${component.position.y}px';
  ${componentVar}.style.width = '${component.size.width}px';
  ${componentVar}.style.height = '${component.size.height}px';
  `;
    
    // 컴포넌트 타입별 추가 속성
    switch(component.type) {
      case 'TEXT':
        componentsJS += `${componentVar}.innerText = \`${component.content}\`;\n`;
        break;
      case 'IMAGE':
        componentsJS += `${componentVar}.src = '${component.content.src}';\n`;
        componentsJS += `${componentVar}.alt = '${component.content.alt || ''}';\n`;
        break;
      case 'BUTTON':
        componentsJS += `${componentVar}.innerText = \`${component.content}\`;\n`;
        break;
      default:
        break;
    }
    
    // 스타일 적용
    if (component.style) {
      Object.entries(component.style).forEach(([key, value]) => {
        componentsJS += `${componentVar}.style.${key} = '${value}';\n`;
      });
    }
    
    // 캔버스에 추가
    componentsJS += `canvas.appendChild(${componentVar});\n`;
  });
  
  // 전체 JavaScript 코드
  return `// 웹 빌더로 생성된 JavaScript 코드
document.addEventListener('DOMContentLoaded', function() {
  // 앱 컨테이너 생성
  const app = document.createElement('div');
  app.className = 'App';
  
  // 캔버스 생성
  const canvas = document.createElement('div');
  canvas.className = 'canvas';
  
  // 컴포넌트 생성 및 추가
  ${componentsJS}
  
  // DOM에 추가
  app.appendChild(canvas);
  document.getElementById('root').appendChild(app);
});
`;
};

// 컴포넌트에서 이미지 URL 추출
const extractImageUrls = (components) => {
  const urls = [];
  components.forEach(component => {
    if (component.type === 'IMAGE' && component.content && component.content.src) {
      urls.push(component.content.src);
    }
  });
  return urls;
};

export default buildAndDownloadBuildFolder;