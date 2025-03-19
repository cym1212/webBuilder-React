import React from "react";
import PropTypes from "prop-types";

const BoardLayout = ({ children, showSidebar = true, sidebarPosition = "right" }) => {
  return (
    <div className="board-layout">
      <div className="container">
        <div className="row">
          {/* 헤더 영역 */}
          <div className="col-12 mb-4">
            <div className="header-container p-3 bg-light border">
              <h2 className="mb-0">게시판 레이아웃</h2>
            </div>
          </div>

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
        <div className="row mt-4">
          <div className="col-12">
            <div className="footer-container p-3 bg-light border">
              <p className="mb-0 text-center">© 2023 게시판 레이아웃. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

BoardLayout.propTypes = {
  children: PropTypes.node,
  showSidebar: PropTypes.bool,
  sidebarPosition: PropTypes.string
};

export default BoardLayout; 