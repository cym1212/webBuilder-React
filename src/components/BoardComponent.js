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
          const response = await fetch(apiUrl);
          
          if (!response.ok) {
            throw new Error('API 응답 오류: ' + response.status);
          }
          
          const responseData = await response.json();
          
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
    fontFamily: 'Inter, sans-serif',
    width: '100%',
    height: '100%',
    overflow: 'auto',
    padding: '0px',
    backgroundColor: 'transparent',
    borderRadius: '0px',
    boxShadow: 'none',
    ...style
  };

  return (
    <div style={defaultStyle} className="board-component">
      <h3 style={{ 
        borderBottom: '1px solid #e2e8f0', 
        paddingBottom: '6px', 
        marginTop: '0',
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#334155',
        marginBottom: '8px'
      }}>
        {boardTitle}
        {boardParameter && <span style={{ 
          fontSize: '0.875rem', 
          color: '#64748b', 
          marginLeft: '8px',
          fontWeight: '400'
        }}>
          ({boardParameter})
        </span>}
      </h3>
      
      {loading && (
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '12px',
          borderRadius: '6px',
          backgroundColor: '#f8fafc'
        }}>
          <div style={{ 
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            border: '2px solid #e2e8f0',
            borderTopColor: '#3b82f6',
            animation: 'spin 0.8s linear infinite'
          }}></div>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <span style={{ marginLeft: '12px', fontSize: '0.875rem', color: '#64748b' }}>
            데이터를 불러오는 중...
          </span>
        </div>
      )}
      
      {error && (
        <div style={{ 
          padding: '12px 16px', 
          borderRadius: '6px', 
          backgroundColor: '#fee2e2', 
          color: '#dc2626',
          display: 'flex',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <svg style={{ width: '16px', height: '16px', marginRight: '8px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
          </svg>
          <div>
            <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>API 호출 중 오류가 발생했습니다.</div>
            <div style={{ fontSize: '0.75rem', marginTop: '4px', opacity: '0.8' }}>
              예시 데이터를 표시합니다. (파라미터: {boardParameter})
            </div>
          </div>
        </div>
      )}
      
      {!loading && (
        <div style={{ 
          borderRadius: '6px',
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ 
                backgroundColor: '#f8fafc', 
                borderBottom: '1px solid #e2e8f0'
              }}>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'center', 
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#475569'
                }}>번호</th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#475569'
                }}>제목</th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'center', 
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#475569'
                }}>작성자</th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'center', 
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#475569'
                }}>날짜</th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'center', 
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#475569'
                }}>조회</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr 
                  key={post.id || post._id || Math.random()} 
                  style={{ 
                    borderBottom: '1px solid #e2e8f0',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    color: '#64748b'
                  }}>{post.id || post._id || '-'}</td>
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#334155'
                  }}>{post.title || '-'}</td>
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    color: '#64748b'
                  }}>{post.author || post.name || '-'}</td>
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    color: '#64748b'
                  }}>
                    {post.date || (post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '-')}
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    color: '#64748b'
                  }}>
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg 
                        style={{ 
                          width: '14px', 
                          height: '14px', 
                          marginRight: '4px', 
                          color: '#94a3b8' 
                        }} 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                        <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41a1.651 1.651 0 010-1.186zM10 15a5 5 0 100-10 5 5 0 000 10z" clipRule="evenodd" />
                      </svg>
                      {post.views || post.viewCount || 0}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {posts.length === 0 && (
            <div style={{
              padding: '32px',
              textAlign: 'center',
              color: '#64748b',
              backgroundColor: '#f8fafc',
              fontSize: '0.875rem'
            }}>
              표시할 게시물이 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BoardComponent; 