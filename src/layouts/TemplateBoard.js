import React from "react";
import PropTypes from "prop-types";

const TemplateBoard = ({
  children,
  headerContainerClass = "container",
  headerTop = "visible",
  headerPaddingClass = "header-padding-1",
  headerPositionClass = "header-position",
  boardType = "default",
  showSidebar = true,
  sidebarPosition = "right"
}) => {
  return (
    <div className={`template-board-layout board-type-${boardType}`}>
      <header className={`board-header ${headerPositionClass}`}>
        {headerTop === "visible" && (
          <div className="header-top-area">
            <div className={headerContainerClass}>
              <div className="row">
                <div className="col-md-6">
                  <ul className="header-contact d-flex">
                    <li><i className="fa fa-phone"></i> +01 123 456 789</li>
                    <li><i className="fa fa-envelope"></i> board@example.com</li>
                  </ul>
                </div>
                <div className="col-md-6 text-end">
                  <div className="header-account">
                    <a href="#" className="login-btn">로그인</a>
                    <a href="#" className="register-btn">회원가입</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`main-header ${headerPaddingClass}`}>
          <div className={headerContainerClass}>
            <div className="row align-items-center">
              <div className="col-lg-3">
                <div className="board-logo">
                  <a href="#">
                    <img src="https://via.placeholder.com/180x60" alt="Board Logo" />
                  </a>
                </div>
              </div>
              <div className="col-lg-6">
                <nav className="board-navigation">
                  <ul className="board-menu d-flex justify-content-center">
                    <li><a href="#" className="active">홈</a></li>
                    <li><a href="#">공지사항</a></li>
                    <li><a href="#">자유게시판</a></li>
                    <li><a href="#">Q&A</a></li>
                    <li><a href="#">갤러리</a></li>
                    <li><a href="#">자료실</a></li>
                  </ul>
                </nav>
              </div>
              <div className="col-lg-3">
                <div className="header-search">
                  <form className="d-flex">
                    <input type="text" placeholder="검색어 입력..." className="form-control" />
                    <button type="submit" className="btn btn-primary"><i className="fa fa-search"></i></button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="board-content-area">
        <div className={headerContainerClass}>
          <div className="row">
            {showSidebar && sidebarPosition === "left" && (
              <div className="col-lg-3">
                <div className="board-sidebar">
                  <div className="widget">
                    <h4 className="widget-title">게시판 메뉴</h4>
                    <ul className="board-list">
                      <li className="active"><a href="#">공지사항 <span>(25)</span></a></li>
                      <li><a href="#">자유게시판 <span>(142)</span></a></li>
                      <li><a href="#">Q&A <span>(58)</span></a></li>
                      <li><a href="#">갤러리 <span>(36)</span></a></li>
                      <li><a href="#">자료실 <span>(17)</span></a></li>
                    </ul>
                  </div>
                  
                  <div className="widget">
                    <h4 className="widget-title">인기 게시글</h4>
                    <ul className="popular-posts">
                      <li>
                        <a href="#">커뮤니티 이벤트 안내</a>
                        <span className="post-info">
                          <span className="author">관리자</span>
                          <span className="date">2023-04-10</span>
                        </span>
                      </li>
                      <li>
                        <a href="#">자주 묻는 질문 모음</a>
                        <span className="post-info">
                          <span className="author">관리자</span>
                          <span className="date">2023-04-05</span>
                        </span>
                      </li>
                      <li>
                        <a href="#">커뮤니티 가이드라인</a>
                        <span className="post-info">
                          <span className="author">관리자</span>
                          <span className="date">2023-04-01</span>
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="widget">
                    <h4 className="widget-title">로그인</h4>
                    <div className="login-box">
                      <form>
                        <div className="form-group mb-3">
                          <input type="text" className="form-control" placeholder="아이디" />
                        </div>
                        <div className="form-group mb-3">
                          <input type="password" className="form-control" placeholder="비밀번호" />
                        </div>
                        <div className="d-grid gap-2">
                          <button className="btn btn-primary">로그인</button>
                        </div>
                        <div className="login-links d-flex justify-content-between mt-3">
                          <a href="#">회원가입</a>
                          <a href="#">아이디/비밀번호 찾기</a>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className={`col-lg-${showSidebar ? 9 : 12}`}>
              <div className="board-main-content" style={{
                backgroundColor: 'transparent',
                boxShadow: 'none',
                padding: '0'
              }}>
                {boardType === "default" ? (
                  <div className="board-main-header">
                    <h2 className="board-title">자유게시판</h2>
                    <p className="board-description">자유롭게 의견을 나누는 공간입니다.</p>
                  </div>
                ) : null}
                
                <div className="board-editor-content">
                  {children}
                </div>
                
                {boardType === "default" && !children ? (
                  <div className="default-board-content">
                    <div className="board-list-tools mb-3 d-flex justify-content-between">
                      <div className="board-category-dropdown">
                        <select className="form-select">
                          <option>전체</option>
                          <option>일반</option>
                          <option>질문</option>
                          <option>정보</option>
                        </select>
                      </div>
                      <div className="board-buttons">
                        <button className="btn btn-primary">글쓰기</button>
                      </div>
                    </div>
                    
                    <div className="board-list-table">
                      <table className="table">
                        <thead>
                          <tr>
                            <th width="7%">번호</th>
                            <th width="15%">카테고리</th>
                            <th>제목</th>
                            <th width="10%">작성자</th>
                            <th width="10%">작성일</th>
                            <th width="7%">조회</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="notice">
                            <td>공지</td>
                            <td>공지사항</td>
                            <td><a href="#">게시판 이용 안내</a> <span className="comment-count">[5]</span></td>
                            <td>관리자</td>
                            <td>2023-04-15</td>
                            <td>521</td>
                          </tr>
                          <tr>
                            <td>125</td>
                            <td>일반</td>
                            <td><a href="#">오늘 날씨가 정말 좋네요</a> <span className="comment-count">[12]</span></td>
                            <td>홍길동</td>
                            <td>2023-04-14</td>
                            <td>87</td>
                          </tr>
                          <tr>
                            <td>124</td>
                            <td>질문</td>
                            <td><a href="#">게시판 사용법 질문입니다</a> <span className="comment-count">[3]</span></td>
                            <td>김철수</td>
                            <td>2023-04-13</td>
                            <td>42</td>
                          </tr>
                          <tr>
                            <td>123</td>
                            <td>정보</td>
                            <td><a href="#">유용한 사이트 모음</a> <span className="comment-count">[8]</span></td>
                            <td>이영희</td>
                            <td>2023-04-12</td>
                            <td>156</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="board-pagination d-flex justify-content-center mt-4">
                      <ul className="pagination">
                        <li className="page-item"><a className="page-link" href="#">이전</a></li>
                        <li className="page-item active"><a className="page-link" href="#">1</a></li>
                        <li className="page-item"><a className="page-link" href="#">2</a></li>
                        <li className="page-item"><a className="page-link" href="#">3</a></li>
                        <li className="page-item"><a className="page-link" href="#">4</a></li>
                        <li className="page-item"><a className="page-link" href="#">5</a></li>
                        <li className="page-item"><a className="page-link" href="#">다음</a></li>
                      </ul>
                    </div>
                    
                    <div className="board-search mt-4">
                      <div className="row justify-content-center">
                        <div className="col-md-6">
                          <form className="d-flex">
                            <select className="form-select flex-shrink-1 me-2" style={{ width: '120px' }}>
                              <option>제목</option>
                              <option>내용</option>
                              <option>작성자</option>
                              <option>제목+내용</option>
                            </select>
                            <input type="text" className="form-control me-2" placeholder="검색어를 입력하세요" />
                            <button type="submit" className="btn btn-primary">검색</button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            
            {showSidebar && sidebarPosition === "right" && (
              <div className="col-lg-3">
                <div className="board-sidebar">
                  <div className="widget">
                    <h4 className="widget-title">게시판 메뉴</h4>
                    <ul className="board-list">
                      <li><a href="#">공지사항 <span>(25)</span></a></li>
                      <li className="active"><a href="#">자유게시판 <span>(142)</span></a></li>
                      <li><a href="#">Q&A <span>(58)</span></a></li>
                      <li><a href="#">갤러리 <span>(36)</span></a></li>
                      <li><a href="#">자료실 <span>(17)</span></a></li>
                    </ul>
                  </div>
                  
                  <div className="widget">
                    <h4 className="widget-title">인기 게시글</h4>
                    <ul className="popular-posts">
                      <li>
                        <a href="#">커뮤니티 이벤트 안내</a>
                        <span className="post-info">
                          <span className="author">관리자</span>
                          <span className="date">2023-04-10</span>
                        </span>
                      </li>
                      <li>
                        <a href="#">자주 묻는 질문 모음</a>
                        <span className="post-info">
                          <span className="author">관리자</span>
                          <span className="date">2023-04-05</span>
                        </span>
                      </li>
                      <li>
                        <a href="#">커뮤니티 가이드라인</a>
                        <span className="post-info">
                          <span className="author">관리자</span>
                          <span className="date">2023-04-01</span>
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="widget">
                    <h4 className="widget-title">로그인</h4>
                    <div className="login-box">
                      <form>
                        <div className="form-group mb-3">
                          <input type="text" className="form-control" placeholder="아이디" />
                        </div>
                        <div className="form-group mb-3">
                          <input type="password" className="form-control" placeholder="비밀번호" />
                        </div>
                        <div className="d-grid gap-2">
                          <button className="btn btn-primary">로그인</button>
                        </div>
                        <div className="login-links d-flex justify-content-between mt-3">
                          <a href="#">회원가입</a>
                          <a href="#">아이디/비밀번호 찾기</a>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="board-footer">
        <div className={headerContainerClass}>
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="footer-widget">
                <div className="footer-logo mb-4">
                  <img src="https://via.placeholder.com/180x60" alt="Board Logo" />
                </div>
                <p>안전하고 편리한 게시판 서비스를 제공합니다. 다양한 주제로 소통하고 정보를 공유하세요.</p>
                <div className="footer-social">
                  <a href="#"><i className="fab fa-facebook-f"></i></a>
                  <a href="#"><i className="fab fa-twitter"></i></a>
                  <a href="#"><i className="fab fa-instagram"></i></a>
                  <a href="#"><i className="fab fa-youtube"></i></a>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="footer-widget">
                <h4>사이트 정보</h4>
                <ul className="footer-links">
                  <li><a href="#">회사 소개</a></li>
                  <li><a href="#">이용약관</a></li>
                  <li><a href="#">개인정보처리방침</a></li>
                  <li><a href="#">이메일무단수집거부</a></li>
                  <li><a href="#">고객센터</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="footer-widget">
                <h4>고객센터</h4>
                <div className="contact-info">
                  <p><i className="fa fa-phone"></i> 고객센터: 1588-1234</p>
                  <p><i className="fa fa-envelope"></i> 이메일: support@example.com</p>
                  <p><i className="fa fa-clock"></i> 운영시간: 평일 09:00 - 18:00</p>
                  <p><i className="fa fa-map-marker"></i> 주소: 서울시 강남구 테헤란로 123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="copyright-area">
          <div className={headerContainerClass}>
            <div className="row">
              <div className="col-12 text-center">
                <p>© 2023 게시판 템플릿. All Rights Reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

TemplateBoard.propTypes = {
  children: PropTypes.node,
  headerContainerClass: PropTypes.string,
  headerTop: PropTypes.string,
  headerPaddingClass: PropTypes.string,
  headerPositionClass: PropTypes.string,
  boardType: PropTypes.string,
  showSidebar: PropTypes.bool,
  sidebarPosition: PropTypes.string
};

export default TemplateBoard; 