import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";
import IconGroup from "../../components/header/IconGroup";
import MobileMenu from "../../components/header/MobileMenu";
import OffcanvasMenu from "../../components/header/OffcanvasMenu";
import Logo from "../../components/header/Logo";

const HeaderSix = ({ layout, headerPaddingClass, headerBgClass }) => {
  const [scroll, setScroll] = useState(0);
  const [headerTop, setHeaderTop] = useState(0);
  const [offcanvasActive, setOffcanvasActive] = useState(false);

  useEffect(() => {
    const header = document.querySelector(".sticky-bar");
    setHeaderTop(header.offsetTop);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    setScroll(window.scrollY);
  };

  const getActiveState = state => {
    setOffcanvasActive(state);
  };

  return (
    <header
      className={clsx(
        "header-area sticky-bar header-padding-3 header-res-padding clearfix transparent-bar header-hm-7", 
        headerBgClass, 
        headerPaddingClass, 
        scroll > headerTop && "stick"
      )}
    >
      <div className={layout === "container-fluid" ? layout : "container"}>
        <div className="row">
          <div className="col-xl-5 col-lg-6 d-none d-lg-block">
            <div className="clickable-menu clickable-mainmenu-active">
              <button
                onClick={() => {
                  setOffcanvasActive(true);
                }}
              >
                <i className="pe-7s-menu" />
              </button>
            </div>
          </div>
          <div className="col-xl-2 col-lg-2 col-md-6 col-6">
            {/* header logo */}
            <Logo imageUrl="/layouts/layout01/assets/img/logo/logo.png" logoClass="logo" />
          </div>
          <div className="col-xl-5 col-lg-4 col-md-6 col-6">
            {/* Icon group */}
            <IconGroup iconWhiteClass="header-right-wrap-white" />
          </div>
        </div>
      </div>
      {/* offcanvas menu */}
      <OffcanvasMenu
        activeState={offcanvasActive}
        getActiveState={getActiveState}
      />
      {/* mobile menu */}
      <MobileMenu />
    </header>
  );
};

HeaderSix.propTypes = {
  headerBgClass: PropTypes.string,
  headerPaddingClass: PropTypes.string,
  layout: PropTypes.string
};

export default HeaderSix;
