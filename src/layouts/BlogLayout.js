import React from "react";
import PropTypes from "prop-types";

const BlogLayout = ({ 
  children, 
  showSidebar = true, 
  sidebarPosition = "right", 
  showFeatured = true 
}) => {
  return (
    <div className="blog-layout">
      <div className="container">
        {/* 헤더 영역 */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="header-container p-3 bg-light border">
              <h2 className="mb-0">블로그 레이아웃</h2>
            </div>
          </div>
        </div>

        {/* 추천 블로그 영역 */}
        {showFeatured && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="blog-featured-area p-4 bg-light border">
                <div className="row">
                  <div className="col-md-5">
                    <div className="featured-image">
                      <img 
                        src="https://via.placeholder.com/600x400" 
                        alt="Featured Post" 
                        className="img-fluid"
                      />
                    </div>
                  </div>
                  <div className="col-md-7">
                    <div className="featured-content">
                      <h3>추천 블로그 포스트 제목</h3>
                      <p>추천 블로그 포스트 요약 내용이 들어갑니다. 주요 내용을 간단히 보여주는 영역입니다. 이 부분은 블로그에서 가장 주목받는 포스트나 최신 포스트를 소개하는 데 활용할 수 있습니다.</p>
                      <div className="featured-meta text-muted">
                        <span className="me-3">2023.04.15</span>
                        <span>작성자: 홍길동</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="row">
          {/* 왼쪽 사이드바 */}
          {showSidebar && sidebarPosition === "left" && (
            <div className="col-lg-3">
              <div className="blog-sidebar p-3 border">
                <div className="sidebar-widget mb-4">
                  <h4>카테고리</h4>
                  <ul className="list-unstyled">
                    <li className="p-2 border-bottom"><a href="#" className="text-decoration-none">전체</a></li>
                    <li className="p-2 border-bottom"><a href="#" className="text-decoration-none">여행</a></li>
                    <li className="p-2 border-bottom"><a href="#" className="text-decoration-none">음식</a></li>
                    <li className="p-2 border-bottom"><a href="#" className="text-decoration-none">라이프스타일</a></li>
                    <li className="p-2"><a href="#" className="text-decoration-none">기술</a></li>
                  </ul>
                </div>
                <div className="sidebar-widget">
                  <h4>최근 글</h4>
                  <ul className="list-unstyled">
                    <li className="p-2 border-bottom">
                      <a href="#" className="text-decoration-none">블로그 포스트 제목 1</a>
                      <div className="text-muted small">2023.04.10</div>
                    </li>
                    <li className="p-2 border-bottom">
                      <a href="#" className="text-decoration-none">블로그 포스트 제목 2</a>
                      <div className="text-muted small">2023.04.08</div>
                    </li>
                    <li className="p-2">
                      <a href="#" className="text-decoration-none">블로그 포스트 제목 3</a>
                      <div className="text-muted small">2023.04.05</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* 메인 컨텐츠 영역 */}
          <div className={`${showSidebar ? "col-lg-9" : "col-lg-12"}`}>
            <div className="blog-main-content p-3 border">
              {children || (
                <div className="placeholder-content">
                  <div className="blog-posts">
                    <div className="blog-post mb-5">
                      <div className="blog-post-image mb-3">
                        <img src="https://via.placeholder.com/800x400" alt="Blog Post" className="img-fluid" />
                      </div>
                      <h3 className="blog-post-title mb-2">블로그 포스트 제목</h3>
                      <div className="blog-post-meta text-muted mb-3">
                        <span className="me-3">2023.04.15</span>
                        <span className="me-3">작성자: 홍길동</span>
                        <span>카테고리: 여행</span>
                      </div>
                      <div className="blog-post-excerpt">
                        <p>블로그 포스트 내용이 여기에 표시됩니다. 이 영역은 블로그 포스트의 일부 내용을 미리 보여주는 영역입니다. 사용자가 전체 내용을 보기 위해 포스트를 클릭할 수 있습니다.</p>
                      </div>
                      <div className="blog-post-link">
                        <a href="#" className="btn btn-outline-primary btn-sm">더 보기</a>
                      </div>
                    </div>
                    <div className="blog-post mb-5">
                      <div className="blog-post-image mb-3">
                        <img src="https://via.placeholder.com/800x400" alt="Blog Post" className="img-fluid" />
                      </div>
                      <h3 className="blog-post-title mb-2">두 번째 블로그 포스트 제목</h3>
                      <div className="blog-post-meta text-muted mb-3">
                        <span className="me-3">2023.04.10</span>
                        <span className="me-3">작성자: 김철수</span>
                        <span>카테고리: 음식</span>
                      </div>
                      <div className="blog-post-excerpt">
                        <p>두 번째 블로그 포스트 내용입니다. 이 영역은 블로그 포스트의 일부 내용을 미리 보여주는 영역입니다. 사용자가 전체 내용을 보기 위해 포스트를 클릭할 수 있습니다.</p>
                      </div>
                      <div className="blog-post-link">
                        <a href="#" className="btn btn-outline-primary btn-sm">더 보기</a>
                      </div>
                    </div>
                  </div>
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
              <div className="blog-sidebar p-3 border">
                <div className="sidebar-widget mb-4">
                  <h4>카테고리</h4>
                  <ul className="list-unstyled">
                    <li className="p-2 border-bottom"><a href="#" className="text-decoration-none">전체</a></li>
                    <li className="p-2 border-bottom"><a href="#" className="text-decoration-none">여행</a></li>
                    <li className="p-2 border-bottom"><a href="#" className="text-decoration-none">음식</a></li>
                    <li className="p-2 border-bottom"><a href="#" className="text-decoration-none">라이프스타일</a></li>
                    <li className="p-2"><a href="#" className="text-decoration-none">기술</a></li>
                  </ul>
                </div>
                <div className="sidebar-widget">
                  <h4>최근 글</h4>
                  <ul className="list-unstyled">
                    <li className="p-2 border-bottom">
                      <a href="#" className="text-decoration-none">블로그 포스트 제목 1</a>
                      <div className="text-muted small">2023.04.10</div>
                    </li>
                    <li className="p-2 border-bottom">
                      <a href="#" className="text-decoration-none">블로그 포스트 제목 2</a>
                      <div className="text-muted small">2023.04.08</div>
                    </li>
                    <li className="p-2">
                      <a href="#" className="text-decoration-none">블로그 포스트 제목 3</a>
                      <div className="text-muted small">2023.04.05</div>
                    </li>
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
              <p className="mb-0 text-center">© 2023 블로그 레이아웃. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

BlogLayout.propTypes = {
  children: PropTypes.node,
  showSidebar: PropTypes.bool,
  sidebarPosition: PropTypes.string,
  showFeatured: PropTypes.bool
};

export default BlogLayout; 