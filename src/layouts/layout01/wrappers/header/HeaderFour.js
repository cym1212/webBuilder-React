import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import IconGroup from "../../components/header/IconGroup";
import MobileMenu from "../../components/header/MobileMenu";
import Logo from "../../components/header/Logo";

const HeaderFour = () => {
  const handleScroll = () => {
    const ele = document.querySelector(".sticky-header");
    if (window.scrollY > 150) {
      ele.classList.add("stick");
    } else {
      ele.classList.remove("stick");
    }
  }

  window.addEventListener("scroll", handleScroll);

  const triggerMobileMenu = () => {
    const offcanvasMobileMenu = document.querySelector(
      "#offcanvas-mobile-menu"
    );
    offcanvasMobileMenu.classList.add("active");
  };

  return (
    <header className="header-area sticky-bar header-padding-3 sticky-white-bg">
      <div className="container-fluid">
        <div className="header-top-wrapper border-bottom">
          <div className="row">
            <div className="col-12">
              <div className="header-top-info">
                <div className="logo-small-device">
                  <div className="logo-mobile-menu text-center">
                    <Link to={process.env.PUBLIC_URL + "/"}>
                      <Logo imageUrl="/layouts/layout01/assets/img/logo/logo.png" logoClass="logo" />
                    </Link>
                  </div>
                </div>
                <div className="header-right-wrap">
                  <IconGroup />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-6 col-md-6 col-xl-3 col-lg-3">
            <div className="header-logo header-sticky-logo">
              <Link className="non-sticky-block" to={process.env.PUBLIC_URL + "/"}>
                <Logo imageUrl="/layouts/layout01/assets/img/logo/logo.png" logoClass="logo" />
              </Link>
              <Link className="sticky-block" to={process.env.PUBLIC_URL + "/"}>
                <Logo imageUrl="/layouts/layout01/assets/img/logo/logo.png" logoClass="logo" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <MobileMenu />
    </header>
  );
};

export default HeaderFour;
