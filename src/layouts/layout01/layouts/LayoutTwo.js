import React from 'react';
import PropTypes from 'prop-types';
import '../assets/scss/style.scss';  // 레이아웃 스타일 import
import HeaderTwo from '../wrappers/header/HeaderTwo';
import FooterTwo from '../wrappers/footer/FooterTwo';
import ScrollToTop from '../components/scroll-to-top';

const LayoutTwo = ({ children, headerContainerClass, headerTop, headerPaddingClass, headerPositionClass }) => {
  return (
    <div className="layout-two">
      <HeaderTwo
        layout={headerContainerClass}
        top={headerTop}
        headerPaddingClass={headerPaddingClass}
        headerPositionClass={headerPositionClass}
      />
      <main>
        {children}
      </main>
      <FooterTwo
        backgroundColorClass="bg-gray"
        spaceTopClass="pt-100"
        spaceBottomClass="pb-70"
      />
      <ScrollToTop />
    </div>
  );
};

LayoutTwo.propTypes = {
  children: PropTypes.node,
  headerContainerClass: PropTypes.string,
  headerTop: PropTypes.string,
  headerPaddingClass: PropTypes.string,
  headerPositionClass: PropTypes.string
};

export default LayoutTwo;
