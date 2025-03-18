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
const generateBuildHTML = (projectName, components) => {
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
const generateMainCSS = () => {
  return `/* 웹 빌더로 생성된 CSS */
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

.add-button,
.remove-button {
  padding: 5px 10px;
  margin-top: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-button {
  background-color: #4a90e2;
  color: white;
}

.remove-button {
  background-color: #e74c3c;
  color: white;
}

.delete-button {
  background-color: #e74c3c;
  color: white;
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}

/* 로그인 컴포넌트 스타일 */
.login-component {
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.login-form {
  padding: 20px;
}

.login-form h3 {
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 10px;
}

.login-button:hover {
  background-color: #3a80d2;
}

/* 게시판 컴포넌트 스타일 */
.board-component {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.board-container {
  padding: 20px;
}

.board-container h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.board-loading {
  padding: 20px;
  text-align: center;
  color: #666;
}

.board-loading:after {
  content: '';
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-left: 10px;
  border: 2px solid #ddd;
  border-radius: 50%;
  border-top-color: #4a90e2;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.board-error {
  padding: 20px;
  text-align: center;
  color: #e74c3c;
  background-color: #fdf3f2;
  border-radius: 4px;
  margin-bottom: 20px;
}

.board-table {
  width: 100%;
  border-collapse: collapse;
}

.board-table th,
.board-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.board-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #555;
}

.board-table tr:hover {
  background-color: #f8f9fa;
}

/* 상세 페이지 컴포넌트 스타일 */
.detail-page-component {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: auto;
}

.detail-container {
  padding: 20px;
}

.detail-container h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.product-container {
  display: flex;
  flex-direction: column;
}

.product-image {
  margin-bottom: 20px;
}

.product-image img {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 4px;
}

.product-info h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #555;
  font-size: 16px;
}

.product-price p {
  font-size: 24px;
  font-weight: 600;
  color: #e63946;
  margin: 0 0 20px 0;
}

.product-description {
  margin-bottom: 20px;
}

.product-specs table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.product-specs th,
.product-specs td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.product-specs th {
  width: 30%;
  color: #555;
}

.product-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.cart-button,
.buy-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.cart-button {
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}

.buy-button {
  background-color: #4a90e2;
  color: white;
}

.cart-button:hover {
  background-color: #e9ecef;
}

.buy-button:hover {
  background-color: #3a80d2;
}

@media (min-width: 768px) {
  .product-container {
    flex-direction: row;
    gap: 30px;
  }
  
  .product-image {
    flex: 1;
    margin-bottom: 0;
  }
  
  .product-info {
    flex: 1;
  }
}
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
  const ${componentVar} = document.createElement('div');
  ${componentVar}.style.position = 'absolute';
  ${componentVar}.style.left = '${component.position.x}px';
  ${componentVar}.style.top = '${component.position.y}px';
  ${componentVar}.style.width = '${component.size.width}px';
  ${componentVar}.style.height = '${component.size.height}px';
  `;
    
    // 컴포넌트 타입별 추가 속성
    switch(component.type) {
      case 'TEXT':
        componentsJS += `${componentVar}.innerText = \`${component.content || ''}\`;\n`;
        break;
      case 'IMAGE':
        componentsJS += `
  const img = document.createElement('img');
  img.src = '${component.content?.src || ''}';
  img.alt = '${component.content?.alt || ''}';
  img.style.width = '100%';
  img.style.height = '100%';
  ${componentVar}.appendChild(img);
        `;
        break;
      case 'BUTTON':
        componentsJS += `
  const button = document.createElement('button');
  button.innerText = \`${component.content || '버튼'}\`;
  button.style.width = '100%';
  button.style.height = '100%';
  ${componentVar}.appendChild(button);
        `;
        break;
      case 'CONTAINER':
        componentsJS += `${componentVar}.className = 'container-component';\n`;
        break;
      case 'LOGIN':
        const loginTitle = component.data?.title || '로그인';
        const loginButtonColor = component.style?.buttonColor || '#4a90e2';
        const loginApiUrl = component.data?.apiUrl || 'https://api.example.com/login';
        
        componentsJS += `
  ${componentVar}.className = 'login-component';
  ${componentVar}.innerHTML = \`
    <div class="login-form">
      <h3>${loginTitle}</h3>
      <form id="login-form-${index}">
        <div class="form-group">
          <label for="username-${index}">아이디</label>
          <input type="text" id="username-${index}" placeholder="아이디를 입력하세요" />
        </div>
        <div class="form-group">
          <label for="password-${index}">비밀번호</label>
          <input type="password" id="password-${index}" placeholder="비밀번호를 입력하세요" />
        </div>
        <div class="login-message" style="display: none; margin: 10px 0; padding: 10px; border-radius: 4px;"></div>
        <button type="submit" class="login-button" style="background-color: ${loginButtonColor}">로그인</button>
      </form>
    </div>
  \`;
  
  // 로그인 폼 이벤트 리스너 추가
  setTimeout(() => {
    const loginForm = document.getElementById('login-form-${index}');
    const usernameInput = document.getElementById('username-${index}');
    const passwordInput = document.getElementById('password-${index}');
    const messageDiv = ${componentVar}.querySelector('.login-message');
    
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();
      
      // 입력 검증
      if (!username || !password) {
        messageDiv.style.display = 'block';
        messageDiv.style.backgroundColor = '#fdf3f2';
        messageDiv.style.color = '#e74c3c';
        messageDiv.textContent = '아이디와 비밀번호를 모두 입력해주세요.';
        return;
      }
      
      // 로그인 버튼 비활성화 및 로딩 표시
      const loginButton = loginForm.querySelector('.login-button');
      const originalText = loginButton.textContent;
      loginButton.disabled = true;
      loginButton.textContent = '로그인 중...';
      
      try {
        // 실제 환경에서는 아래 주석 해제하여 사용
        const response = await fetch('${loginApiUrl}', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
          throw new Error('로그인 실패');
        }
        
        const data = await response.json();
        
        if (data.success) {
          // 로그인 성공
          messageDiv.style.display = 'block';
          messageDiv.style.backgroundColor = '#e8f5e9';
          messageDiv.style.color = '#388e3c';
          messageDiv.textContent = '로그인 성공! 환영합니다.';
          
          // 세션 스토리지에 로그인 정보 저장
          sessionStorage.setItem('isLoggedIn', 'true');
          sessionStorage.setItem('username', username);
          
          // 3초 후 메시지 숨기기
          setTimeout(() => {
            messageDiv.style.display = 'none';
          }, 3000);
        } else {
          // 로그인 실패
          messageDiv.style.display = 'block';
          messageDiv.style.backgroundColor = '#fdf3f2';
          messageDiv.style.color = '#e74c3c';
          messageDiv.textContent = '아이디 또는 비밀번호가 올바르지 않습니다.';
        }
      } catch (error) {
        console.error('로그인 오류:', error);
        messageDiv.style.display = 'block';
        messageDiv.style.backgroundColor = '#fdf3f2';
        messageDiv.style.color = '#e74c3c';
        messageDiv.textContent = '로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.';
      } finally {
        // 로그인 버튼 다시 활성화
        loginButton.disabled = false;
        loginButton.textContent = originalText;
      }
    });
  }, 500);
        `;
        break;
      case 'BOARD':
        // 게시판 데이터 처리
        let boardItems = [];
        let boardTitle = '게시판';
        let boardParameter = '';
        
        // 데이터 구조에 따라 다르게 처리
        if (Array.isArray(component.data)) {
          boardItems = component.data;
        } else if (component.data) {
          boardItems = component.data.items || [];
          boardTitle = component.data.title || '게시판';
          boardParameter = component.data.parameter || '';
          console.log('게시판 데이터:', component.data); // 디버깅용
        }
        
        // 보드 컴포넌트 HTML 생성 - 변수 값 확인을 위한 로그 추가
        console.log('사용되는 제목:', boardTitle);
        console.log('사용되는 파라미터:', boardParameter);
        
        let boardRows = '';
        
        boardItems.forEach(post => {
          boardRows += `
            <tr>
              <td>${post.id || ''}</td>
              <td>${post.title || ''}</td>
              <td>${post.author || ''}</td>
              <td>${post.date || ''}</td>
              <td>${post.views || 0}</td>
            </tr>
          `;
        });
        
        componentsJS += `
  ${componentVar}.className = 'board-component';
  ${componentVar}.setAttribute('data-parameter', '${boardParameter}');
  
  // 게시판 HTML 구조 생성
  ${componentVar}.innerHTML = \`
    <div class="board-container">
      <h3>${boardTitle}</h3>
      <div class="board-loading" style="display: none; text-align: center; padding: 20px;">
        <p>데이터를 불러오는 중...</p>
      </div>
      <div class="board-error" style="display: none; text-align: center; padding: 20px; color: #e74c3c;">
        <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
      </div>
      <table class="board-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>날짜</th>
            <th>조회</th>
          </tr>
        </thead>
        <tbody>
          ${boardRows}
        </tbody>
      </table>
    </div>
  \`;
  
  // 파라미터가 있는 경우 API에서 데이터 가져오기
  if ('${boardParameter}') {
    // 게시판 데이터 로드 함수
    const loadBoardData = async (boardElement) => {
      const parameter = boardElement.getAttribute('data-parameter');
      const boardContainer = boardElement.querySelector('.board-container');
      const loadingElement = boardElement.querySelector('.board-loading');
      const errorElement = boardElement.querySelector('.board-error');
      const tableElement = boardElement.querySelector('.board-table');
      
      // 로딩 표시
      loadingElement.style.display = 'block';
      tableElement.style.display = 'none';
      errorElement.style.display = 'none';
      
      try {
        // 파라미터 값에 따라 다른 API 엔드포인트 사용
        let apiUrl = '';
        
        switch(parameter) {
          case 'board1':
            apiUrl = 'http://49.247.174.32:8080/first-board';
            break;
          case 'board2':
            apiUrl = 'http://49.247.174.32:8080/second-board';
            break;
          case 'board3':
            apiUrl = 'http://49.247.174.32:8080/third-board';
            break;
          case 'board4':
            apiUrl = 'http://49.247.174.32:8080/gallery-board';
            break;
          default:
            // 기본 API 엔드포인트
            apiUrl = 'https://api.example.com/boards/default';
        }
        
        // API 호출 (fetch 사용)
        const fetchBoardData = async () => {
          try {
            // 실제 API 호출로 데이터 가져오기
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('API 응답 오류');
            const responseData = await response.json();
            const data = responseData.content || [];
            
            // 예시 데이터 (API 호출이 실패할 경우 사용할 수 있음)
            /* 
            const data = [
              { id: 1, title: '파라미터 ' + parameter + ' - 게시글 1', author: '작성자1', date: '2023-06-01', views: 42 },
              { id: 2, title: '파라미터 ' + parameter + ' - 게시글 2', author: '작성자2', date: '2023-06-02', views: 31 },
              { id: 3, title: '파라미터 ' + parameter + ' - 게시글 3', author: '작성자3', date: '2023-06-03', views: 28 },
              { id: 4, title: '파라미터 ' + parameter + ' - 게시글 4', author: '작성자4', date: '2023-06-04', views: 15 },
              { id: 5, title: '파라미터 ' + parameter + ' - 게시글 5', author: '작성자5', date: '2023-06-05', views: 22 }
            ];
            */
            
            // 테이블 내용 업데이트
            const tbody = tableElement.querySelector('tbody');
            tbody.innerHTML = '';
            
            data.forEach(post => {
              const row = document.createElement('tr');
              row.innerHTML = \`
                <td>\${post.id}</td>
                <td>\${post.title}</td>
                <td>\${post.name || post.author || ''}</td>
                <td>\${post.createdAt ? new Date(post.createdAt).toLocaleDateString() : (post.date || '')}</td>
                <td>\${post.viewCount || post.views || 0}</td>
              \`;
              tbody.appendChild(row);
            });
            
            // 로딩 숨기고 테이블 표시
            loadingElement.style.display = 'none';
            tableElement.style.display = 'table';
          } catch (error) {
            console.error('API 호출 오류:', error);
            loadingElement.style.display = 'none';
            errorElement.style.display = 'block';
          }
        };
        
        // API 호출 실행 (1초 지연 시뮬레이션)
        setTimeout(fetchBoardData, 1000);
      } catch (error) {
        console.error('게시판 데이터 로드 실패:', error);
        loadingElement.style.display = 'none';
        errorElement.style.display = 'block';
      }
    };
    
    // DOMContentLoaded 이벤트에서 데이터 로드 함수 호출
    setTimeout(() => {
      loadBoardData(${componentVar});
    }, 500);
  }
        `;
        break;
      case 'DETAIL_PAGE':
        const productData = component.data || {};
        const productId = productData.productId || '1';
        const detailApiUrl = productData.apiUrl || 'https://api.example.com/products';
        
        componentsJS += `
  ${componentVar}.className = 'detail-page-component';
  ${componentVar}.setAttribute('data-product-id', '${productId}');
  
  // 상세 페이지 기본 구조
  ${componentVar}.innerHTML = \`
    <div class="detail-container">
      <div class="detail-loading" style="display: block; text-align: center; padding: 40px;">
        <p>상품 정보를 불러오는 중...</p>
      </div>
      <div class="detail-error" style="display: none; text-align: center; padding: 40px; color: #e74c3c;">
        <p>상품 정보를 불러오는 중 오류가 발생했습니다.</p>
        <button class="retry-button" style="padding: 8px 16px; background-color: #4a90e2; color: white; border: none; border-radius: 4px; margin-top: 10px;">다시 시도</button>
      </div>
      <div class="product-content" style="display: none;">
        <h2 class="product-title">상품 상세 페이지</h2>
        <div class="product-container">
          <div class="product-image">
            <img src="" alt="상품 이미지" />
          </div>
          <div class="product-info">
            <div class="product-price">
              <h3>가격</h3>
              <p class="price-value"></p>
            </div>
            <div class="product-description">
              <h3>제품 설명</h3>
              <p class="description-text"></p>
            </div>
            <div class="product-specs">
              <h3>제품 스펙</h3>
              <table>
                <tbody class="specs-table-body">
                </tbody>
              </table>
            </div>
            <div class="product-actions">
              <button class="cart-button">장바구니 담기</button>
              <button class="buy-button">바로 구매하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  \`;
  
  // 상품 데이터 로드 함수
  setTimeout(() => {
    const loadProductData = async () => {
      const productId = ${componentVar}.getAttribute('data-product-id');
      const detailContainer = ${componentVar}.querySelector('.detail-container');
      const loadingElement = ${componentVar}.querySelector('.detail-loading');
      const errorElement = ${componentVar}.querySelector('.detail-error');
      const productContent = ${componentVar}.querySelector('.product-content');
      
      try {
        // 실제 환경에서는 아래 주석 해제하여 사용
        const response = await fetch(\`${detailApiUrl}/\${productId}\`);
        if (!response.ok) throw new Error('API 응답 오류');
        const data = await response.json();
        
        // 데이터 표시
        const titleElement = ${componentVar}.querySelector('.product-title');
        const imageElement = ${componentVar}.querySelector('.product-image img');
        const priceElement = ${componentVar}.querySelector('.price-value');
        const descriptionElement = ${componentVar}.querySelector('.description-text');
        const specsTableBody = ${componentVar}.querySelector('.specs-table-body');
        
        titleElement.textContent = data.title;
        imageElement.src = data.image;
        imageElement.alt = data.title;
        priceElement.textContent = data.price;
        descriptionElement.textContent = data.description;
        
        // 스펙 테이블 생성
        specsTableBody.innerHTML = '';
        if (data.specs && Array.isArray(data.specs)) {
          data.specs.forEach(spec => {
            const row = document.createElement('tr');
            row.innerHTML = \`
              <th>\${spec.label}</th>
              <td>\${spec.value}</td>
            \`;
            specsTableBody.appendChild(row);
          });
        }
        
        // 버튼 이벤트 리스너 추가
        const cartButton = ${componentVar}.querySelector('.cart-button');
        const buyButton = ${componentVar}.querySelector('.buy-button');
        
        cartButton.addEventListener('click', () => {
          alert('장바구니에 추가되었습니다: ' + data.title);
        });
        
        buyButton.addEventListener('click', () => {
          alert('구매 페이지로 이동합니다: ' + data.title);
        });
        
        // 로딩 숨기고 콘텐츠 표시
        loadingElement.style.display = 'none';
        productContent.style.display = 'block';
      } catch (error) {
        console.error('상품 데이터 로드 실패:', error);
        loadingElement.style.display = 'none';
        errorElement.style.display = 'block';
        
        // 재시도 버튼 이벤트 리스너
        const retryButton = errorElement.querySelector('.retry-button');
        retryButton.addEventListener('click', () => {
          errorElement.style.display = 'none';
          loadingElement.style.display = 'block';
          loadProductData();
        });
      }
    };
    
    // 상품 데이터 로드 실행
    loadProductData();
  }, 500);
        `;
        break;
      default:
        break;
    }
    
    // 스타일 적용
    if (component.style) {
      Object.entries(component.style).forEach(([key, value]) => {
        // buttonColor는 이미 처리했으므로 스킵
        if (key !== 'buttonColor') {
          componentsJS += `${componentVar}.style.${key} = '${value}';\n`;
        }
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