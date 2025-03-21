import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";
import FooterCopyright from "../../components/footer/FooterCopyright";
import FooterNewsletter from "../../components/footer/FooterNewsletter";
import logoImg from "../../assets/img/logo/logo.png";


const FooterOne = ({
  backgroundColorClass,
  spaceTopClass,
  spaceBottomClass,
  spaceLeftClass,
  spaceRightClass,
  containerClass,
  extraFooterClass,
  sideMenu,
  footerLogo,
  backgroundImage
}) => {
  return (
    <footer className={`footer-area ${backgroundColorClass ? backgroundColorClass : ""} ${spaceTopClass ? spaceTopClass : ""} ${spaceBottomClass ? spaceBottomClass : ""}`}>
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-12">
            <div className="footer-widget mb-30">
              <div className="footer-logo">
                <Link to="/">
                  <img src={logoImg} alt="로고" />
                </Link>
              </div>
              <div className="footer-about">
                <p>
                  웹 빌더는 최고의 웹사이트 제작 도구입니다.
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
          <div className="col-lg-3 col-md-6 col-sm-12">
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
          <div className="col-lg-3 col-md-6 col-sm-12">
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
          <div className="col-lg-3 col-md-6 col-sm-12">
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

FooterOne.propTypes = {
  backgroundColorClass: PropTypes.string,
  containerClass: PropTypes.string,
  extraFooterClass: PropTypes.string,
  sideMenu: PropTypes.bool,
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string,
  spaceLeftClass: PropTypes.string,
  spaceRightClass: PropTypes.string,
  footerLogo: PropTypes.string,
  backgroundImage: PropTypes.string
};

export default FooterOne;
