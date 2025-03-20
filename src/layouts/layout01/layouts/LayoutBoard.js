import PropTypes from "prop-types";
import React, { Fragment } from "react";
import HeaderOne from "../wrappers/header/HeaderOne";
import FooterOne from "../wrappers/footer/FooterOne";
import ScrollToTop from "../components/scroll-to-top";

const LayoutBoard = ({
  children,
  headerContainerClass,
  headerTop,
  headerPaddingClass,
  headerPositionClass,
  boardType,
  showSidebar = true,
  sidebarPosition = "right"
}) => {
  return (
    <Fragment>
      <HeaderOne
        layout={headerContainerClass}
        top={headerTop}
        headerPaddingClass={headerPaddingClass}
        headerPositionClass={headerPositionClass}
      />
      <div className={`board-layout board-type-${boardType || "default"}`}>
        <div className="container">
          <div className="row">
            {showSidebar && sidebarPosition === "left" && (
              <div className="col-lg-3">
                <div className="board-sidebar">
                  {/* 게시판 사이드바 영역 */}
                  <div className="board-categories">
                    <h3>카테고리</h3>
                    <ul>
                      <li>공지사항</li>
                      <li>자유게시판</li>
                      <li>Q&A</li>
                      <li>자료실</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            <div className={`${showSidebar ? "col-lg-9" : "col-lg-12"}`}>
              <div className="board-main-content">
                {children}
              </div>
            </div>
            
            {showSidebar && sidebarPosition === "right" && (
              <div className="col-lg-3">
                <div className="board-sidebar">
                  {/* 게시판 사이드바 영역 */}
                  <div className="board-categories">
                    <h3>카테고리</h3>
                    <ul>
                      <li>공지사항</li>
                      <li>자유게시판</li>
                      <li>Q&A</li>
                      <li>자료실</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <FooterOne
        backgroundColorClass="bg-gray"
        spaceTopClass="pt-100"
        spaceBottomClass="pb-70"
      />
      <ScrollToTop />
    </Fragment>
  );
};

LayoutBoard.propTypes = {
  children: PropTypes.node,
  headerContainerClass: PropTypes.string,
  headerTop: PropTypes.string,
  headerPaddingClass: PropTypes.string,
  headerPositionClass: PropTypes.string,
  boardType: PropTypes.string,
  showSidebar: PropTypes.bool,
  sidebarPosition: PropTypes.string
};

export default LayoutBoard; 