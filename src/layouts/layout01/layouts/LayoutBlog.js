import PropTypes from "prop-types";
import React, { Fragment } from "react";
import HeaderThree from "../wrappers/header/HeaderThree";
import FooterThree from "../wrappers/footer/FooterThree";
import ScrollToTop from "../components/scroll-to-top";

const LayoutBlog = ({
  children,
  headerContainerClass,
  headerTop,
  headerPaddingClass,
  blogType,
  sidebarPosition = "right",
  showSidebar = true,
  showFeatured = true
}) => {
  return (
    <Fragment>
      <HeaderThree
        layout={headerContainerClass}
        top={headerTop}
        headerPaddingClass={headerPaddingClass}
      />
      {/* 블로그 레이아웃 영역 시작
        {showFeatured && (
          <div className="blog-featured-area">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="blog-featured-slider">
                    <div className="featured-post">
                      <div className="featured-image">
                        <img src="/assets/img/blog/featured.jpg" alt="Featured Post" />
                      </div>
                      <div className="featured-content">
                        <h3>추천 블로그 포스트 제목</h3>
                        <p>추천 블로그 포스트 요약 내용이 들어갑니다. 주요 내용을 간단히 보여주는 영역입니다.</p>
                        <div className="featured-meta">
                          <span>2023.04.15</span>
                          <span>작성자: 홍길동</span>
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
          <div className="container">
            <div className="row">
              {showSidebar && sidebarPosition === "left" && (
                <div className="col-lg-3">
                  <div className="blog-sidebar">
                    <div className="sidebar-widget">
                      <h4>카테고리</h4>
                      <ul className="sidebar-categories">
                        <li><a href="#">전체</a></li>
                        <li><a href="#">여행</a></li>
                        <li><a href="#">음식</a></li>
                        <li><a href="#">라이프스타일</a></li>
                        <li><a href="#">기술</a></li>
                      </ul>
                    </div>
                    <div className="sidebar-widget">
                      <h4>최근 글</h4>
                      <ul className="sidebar-recent-posts">
                        <li>
                          <a href="#">블로그 포스트 제목 1</a>
                          <span>2023.04.10</span>
                        </li>
                        <li>
                          <a href="#">블로그 포스트 제목 2</a>
                          <span>2023.04.08</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              <div className={`${showSidebar ? "col-lg-9" : "col-lg-12"}`}>
                <div className="blog-main-content">
                  {children}
                </div>
              </div>
              
              {showSidebar && sidebarPosition === "right" && (
                <div className="col-lg-3">
                  <div className="blog-sidebar">
                    <div className="sidebar-widget">
                      <h4>카테고리</h4>
                      <ul className="sidebar-categories">
                        <li><a href="#">전체</a></li>
                        <li><a href="#">여행</a></li>
                        <li><a href="#">음식</a></li>
                        <li><a href="#">라이프스타일</a></li>
                        <li><a href="#">기술</a></li>
                      </ul>
                    </div>
                    <div className="sidebar-widget">
                      <h4>최근 글</h4>
                      <ul className="sidebar-recent-posts">
                        <li>
                          <a href="#">블로그 포스트 제목 1</a>
                          <span>2023.04.10</span>
                        </li>
                        <li>
                          <a href="#">블로그 포스트 제목 2</a>
                          <span>2023.04.08</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      블로그 레이아웃 영역 끝 */}
      {children}
      <FooterThree
        backgroundColorClass="footer-white"
        spaceTopClass="pt-100"
        spaceBottomClass="pb-70"
      />
      <ScrollToTop />
    </Fragment>
  );
};

LayoutBlog.propTypes = {
  children: PropTypes.node,
  headerContainerClass: PropTypes.string,
  headerTop: PropTypes.string,
  headerPaddingClass: PropTypes.string,
  blogType: PropTypes.string,
  sidebarPosition: PropTypes.string,
  showSidebar: PropTypes.bool,
  showFeatured: PropTypes.bool
};

export default LayoutBlog; 