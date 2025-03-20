import React from "react";
import PropTypes from "prop-types";
import LayoutBoard from "../layouts/LayoutBoard";
import LayoutGallery from "../layouts/LayoutGallery";
import LayoutBlog from "../layouts/LayoutBlog";
import LayoutOne from "../layouts/LayoutOne";

const LayoutSelector = ({ layoutType, layoutParams, children }) => {
  // 기본 헤더 파라미터
  const defaultHeaderParams = {
    headerContainerClass: "container-fluid",
    headerTop: "visible",
    headerPaddingClass: "header-padding-1"
  };

  // 레이아웃 타입에 따라 다른 레이아웃 컴포넌트 반환
  switch (layoutType) {
    case "board":
      return (
        <LayoutBoard
          {...defaultHeaderParams}
          boardType={layoutParams?.boardType || "default"}
          showSidebar={layoutParams?.showSidebar !== undefined ? layoutParams.showSidebar : true}
          sidebarPosition={layoutParams?.sidebarPosition || "right"}
        >
          {children}
        </LayoutBoard>
      );
    
    case "gallery":
      return (
        <LayoutGallery
          {...defaultHeaderParams}
          galleryType={layoutParams?.galleryType || "default"}
          columns={layoutParams?.columns || 3}
          showFilter={layoutParams?.showFilter !== undefined ? layoutParams.showFilter : true}
          darkMode={layoutParams?.darkMode || false}
        >
          {children}
        </LayoutGallery>
      );
    
    case "blog":
      return (
        <LayoutBlog
          {...defaultHeaderParams}
          blogType={layoutParams?.blogType || "default"}
          sidebarPosition={layoutParams?.sidebarPosition || "right"}
          showSidebar={layoutParams?.showSidebar !== undefined ? layoutParams.showSidebar : true}
          showFeatured={layoutParams?.showFeatured !== undefined ? layoutParams.showFeatured : true}
        >
          {children}
        </LayoutBlog>
      );
    
    default:
      // 기본 레이아웃
      return (
        <LayoutOne
          {...defaultHeaderParams}
          headerPositionClass={layoutParams?.headerPositionClass || ""}
        >
          {children}
        </LayoutOne>
      );
  }
};

LayoutSelector.propTypes = {
  layoutType: PropTypes.string,
  layoutParams: PropTypes.object,
  children: PropTypes.node
};

export default LayoutSelector; 