import React from "react";
import PropTypes from "prop-types";

const BoardLayout = ({ 
  children, 
  showSidebar = true, 
  sidebarPosition = "right",
  headerStyle = "community",
  footerStyle = "community",
  colorTheme = "light"
}) => {
  // 색상 테마 스타일
  const getThemeColors = () => {
    switch(colorTheme) {
      case 'dark':
        return {
          bgMain: '#212529',
          bgSecondary: '#343a40',
          text: '#f8f9fa',
          accent: '#6c757d',
          border: '#495057'
        };
      case 'colorful':
        return {
          bgMain: '#ffffff',
          bgSecondary: '#f8f9fa',
          text: '#212529',
          accent: '#0d6efd',
          border: '#dee2e6'
        };
      case 'light':
      default:
        return {
          bgMain: '#ffffff',
          bgSecondary: '#f8f9fa',
          text: '#212529',
          accent: '#6c757d',
          border: '#dee2e6'
        };
    }
  };

  // 헤더 스타일 렌더링
  const renderHeader = () => {
    const colors = getThemeColors();

    switch(headerStyle) {
      case 'forum':
        return (
          <div className="header-container p-3 mb-4" style={{ backgroundColor: colors.bgSecondary, borderBottom: `1px solid ${colors.border}` }}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <h2 className="mb-0 me-4" style={{ color: colors.text }}>커뮤니티 포럼</h2>
                <div className="btn-group">
                  <button className="btn btn-sm btn-outline-secondary">홈</button>
                  <button className="btn btn-sm btn-outline-secondary">게시판</button>
                  <button className="btn btn-sm btn-outline-secondary">회원목록</button>
                  <button className="btn btn-sm btn-outline-secondary">FAQ</button>
                </div>
              </div>
              <div>
                <button className="btn btn-sm btn-outline-primary me-2">로그인</button>
                <button className="btn btn-sm btn-primary">회원가입</button>
              </div>
            </div>
          </div>
        );
        
      case 'simple':
        return (
          <div className="header-container p-3 mb-4" style={{ backgroundColor: colors.bgMain, borderBottom: `1px solid ${colors.border}` }}>
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="mb-0" style={{ color: colors.text }}>심플 게시판</h2>
              <div className="d-flex">
                <input type="text" className="form-control form-control-sm me-2" placeholder="검색..." />
                <button className="btn btn-sm btn-secondary">검색</button>
              </div>
            </div>
          </div>
        );
        
      case 'community':
      default:
        return (
          <div className="header-container p-4 mb-4" style={{ 
            backgroundColor: colors.bgSecondary, 
            borderBottom: `1px solid ${colors.border}`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div className="row align-items-center">
              <div className="col-lg-4">
                <h2 className="mb-0" style={{ color: colors.text }}>커뮤니티 게시판</h2>
              </div>
              <div className="col-lg-4">
                <div className="input-group">
                  <input type="text" className="form-control" placeholder="게시글 검색..." />
                  <button className="btn btn-primary">검색</button>
                </div>
              </div>
              <div className="col-lg-4 text-end">
                <button className="btn btn-outline-secondary me-2">로그인</button>
                <button className="btn btn-primary">새 글 작성</button>
              </div>
            </div>
          </div>
        );
    }
  };

  // 푸터 스타일 렌더링
  const renderFooter = () => {
    const colors = getThemeColors();

    switch(footerStyle) {
      case 'simple':
        return (
          <div className="footer-container p-3 mt-4" style={{ backgroundColor: colors.bgSecondary, borderTop: `1px solid ${colors.border}` }}>
            <p className="mb-0 text-center" style={{ color: colors.text }}>© 2023 심플 게시판. All rights reserved.</p>
          </div>
        );
        
      case 'detailed':
        return (
          <div className="footer-container p-4 mt-4" style={{ backgroundColor: colors.bgSecondary, borderTop: `1px solid ${colors.border}` }}>
            <div className="row">
              <div className="col-md-6">
                <h5 style={{ color: colors.text }}>게시판 정보</h5>
                <p style={{ color: colors.text }}>이 게시판은 다양한 주제에 대한 의견을 나누는 공간입니다.</p>
                <p style={{ color: colors.text }}>문의사항: contact@example.com</p>
              </div>
              <div className="col-md-3">
                <h5 style={{ color: colors.text }}>바로가기</h5>
                <ul className="list-unstyled">
                  <li><a href="#" style={{ color: colors.accent }}>이용약관</a></li>
                  <li><a href="#" style={{ color: colors.accent }}>개인정보처리방침</a></li>
                  <li><a href="#" style={{ color: colors.accent }}>FAQ</a></li>
                </ul>
              </div>
              <div className="col-md-3">
                <h5 style={{ color: colors.text }}>팔로우</h5>
                <div className="d-flex">
                  <a href="#" className="me-2" style={{ color: colors.accent }}><i className="fab fa-facebook"></i></a>
                  <a href="#" className="me-2" style={{ color: colors.accent }}><i className="fab fa-twitter"></i></a>
                  <a href="#" className="me-2" style={{ color: colors.accent }}><i className="fab fa-instagram"></i></a>
                </div>
              </div>
            </div>
            <div className="text-center mt-3" style={{ color: colors.text }}>
              <p className="mb-0">© 2023 상세 게시판. All rights reserved.</p>
            </div>
          </div>
        );
        
      case 'community':
      default:
        return (
          <div className="footer-container p-4 mt-4" style={{ 
            backgroundColor: colors.bgSecondary, 
            borderTop: `1px solid ${colors.border}`,
            boxShadow: '0 -2px 4px rgba(0,0,0,0.05)'
          }}>
            <div className="row">
              <div className="col-md-8">
                <div className="d-flex">
                  <a href="#" className="me-3" style={{ color: colors.text }}>이용약관</a>
                  <a href="#" className="me-3" style={{ color: colors.text }}>개인정보처리방침</a>
                  <a href="#" className="me-3" style={{ color: colors.text }}>커뮤니티 가이드라인</a>
                  <a href="#" style={{ color: colors.text }}>문의하기</a>
                </div>
              </div>
              <div className="col-md-4 text-end">
                <p className="mb-0" style={{ color: colors.text }}>© 2023 커뮤니티 게시판. All rights reserved.</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="board-layout">
      <div className="container">
        {/* 헤더 영역 */}
        {renderHeader()}

        <div className="row">
          {/* 왼쪽 사이드바 */}
          {showSidebar && sidebarPosition === "left" && (
            <div className="col-lg-3">
              <div className="board-sidebar p-3 border">
                <div className="board-categories">
                  <h4>카테고리</h4>
                  <ul className="list-unstyled">
                    <li className="p-2 border-bottom">공지사항</li>
                    <li className="p-2 border-bottom">자유게시판</li>
                    <li className="p-2 border-bottom">Q&A</li>
                    <li className="p-2">자료실</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* 메인 컨텐츠 영역 */}
          <div className={`${showSidebar ? "col-lg-9" : "col-lg-12"}`}>
            <div className="board-main-content p-3 border">
              {children || (
                <div className="placeholder-content">
                  <div className="d-flex justify-content-between mb-4">
                    <h3>게시판 제목</h3>
                    <button className="btn btn-primary">글쓰기</button>
                  </div>
                  <table className="table">
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
                      <tr>
                        <td>3</td>
                        <td>게시글 제목 예시입니다</td>
                        <td>홍길동</td>
                        <td>2023-04-15</td>
                        <td>42</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>두 번째 게시글 입니다</td>
                        <td>김철수</td>
                        <td>2023-04-14</td>
                        <td>18</td>
                      </tr>
                      <tr>
                        <td>1</td>
                        <td>첫 번째 게시글 입니다</td>
                        <td>이영희</td>
                        <td>2023-04-13</td>
                        <td>35</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="d-flex justify-content-center">
                    <nav>
                      <ul className="pagination">
                        <li className="page-item"><a className="page-link" href="#">이전</a></li>
                        <li className="page-item active"><a className="page-link" href="#">1</a></li>
                        <li className="page-item"><a className="page-link" href="#">2</a></li>
                        <li className="page-item"><a className="page-link" href="#">3</a></li>
                        <li className="page-item"><a className="page-link" href="#">다음</a></li>
                      </ul>
                    </nav>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* 오른쪽 사이드바 */}
          {showSidebar && sidebarPosition === "right" && (
            <div className="col-lg-3">
              <div className="board-sidebar p-3 border">
                <div className="board-categories">
                  <h4>카테고리</h4>
                  <ul className="list-unstyled">
                    <li className="p-2 border-bottom">공지사항</li>
                    <li className="p-2 border-bottom">자유게시판</li>
                    <li className="p-2 border-bottom">Q&A</li>
                    <li className="p-2">자료실</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* 푸터 영역 */}
        {renderFooter()}
      </div>
    </div>
  );
};

BoardLayout.propTypes = {
  children: PropTypes.node,
  showSidebar: PropTypes.bool,
  sidebarPosition: PropTypes.string,
  headerStyle: PropTypes.oneOf(['community', 'forum', 'simple']),
  footerStyle: PropTypes.oneOf(['community', 'simple', 'detailed']),
  colorTheme: PropTypes.oneOf(['light', 'dark', 'colorful'])
};

export default BoardLayout; 