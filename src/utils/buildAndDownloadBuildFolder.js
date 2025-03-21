import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { store } from '../redux/store';
import { selectComponents, selectProjectName, selectLayoutInfo } from '../redux/editorSlice';

// 리액트 빌드 파일 생성 (index.html, static 폴더 등)
const buildAndDownloadBuildFolder = async () => {
  try {
    // Redux 스토어에서 데이터 가져오기
    const state = store.getState();
    const components = selectComponents(state);
    const projectName = selectProjectName(state);
    const layoutInfo = selectLayoutInfo(state);
    
    if (!components || components.length === 0) {
      return { success: false, error: '빌드할 컴포넌트가 없습니다. 먼저 컴포넌트를 추가해주세요.' };
    }
    
    // 레이아웃 정보를 포함한 빌드된 HTML 생성 (index.html)
    const indexHTML = generateBuildHTML(projectName, components, layoutInfo);
    
    // CSS 생성 (main.css)
    const mainCSS = generateMainCSS(layoutInfo);
    
    // JavaScript 생성 (main.js)
    const mainJS = generateMainJS(components, layoutInfo);
    
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
        'main.css': './static/css/main.css',
        'main.js': './static/js/main.js',
        'index.html': './index.html'
      },
      entrypoints: ['./static/css/main.css', './static/js/main.js']
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
    
    // 프로젝트 JSON 데이터 추가 (나중에 불러오기 위함)
    const projectData = {
      name: projectName,
      components: components,
      layout: layoutInfo, // 레이아웃 정보 추가
      timestamp: new Date().toISOString()
    };
    zip.file('project-data.json', JSON.stringify(projectData, null, 2));
    
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
const generateBuildHTML = (projectName, components, layoutInfo = null) => {
  // 컴포넌트 타입 확인
  const hasLoginComponent = components.some(comp => comp.type === 'LOGIN');
  const hasBoardComponent = components.some(comp => comp.type === 'BOARD');
  const hasDetailPageComponent = components.some(comp => comp.type === 'DETAIL_PAGE');
  
  // 추가 메타 태그 및 스타일 생성
  let additionalMeta = '';
  
  // 반응형 디자인을 위한 메타 태그 추가
  additionalMeta += `
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />`;
  
  // 폰트 추가 (필요한 경우)
  additionalMeta += `
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">`;
  
  // 아이콘 라이브러리 추가 (필요한 경우)
  if (hasLoginComponent || hasBoardComponent || hasDetailPageComponent) {
    additionalMeta += `
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />`;
  }
  
  // 레이아웃 관련 추가 스타일
  let layoutStyles = '';
  if (layoutInfo && layoutInfo.selectedLayout) {
    layoutStyles = `
      /* 레이아웃 스타일 - ${layoutInfo.selectedLayout} */
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
        overflow: auto;
      }
      
      .layout-footer {
        padding: 16px;
        background-color: #f8f9fa;
        border-top: 1px solid #e9ecef;
      }
      
      /* 모바일 최적화 */
      @media (max-width: 768px) {
        .layout-sidebar {
          display: none;
        }
        
        .layout-main-content {
          width: 100%;
        }
      }`;
  }
  
  return `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="./favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="${projectName} - 웹 빌더로 생성된 웹사이트" />${additionalMeta}
    <link rel="apple-touch-icon" href="./logo192.png" />
    <link rel="manifest" href="./manifest.json" />
    <title>${projectName}</title>
    <link href="./static/css/main.css" rel="stylesheet">
    <style>
      /* 추가 인라인 스타일 */
      body, html {
        margin: 0;
        padding: 0;
        font-family: 'Noto Sans KR', sans-serif;
      }
      
      * {
        box-sizing: border-box;
      }
      
      /* 모바일 최적화 */
      @media (max-width: 768px) {
        .canvas {
          overflow-y: auto;
          height: auto;
          min-height: 100vh;
        }
      }
      ${layoutStyles}
    </style>
  </head>
  <body>
    <noscript>이 앱을 실행하려면 JavaScript를 활성화해야 합니다.</noscript>
    <div id="root"></div>
    <script src="./static/js/main.js"></script>
  </body>
</html>`;
};

// 메인 CSS 생성
const generateMainCSS = (layoutInfo = null) => {
  // 기본 CSS
  let css = `/* 웹 빌더로 생성된 CSS */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

.App {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.canvas {
  width: 100%;
  height: 100%;
  position: relative;
}
`;

  // 레이아웃 관련 스타일 추가
  if (layoutInfo && layoutInfo.selectedLayout) {
    css += `
/* 레이아웃 스타일 - ${layoutInfo.selectedLayout} */
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
  overflow: auto;
}

.layout-footer {
  padding: 16px;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

/* 모바일 최적화 */
@media (max-width: 768px) {
  .layout-sidebar {
    display: none;
  }
  
  .layout-main-content {
    width: 100%;
  }
}
`;
  }

  // 기본 스타일 추가
  css += `
/* 속성 패널 스타일 */
.property-panel {
  height: 100%;
  overflow-y: auto;
  padding-right: 10px;
  display: flex;
  flex-direction: column;
}

.property-group {
  margin-bottom: 15px;
}

.property-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.property-group input,
.property-group textarea,
.property-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.property-subgroup {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.property-field {
  margin-bottom: 8px;
}
`;

  return css;
};

// 메인 JavaScript 생성
const generateMainJS = (components, layoutInfo = null) => {
  // 컴포넌트 렌더링 코드 생성
  let componentsJS = '';
  components.forEach(component => {
    switch(component.type) {
      case 'TEXT':
        componentsJS += `
  // 텍스트 컴포넌트 생성 - ${component.id}
  const text_${component.id} = document.createElement('div');
  text_${component.id}.style.position = 'absolute';
  text_${component.id}.style.left = '${component.position.x}px';
  text_${component.id}.style.top = '${component.position.y}px';
  text_${component.id}.style.width = '${component.size.width}';
  text_${component.id}.style.height = '${component.size.height}px';
  ${Object.entries(component.style || {}).map(([key, value]) => `text_${component.id}.style.${key} = '${value}';`).join('\n  ')}
  text_${component.id}.innerHTML = \`${component.content.replace(/`/g, '\\`')}\`;
  contentContainer.appendChild(text_${component.id});
`;
        break;
      case 'IMAGE':
        componentsJS += `
  // 이미지 컴포넌트 생성 - ${component.id}
  const img_${component.id} = document.createElement('img');
  img_${component.id}.src = '${component.content.src}';
  img_${component.id}.alt = '${component.content.alt || ''}';
  img_${component.id}.style.position = 'absolute';
  img_${component.id}.style.left = '${component.position.x}px';
  img_${component.id}.style.top = '${component.position.y}px';
  img_${component.id}.style.width = '${component.size.width}';
  img_${component.id}.style.height = '${component.size.height}px';
  ${Object.entries(component.style || {}).map(([key, value]) => `img_${component.id}.style.${key} = '${value}';`).join('\n  ')}
  contentContainer.appendChild(img_${component.id});
`;
        break;
      case 'CONTAINER':
        componentsJS += `
  // 컨테이너 컴포넌트 생성 - ${component.id}
  const container_${component.id} = document.createElement('div');
  container_${component.id}.style.position = 'absolute';
  container_${component.id}.style.left = '${component.position.x}px';
  container_${component.id}.style.top = '${component.position.y}px';
  container_${component.id}.style.width = '${component.size.width}';
  container_${component.id}.style.height = '${component.size.height}px';
  ${Object.entries(component.style || {}).map(([key, value]) => `container_${component.id}.style.${key} = '${value}';`).join('\n  ')}
  contentContainer.appendChild(container_${component.id});
`;
        break;
      case 'BUTTON':
        componentsJS += `
  // 버튼 컴포넌트 생성 - ${component.id}
  const button_${component.id} = document.createElement('button');
  button_${component.id}.style.position = 'absolute';
  button_${component.id}.style.left = '${component.position.x}px';
  button_${component.id}.style.top = '${component.position.y}px';
  button_${component.id}.style.width = '${component.size.width}';
  button_${component.id}.style.height = '${component.size.height}px';
  ${Object.entries(component.style || {}).map(([key, value]) => `button_${component.id}.style.${key} = '${value}';`).join('\n  ')}
  button_${component.id}.textContent = '${component.content}';
  
  // 버튼 클릭 이벤트 추가
  button_${component.id}.addEventListener('click', function() {
    alert('버튼이 클릭되었습니다!');
  });
  
  contentContainer.appendChild(button_${component.id});
`;
        break;
      // 다른 컴포넌트 타입 추가 가능
      default:
        break;
    }
  });
  
  // 레이아웃 요소 생성 코드
  let layoutJS = '';
  let contentWrapperStart = '';
  let contentWrapperEnd = '';
  
  if (layoutInfo && layoutInfo.selectedLayout) {
    layoutJS = `
  // 레이아웃 생성 - ${layoutInfo.selectedLayout}
  const layoutContainer = document.createElement('div');
  layoutContainer.className = 'layout-container';
  
  // 헤더 생성
  const layoutHeader = document.createElement('header');
  layoutHeader.className = 'layout-header';
  layoutHeader.textContent = '${layoutInfo.layoutProps.title || 'Header'}';
  layoutContainer.appendChild(layoutHeader);
  
  // 메인 컨텐츠 영역 생성
  const layoutMainContent = document.createElement('main');
  layoutMainContent.className = 'layout-main-content';
  
  // 푸터 생성
  const layoutFooter = document.createElement('footer');
  layoutFooter.className = 'layout-footer';
  layoutFooter.textContent = '${layoutInfo.layoutProps.footer || `© ${new Date().getFullYear()}`}';
  
  // 컨텐츠 컨테이너 변수 설정 (이 변수에 컴포넌트들이 추가됨)
  let contentContainer = layoutMainContent;
    `;
    
    contentWrapperStart = `
  // 컴포넌트 추가
    `;
    
    contentWrapperEnd = `
  // 레이아웃 조립
  layoutContainer.appendChild(layoutMainContent);
  layoutContainer.appendChild(layoutFooter);
  
  // 앱에 레이아웃 추가
  app.appendChild(layoutContainer);
    `;
  } else {
    // 레이아웃이 없는 경우
    layoutJS = `
  // 기본 캔버스 생성
  const canvas = document.createElement('div');
  canvas.className = 'canvas';
  
  // 컨텐츠 컨테이너 변수 설정
  let contentContainer = canvas;
    `;
    
    contentWrapperStart = `
  // 컴포넌트 추가
    `;
    
    contentWrapperEnd = `
  // 앱에 캔버스 추가
  app.appendChild(canvas);
    `;
  }
  
  // JavaScript 코드 생성 (전체 구조)
  return `// 웹 빌더로 생성된 JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // root 요소 가져오기
  const root = document.getElementById('root');
  
  // App 컴포넌트 생성
  const app = document.createElement('div');
  app.className = 'App';
  
  ${layoutJS}
  ${contentWrapperStart}
  ${componentsJS}
  ${contentWrapperEnd}
  
  // App을 root에 추가
  root.appendChild(app);
});
`;
};

// 컴포넌트에서 이미지 URL 추출
const extractImageUrls = (components) => {
  const urls = [];
  
  components.forEach(component => {
    if (component.type === 'IMAGE' && component.content?.src) {
      urls.push(component.content.src);
    } else if (component.type === 'DETAIL_PAGE' && component.data?.image) {
      // 상세 페이지 컴포넌트에서 이미지 URL 추출
      urls.push(component.data.image);
      
      // 추가 이미지가 있는 경우 (갤러리 등)
      if (component.data.additionalImages && Array.isArray(component.data.additionalImages)) {
        component.data.additionalImages.forEach(imgUrl => {
          if (imgUrl) urls.push(imgUrl);
        });
      }
    }
    
    // 중첩된 컴포넌트가 있는 경우 재귀적으로 처리
    if (component.children && Array.isArray(component.children) && component.children.length > 0) {
      const childUrls = extractImageUrls(component.children);
      urls.push(...childUrls);
    }
  });
  
  // 중복 제거 및 빈 URL 필터링
  return [...new Set(urls)].filter(url => url && url.trim() !== '');
};

export default buildAndDownloadBuildFolder;