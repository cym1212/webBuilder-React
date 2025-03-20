import React from "react";
import { Link } from "react-router-dom";

const FooterTwo = ({
  backgroundColorClass,
  spaceTopClass,
  spaceBottomClass
}) => {
  return (
    <footer className={`footer-area ${backgroundColorClass ? backgroundColorClass : ""} ${spaceTopClass ? spaceTopClass : ""} ${spaceBottomClass ? spaceBottomClass : ""}`}>
      <div className="container">
        <div className="footer-top text-center pt-100 pb-80">
          <div className="row">
            <div className="col-lg-12">
              <div className="footer-logo">
                <Link to="/">
                  <img src="/assets/img/logo/logo.png" alt="로고" />
                </Link>
              </div>
              <p className="footer-description">
                웹 빌더는 최고의 웹사이트 제작 도구입니다.<br />
                쉽고 빠르게 전문적인 웹사이트를 만들어보세요.
              </p>
              <div className="footer-social">
                <ul>
                  <li>
                    <a href="//facebook.com" target="_blank" rel="noopener noreferrer">
                      <i className="fa fa-facebook" />
                    </a>
                  </li>
                  <li>
                    <a href="//twitter.com" target="_blank" rel="noopener noreferrer">
                      <i className="fa fa-twitter" />
                    </a>
                  </li>
                  <li>
                    <a href="//instagram.com" target="_blank" rel="noopener noreferrer">
                      <i className="fa fa-instagram" />
                    </a>
                  </li>
                  <li>
                    <a href="//youtube.com" target="_blank" rel="noopener noreferrer">
                      <i className="fa fa-youtube" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom pb-70">
          <div className="row">
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="footer-widget mb-30">
                <div className="footer-title">
                  <h3>회사 정보</h3>
                </div>
                <div className="footer-list">
                  <ul>
                    <li>
                      <Link to="/about">회사 소개</Link>
                    </li>
                    <li>
                      <Link to="/contact">연락처</Link>
                    </li>
                    <li>
                      <Link to="/service">서비스</Link>
                    </li>
                    <li>
                      <Link to="/privacy-policy">개인정보처리방침</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="footer-widget mb-30">
                <div className="footer-title">
                  <h3>고객센터</h3>
                </div>
                <div className="footer-list">
                  <ul>
                    <li>
                      <Link to="/faq">자주 묻는 질문</Link>
                    </li>
                    <li>
                      <Link to="/terms">이용약관</Link>
                    </li>
                    <li>
                      <Link to="/shipping">배송 정보</Link>
                    </li>
                    <li>
                      <Link to="/return-policy">환불 정책</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="footer-widget mb-30">
                <div className="footer-title">
                  <h3>뉴스레터</h3>
                </div>
                <div className="subscribe-style">
                  <p>새로운 소식을 이메일로 받아보세요!</p>
                  <div id="mc_embed_signup" className="subscribe-form">
                    <form>
                      <div id="mc_embed_signup_scroll" className="mc-form">
                        <input
                          className="email"
                          type="email"
                          placeholder="이메일 주소를 입력하세요..."
                          name="EMAIL"
                        />
                        <div className="clear">
                          <button className="button">구독하기</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom text-center">
        <div className="container">
          <div className="copyright-text">
            <p>
              © 2024 <strong>웹 빌더</strong>. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterTwo;
