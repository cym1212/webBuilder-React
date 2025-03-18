import React, { useState, useEffect } from 'react';

function BoardComponent({ style, data = [] }) {
  // 데이터 구조 처리
  let boardData = [];
  let boardTitle = '게시판';
  let boardParameter = '';
  
  // 배열일 경우와 객체일 경우를 모두 처리
  if (Array.isArray(data)) {
    boardData = data;
  } else if (data && typeof data === 'object') {
    boardData = data.items || [];
    boardTitle = data.title || '게시판';
    boardParameter = data.parameter || '';
  }
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // API URL 결정 함수
  const getApiUrl = (parameter) => {
    switch(parameter) {
      case 'board1':
        return 'http://49.247.174.32:8080/first-board';
      case 'board2':
        return 'http://49.247.174.32:8080/second-board';
      case 'board3':
        return 'http://49.247.174.32:8080/third-board';
      case 'board4':
        return 'http://49.247.174.32:8080/gallery-board';
      default:
        // 기본 API 엔드포인트 - 유효한 값이 없을 때는 예제 데이터 사용
        return null;
    }
  };

  // 예시 데이터 생성 함수 (API 호출이 실패할 경우를 대비)
  const generateExampleData = (parameter) => {
    switch(parameter) {
      case 'board1':
        return [
          { id: 1, title: '첫번째 게시판 - 공지사항 1', author: '관리자', date: '2023-06-01', views: 120 },
          { id: 2, title: '첫번째 게시판 - 공지사항 2', author: '관리자', date: '2023-06-02', views: 95 },
          { id: 3, title: '첫번째 게시판 - 중요 안내', author: '관리자', date: '2023-06-03', views: 87 },
        ];
      case 'board2':
        return [
          { id: 1, title: '두번째 게시판 - 자유게시판 글 1', author: '사용자1', date: '2023-06-01', views: 42 },
          { id: 2, title: '두번째 게시판 - 질문이 있습니다', author: '사용자2', date: '2023-06-02', views: 31 },
          { id: 3, title: '두번째 게시판 - 의견 공유', author: '사용자3', date: '2023-06-03', views: 28 },
          { id: 4, title: '두번째 게시판 - 추천 정보', author: '사용자4', date: '2023-06-04', views: 35 },
        ];
      case 'board3':
        return [
          { id: 1, title: '세번째 게시판 - Q&A 질문', author: '질문자1', date: '2023-06-01', views: 50 },
          { id: 2, title: '세번째 게시판 - 답변 부탁드립니다', author: '질문자2', date: '2023-06-02', views: 40 },
          { id: 3, title: '세번째 게시판 - 문제 해결 방법', author: '답변자', date: '2023-06-03', views: 75 },
        ];
      case 'board4':
        return [
          { id: 1, title: '갤러리 게시판 - 풍경 사진', author: '사진작가1', date: '2023-06-01', views: 88 },
          { id: 2, title: '갤러리 게시판 - 인물 사진', author: '사진작가2', date: '2023-06-02', views: 76 },
          { id: 3, title: '갤러리 게시판 - 동물 사진', author: '사진작가3', date: '2023-06-03', views: 92 },
        ];
      default:
        return [
          { id: 1, title: '게시판 제목 예시 1', author: '작성자1', date: '2023-05-01', views: 42 },
          { id: 2, title: '게시판 제목 예시 2', author: '작성자2', date: '2023-05-02', views: 31 },
          { id: 3, title: '게시판 제목 예시 3', author: '작성자3', date: '2023-05-03', views: 28 },
        ];
    }
  };

  // 파라미터가 변경될 때마다 데이터 업데이트
  useEffect(() => {
    setLoading(true);
    setError(false);
    
    // API URL 결정
    const apiUrl = getApiUrl(boardParameter);
    
    // 실제 API 호출
    const fetchData = async () => {
      try {
        // 유효한 API URL이 있는 경우에만 호출
        if (apiUrl) {
          console.log('API 호출:', apiUrl);
          const response = await fetch(apiUrl);
          
          if (!response.ok) {
            throw new Error('API 응답 오류: ' + response.status);
          }
          
          const responseData = await response.json();
          console.log('API 응답:', responseData);
          
          // 응답 데이터 처리 (content 필드가 있으면 그것을 사용, 없으면 전체 응답을 사용)
          const data = responseData.content || responseData;
          
          if (Array.isArray(data) && data.length > 0) {
            setPosts(data);
          } else {
            throw new Error('유효한 데이터가 없습니다');
          }
        } else {
          // API URL이 없는 경우 예시 데이터 사용
          const exampleData = generateExampleData(boardParameter);
          setPosts(exampleData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('API 호출 오류:', err);
        
        // 오류 발생 시 예시 데이터로 대체
        const exampleData = generateExampleData(boardParameter);
        setPosts(exampleData);
        
        // 에러 메시지 표시
        setError(true);
        setLoading(false);
      }
    };
    
    // API 호출 실행 (약간의 지연으로 로딩 상태 표시)
    const timer = setTimeout(fetchData, 500);
    
    return () => clearTimeout(timer);
  }, [boardParameter]);

  const defaultStyle = {
    fontFamily: 'Arial, sans-serif',
    width: '100%',
    height: '100%',
    overflow: 'auto',
    padding: '10px',
    backgroundColor: '#ffffff',
    ...style
  };

  return (
    <div style={defaultStyle} className="board-component">
      <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginTop: '0' }}>
        {boardTitle}
        {boardParameter && <span style={{ fontSize: '0.8em', color: '#666', marginLeft: '10px' }}>
          (파라미터: {boardParameter})
        </span>}
      </h3>
      
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '14px', color: '#666' }}>데이터를 불러오는 중...</div>
        </div>
      )}
      
      {error && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#dc3545' }}>
          <div style={{ fontSize: '14px' }}>
            API 호출 중 오류가 발생했습니다. 예시 데이터를 표시합니다.
            <br />
            <small>파라미터: {boardParameter}</small>
          </div>
        </div>
      )}
      
      {!loading && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
              <th style={{ padding: '8px', textAlign: 'center' }}>번호</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>제목</th>
              <th style={{ padding: '8px', textAlign: 'center' }}>작성자</th>
              <th style={{ padding: '8px', textAlign: 'center' }}>날짜</th>
              <th style={{ padding: '8px', textAlign: 'center' }}>조회</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id || post._id || Math.random()} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '8px', textAlign: 'center' }}>{post.id || post._id || '-'}</td>
                <td style={{ padding: '8px', textAlign: 'left' }}>{post.title || '-'}</td>
                <td style={{ padding: '8px', textAlign: 'center' }}>{post.author || post.name || '-'}</td>
                <td style={{ padding: '8px', textAlign: 'center' }}>
                  {post.date || (post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '-')}
                </td>
                <td style={{ padding: '8px', textAlign: 'center' }}>{post.views || post.viewCount || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BoardComponent; 