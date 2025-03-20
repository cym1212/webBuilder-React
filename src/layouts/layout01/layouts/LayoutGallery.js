import PropTypes from "prop-types";
import React, { Fragment } from "react";
import HeaderTwo from "../wrappers/header/HeaderTwo";
import FooterTwo from "../wrappers/footer/FooterTwo";
import ScrollToTop from "../components/scroll-to-top";

const LayoutGallery = ({
  children,
  headerContainerClass,
  headerTop,
  headerPaddingClass,
  galleryType,
  columns = 3,
  showFilter = true,
  darkMode = false
}) => {
  return (
    <Fragment>
      <HeaderTwo
        layout={headerContainerClass}
        top={headerTop}
        headerPaddingClass={headerPaddingClass}
      />
      <div className={`gallery-layout gallery-type-${galleryType || "default"} ${darkMode ? "dark-mode" : ""}`}>
        <div className="container">
          {showFilter && (
            <div className="gallery-filter-wrapper">
              <div className="row">
                <div className="col-12">
                  <div className="gallery-filter">
                    <ul>
                      <li className="active"><button>전체</button></li>
                      <li><button>사진</button></li>
                      <li><button>일러스트</button></li>
                      <li><button>디자인</button></li>
                      <li><button>작품</button></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="gallery-content">
            <div className={`row gallery-columns-${columns}`}>
              {children}
            </div>
          </div>
          
          <div className="gallery-pagination">
            <ul>
              <li><button>이전</button></li>
              <li className="active"><button>1</button></li>
              <li><button>2</button></li>
              <li><button>3</button></li>
              <li><button>다음</button></li>
            </ul>
          </div>
        </div>
      </div>
      <FooterTwo
        backgroundColorClass={darkMode ? "footer-dark" : "footer-white"}
        spaceLeftClass="ml-70"
        spaceRightClass="mr-70"
        footerTopSpaceTopClass="pt-80"
        footerTopSpaceBottomClass="pb-60"
        footerLogo="/assets/img/logo/logo.png"
      />
      <ScrollToTop />
    </Fragment>
  );
};

LayoutGallery.propTypes = {
  children: PropTypes.node,
  headerContainerClass: PropTypes.string,
  headerTop: PropTypes.string,
  headerPaddingClass: PropTypes.string,
  galleryType: PropTypes.string,
  columns: PropTypes.number,
  showFilter: PropTypes.bool,
  darkMode: PropTypes.bool
};

export default LayoutGallery; 