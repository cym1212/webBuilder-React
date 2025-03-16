import React, { useState } from 'react';

function BoardComponent({ style, data = [] }) {
  const [posts, setPosts] = useState(data.length > 0 ? data : [
    { id: 1, title: '게시판 제목 예시 1', author: '작성자1', date: '2023-05-01', views: 42 },
    { id: 2, title: '게시판 제목 예시 2', author: '작성자2', date: '2023-05-02', views: 31 },
    { id: 3, title: '게시판 제목 예시 3', author: '작성자3', date: '2023-05-03', views: 28 },
  ]);

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
      <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginTop: '0' }}>게시판</h3>
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
            <tr key={post.id} style={{ borderBottom: '1px solid #dee2e6' }}>
              <td style={{ padding: '8px', textAlign: 'center' }}>{post.id}</td>
              <td style={{ padding: '8px', textAlign: 'left' }}>{post.title}</td>
              <td style={{ padding: '8px', textAlign: 'center' }}>{post.author}</td>
              <td style={{ padding: '8px', textAlign: 'center' }}>{post.date}</td>
              <td style={{ padding: '8px', textAlign: 'center' }}>{post.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BoardComponent; 