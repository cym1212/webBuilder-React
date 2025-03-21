import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";
// 로고 이미지 직접 import
import logoImg from "../../assets/img/logo/logo.png";
import logoImg2 from "../../assets/img/logo/logo-2.png";

const FooterCopyright = ({ footerLogo, spaceBottomClass, colorClass }) => {
  // 이미지 URL에 따라 적절한 로고 선택
  const getLogoSrc = () => {
    if (footerLogo && footerLogo.includes("logo-2.png")) {
      return logoImg2;
    }
    return logoImg;
  };

  return (
    <div className={clsx("copyright", spaceBottomClass, colorClass)}>
      <div className="footer-logo">
        <Link to={process.env.PUBLIC_URL + "/"}>
          <img alt="" src={getLogoSrc()} />
        </Link>
      </div>
      <p>
        &copy; {new Date().getFullYear()}{" "}
        <a
          href="https://hasthemes.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          Flone
        </a>
        .<br /> All Rights Reserved
      </p>
    </div>
  );
};

FooterCopyright.propTypes = {
  footerLogo: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  colorClass: PropTypes.string
};

export default FooterCopyright;
