import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// 컴포넌트를 HTML로 변환
const generateHTML = (components) => {
  let bodyContent = '';
  let cssRules = [];
  
  components.forEach(component => {
    const { id, type, position, size, style, content } = component;
    
    // 고유 클래스명 생성
    const className = `component-${id}`;
    
    // 컴포넌트별 HTML 생성
    let htmlElement = '';
    switch(type) {
      case 'TEXT':
        htmlElement = `<div class="${className}">${content}</div>`;
        break;
      case 'IMAGE':
        htmlElement = `<img class="${className}" src="${content.src}" alt="${content.alt}" />`;
        break;
      case 'CONTAINER':
        htmlElement = `<div class="${className}"></div>`;
        break;
      case 'BUTTON':
        htmlElement = `<button class="${className}">${content}</button>`;
        break;
      default:
        break;
    }
    
    bodyContent += htmlElement + '\n';
    
    // 스타일 규칙 생성
    const cssRule = `.${className} {
      position: absolute;
      left: ${position.x}px;
      top: ${position.y}px;
      width: ${size.width}px;
      height: ${size.height}px;
      ${Object.entries(style).map(([key, value]) => `${key}: ${value};`).join('\n  ')}
    }`;
    
    cssRules.push(cssRule);
  });
  
  // 완성된 HTML 문서 생성
  const htmlDocument = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>웹 빌더로 만든 페이지</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="page-container">
    ${bodyContent}
  </div>
</body>
</html>
  `;
  
  // CSS 문서 생성
  const cssDocument = `
.page-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

${cssRules.join('\n\n')}
  `;
  
  return { html: htmlDocument, css: cssDocument };
};

// 코드 파일 다운로드 함수
export const exportAsZip = (components) => {
  const { html, css } = generateHTML(components);
  
  const zip = new JSZip();
  zip.file('index.html', html);
  zip.file('styles.css', css);
  
  zip.generateAsync({ type: 'blob' })
    .then(content => {
      saveAs(content, 'web-builder-export.zip');
    });
};