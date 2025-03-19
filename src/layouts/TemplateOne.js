import React from "react";
import PropTypes from "prop-types";

const TemplateOne = ({
  children,
  headerContainerClass = "container",
  headerTop = "visible",
  headerPaddingClass = "header-padding-1",
  headerPositionClass = "header-position"
}) => {
  return (
    <div className="template-layout-one">
      <header className={`header-area ${headerPositionClass}`}>
        {headerTop === "visible" && (
          <div className="header-top-area">
            <div className={headerContainerClass}>
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="header-top-left">
                    <ul className="d-flex">
                      <li><i className="fa fa-phone"></i> +01 123 456 789</li>
                      <li><i className="fa fa-envelope"></i> info@example.com</li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="header-top-right d-flex justify-content-end">
                    <ul className="d-flex">
                      <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                      <li><a href="#"><i className="fab fa-twitter"></i></a></li>
                      <li><a href="#"><i className="fab fa-instagram"></i></a></li>
                      <li><a href="#"><i className="fab fa-youtube"></i></a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`sticky-bar ${headerPaddingClass}`}>
          <div className={headerContainerClass}>
            <div className="row align-items-center">
              <div className="col-xl-2 col-lg-2 col-md-6 col-4">
                <div className="logo">
                  <a href="#">
                    <img src="https://via.placeholder.com/150x50" alt="Logo" />
                  </a>
                </div>
              </div>
              <div className="col-xl-8 col-lg-8 d-none d-lg-block">
                <nav className="main-navigation">
                  <ul className="main-menu d-flex justify-content-center">
                    <li><a href="#" className="active">홈</a></li>
                    <li><a href="#">소개</a></li>
                    <li><a href="#">서비스</a></li>
                    <li><a href="#">포트폴리오</a></li>
                    <li><a href="#">블로그</a></li>
                    <li><a href="#">연락처</a></li>
                  </ul>
                </nav>
              </div>
              <div className="col-xl-2 col-lg-2 col-md-6 col-8">
                <div className="header-action d-flex justify-content-end">
                  <div className="search-header">
                    <button className="btn-search"><i className="fa fa-search"></i></button>
                  </div>
                  <div className="user-header">
                    <a href="#"><i className="fa fa-user"></i></a>
                  </div>
                  <div className="cart-header">
                    <a href="#"><i className="fa fa-shopping-cart"></i> <span className="badge">3</span></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content-wrapper" style={{
        padding: '0',
        backgroundColor: 'transparent'
      }}>
        <div className={headerContainerClass}>
          {children}
        </div>
      </main>

      <footer className="footer-area bg-gray pt-100 pb-70">
        <div className={headerContainerClass === "container-fluid" ? "container" : headerContainerClass}>
          <div className="row">
            <div className="col-lg-3 col-sm-6">
              <div className="footer-widget mb-30">
                <div className="footer-logo mb-3">
                  <a href="#">
                    <img src="https://via.placeholder.com/150x50" alt="Footer Logo" />
                  </a>
                </div>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <div className="footer-social">
                  <ul className="d-flex">
                    <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                    <li><a href="#"><i className="fab fa-twitter"></i></a></li>
                    <li><a href="#"><i className="fab fa-instagram"></i></a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="footer-widget mb-30">
                <h3>회사 소개</h3>
                <ul className="footer-list">
                  <li><a href="#">소개</a></li>
                  <li><a href="#">서비스</a></li>
                  <li><a href="#">팀</a></li>
                  <li><a href="#">연락처</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="footer-widget mb-30">
                <h3>고객 지원</h3>
                <ul className="footer-list">
                  <li><a href="#">자주 묻는 질문</a></li>
                  <li><a href="#">배송 정보</a></li>
                  <li><a href="#">반품 정책</a></li>
                  <li><a href="#">이용약관</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="footer-widget mb-30">
                <h3>뉴스레터 구독</h3>
                <p>최신 정보와 프로모션을 받아보세요</p>
                <div className="newsletter-form">
                  <form className="d-flex">
                    <input type="email" placeholder="이메일 주소" className="form-control" />
                    <button type="submit" className="btn btn-primary">구독</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="copyright-area">
        <div className={headerContainerClass === "container-fluid" ? "container" : headerContainerClass}>
          <div className="row">
            <div className="col-12 text-center">
              <p>© 2023 템플릿 레이아웃. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TemplateOne.propTypes = {
  children: PropTypes.node,
  headerContainerClass: PropTypes.string,
  headerTop: PropTypes.string,
  headerPaddingClass: PropTypes.string,
  headerPositionClass: PropTypes.string
};

export default TemplateOne; 