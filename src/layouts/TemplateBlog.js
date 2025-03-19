import React from "react";
import PropTypes from "prop-types";

const TemplateBlog = ({
  children,
  headerContainerClass = "container",
  headerTop = "visible",
  headerPaddingClass = "header-padding-1",
  blogType = "standard",
  showSidebar = true,
  sidebarPosition = "right",
  showFeatured = true
}) => {
  return (
    <div className={`template-blog-layout blog-type-${blogType}`}>
      <header className="blog-header">
        <div className={`header-top ${headerTop === "visible" ? "" : "d-none"}`}>
          <div className={headerContainerClass}>
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="header-info">
                  <span><i className="fa fa-map-marker"></i> 서울시 강남구 테헤란로</span>
                  <span><i className="fa fa-envelope"></i> blog@example.com</span>
                </div>
              </div>
              <div className="col-md-6 text-end">
                <div className="header-social">
                  <a href="#"><i className="fab fa-facebook-f"></i></a>
                  <a href="#"><i className="fab fa-twitter"></i></a>
                  <a href="#"><i className="fab fa-instagram"></i></a>
                  <a href="#"><i className="fab fa-pinterest-p"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`main-header ${headerPaddingClass}`}>
          <div className={headerContainerClass}>
            <div className="row align-items-center">
              <div className="col-lg-3">
                <div className="blog-logo">
                  <a href="#">
                    <img src="https://via.placeholder.com/180x60" alt="Blog Logo" />
                  </a>
                </div>
              </div>
              <div className="col-lg-6">
                <nav className="blog-navigation">
                  <ul className="blog-menu d-flex justify-content-center">
                    <li><a href="#" className="active">홈</a></li>
                    <li><a href="#">라이프스타일</a></li>
                    <li><a href="#">여행</a></li>
                    <li><a href="#">음식</a></li>
                    <li><a href="#">패션</a></li>
                    <li><a href="#">테크</a></li>
                  </ul>
                </nav>
              </div>
              <div className="col-lg-3">
                <div className="header-actions d-flex justify-content-end">
                  <div className="search-form">
                    <form className="d-flex">
                      <input type="text" placeholder="검색..." className="form-control" />
                      <button type="submit" className="btn btn-primary"><i className="fa fa-search"></i></button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {showFeatured && (
        <div className="featured-posts-area">
          <div className={headerContainerClass}>
            <div className="row">
              <div className="col-12">
                <div className="featured-post-slider">
                  <div className="featured-post">
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <div className="featured-image">
                          <img src="https://via.placeholder.com/600x400" alt="Featured Post" className="img-fluid" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="featured-content">
                          <div className="post-category">
                            <a href="#">라이프스타일</a>
                          </div>
                          <h2 className="featured-title">
                            <a href="#">현대인의 삶과 웰빙에 관한 고찰</a>
                          </h2>
                          <div className="post-meta">
                            <span className="author">작성자: 김작가</span>
                            <span className="date">2023년 4월 15일</span>
                          </div>
                          <p className="excerpt">
                            현대 사회에서 웰빙의 중요성과 일상생활에서 실천할 수 있는 다양한 방법에 대해 알아봅니다. 바쁜 일상 속에서도 균형 잡힌 삶을 유지하는 방법을 소개합니다.
                          </p>
                          <a href="#" className="read-more">자세히 보기</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="blog-content-area">
        <div className={headerContainerClass}>
          <div className="row">
            {showSidebar && sidebarPosition === "left" && (
              <div className="col-lg-3">
                <div className="blog-sidebar">
                  <div className="widget">
                    <h4 className="widget-title">카테고리</h4>
                    <ul className="category-list">
                      <li><a href="#">라이프스타일 <span>(15)</span></a></li>
                      <li><a href="#">여행 <span>(23)</span></a></li>
                      <li><a href="#">음식 <span>(18)</span></a></li>
                      <li><a href="#">패션 <span>(12)</span></a></li>
                      <li><a href="#">테크 <span>(32)</span></a></li>
                    </ul>
                  </div>
                  
                  <div className="widget">
                    <h4 className="widget-title">최근 글</h4>
                    <div className="recent-posts">
                      <div className="recent-post">
                        <div className="post-thumb">
                          <img src="https://via.placeholder.com/80x60" alt="Recent Post" />
                        </div>
                        <div className="post-info">
                          <h6><a href="#">봄 시즌 패션 트렌드</a></h6>
                          <span className="date">2023년 4월 10일</span>
                        </div>
                      </div>
                      <div className="recent-post">
                        <div className="post-thumb">
                          <img src="https://via.placeholder.com/80x60" alt="Recent Post" />
                        </div>
                        <div className="post-info">
                          <h6><a href="#">유럽 여행 꿀팁</a></h6>
                          <span className="date">2023년 4월 5일</span>
                        </div>
                      </div>
                      <div className="recent-post">
                        <div className="post-thumb">
                          <img src="https://via.placeholder.com/80x60" alt="Recent Post" />
                        </div>
                        <div className="post-info">
                          <h6><a href="#">건강한 아침 식사 레시피</a></h6>
                          <span className="date">2023년 4월 1일</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="widget">
                    <h4 className="widget-title">태그</h4>
                    <div className="tag-cloud">
                      <a href="#">라이프</a>
                      <a href="#">여행</a>
                      <a href="#">음식</a>
                      <a href="#">패션</a>
                      <a href="#">테크</a>
                      <a href="#">건강</a>
                      <a href="#">문화</a>
                      <a href="#">예술</a>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className={`col-lg-${showSidebar ? 9 : 12}`}>
              <div className="blog-main-content" style={{
                backgroundColor: 'transparent',
                boxShadow: 'none',
                padding: '0',
              }}>
                {children}
              </div>
            </div>
            
            {showSidebar && sidebarPosition === "right" && (
              <div className="col-lg-3">
                <div className="blog-sidebar">
                  <div className="widget">
                    <h4 className="widget-title">카테고리</h4>
                    <ul className="category-list">
                      <li><a href="#">라이프스타일 <span>(15)</span></a></li>
                      <li><a href="#">여행 <span>(23)</span></a></li>
                      <li><a href="#">음식 <span>(18)</span></a></li>
                      <li><a href="#">패션 <span>(12)</span></a></li>
                      <li><a href="#">테크 <span>(32)</span></a></li>
                    </ul>
                  </div>
                  
                  <div className="widget">
                    <h4 className="widget-title">최근 글</h4>
                    <div className="recent-posts">
                      <div className="recent-post">
                        <div className="post-thumb">
                          <img src="https://via.placeholder.com/80x60" alt="Recent Post" />
                        </div>
                        <div className="post-info">
                          <h6><a href="#">봄 시즌 패션 트렌드</a></h6>
                          <span className="date">2023년 4월 10일</span>
                        </div>
                      </div>
                      <div className="recent-post">
                        <div className="post-thumb">
                          <img src="https://via.placeholder.com/80x60" alt="Recent Post" />
                        </div>
                        <div className="post-info">
                          <h6><a href="#">유럽 여행 꿀팁</a></h6>
                          <span className="date">2023년 4월 5일</span>
                        </div>
                      </div>
                      <div className="recent-post">
                        <div className="post-thumb">
                          <img src="https://via.placeholder.com/80x60" alt="Recent Post" />
                        </div>
                        <div className="post-info">
                          <h6><a href="#">건강한 아침 식사 레시피</a></h6>
                          <span className="date">2023년 4월 1일</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="widget">
                    <h4 className="widget-title">태그</h4>
                    <div className="tag-cloud">
                      <a href="#">라이프</a>
                      <a href="#">여행</a>
                      <a href="#">음식</a>
                      <a href="#">패션</a>
                      <a href="#">테크</a>
                      <a href="#">건강</a>
                      <a href="#">문화</a>
                      <a href="#">예술</a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="blog-footer">
        <div className={headerContainerClass}>
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="footer-widget">
                <div className="footer-logo mb-4">
                  <img src="https://via.placeholder.com/180x60" alt="Blog Logo" />
                </div>
                <p>양질의 콘텐츠와 함께하는 라이프스타일 블로그입니다. 여행, 음식, 패션, 라이프스타일 등 다양한 주제로 여러분의 일상을 풍요롭게 만들어 드립니다.</p>
                <div className="footer-social">
                  <a href="#"><i className="fab fa-facebook-f"></i></a>
                  <a href="#"><i className="fab fa-twitter"></i></a>
                  <a href="#"><i className="fab fa-instagram"></i></a>
                  <a href="#"><i className="fab fa-pinterest-p"></i></a>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="footer-widget">
                <h4>인기 글</h4>
                <div className="popular-posts">
                  <div className="popular-post">
                    <div className="post-thumb">
                      <img src="https://via.placeholder.com/100x70" alt="Popular Post" />
                    </div>
                    <div className="post-info">
                      <h6><a href="#">여름철 건강관리 방법</a></h6>
                      <span className="date">2023년 3월 15일</span>
                    </div>
                  </div>
                  <div className="popular-post">
                    <div className="post-thumb">
                      <img src="https://via.placeholder.com/100x70" alt="Popular Post" />
                    </div>
                    <div className="post-info">
                      <h6><a href="#">홈오피스 꾸미기</a></h6>
                      <span className="date">2023년 3월 10일</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="footer-widget">
                <h4>뉴스레터 구독</h4>
                <p>최신 블로그 소식을 받아보세요</p>
                <div className="newsletter-form">
                  <form>
                    <div className="form-group">
                      <input type="email" className="form-control" placeholder="이메일 주소" />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">구독하기</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="copyright-area">
          <div className={headerContainerClass}>
            <div className="row">
              <div className="col-12 text-center">
                <p>© 2023 블로그 템플릿. All Rights Reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

TemplateBlog.propTypes = {
  children: PropTypes.node,
  headerContainerClass: PropTypes.string,
  headerTop: PropTypes.string,
  headerPaddingClass: PropTypes.string,
  blogType: PropTypes.string,
  showSidebar: PropTypes.bool,
  sidebarPosition: PropTypes.string,
  showFeatured: PropTypes.bool
};

export default TemplateBlog; 