import React from 'react';
import PropTypes from 'prop-types';
import '../assets/scss/style.scss';  // 레이아웃 스타일 import
import HeaderOne from '../wrappers/header/HeaderOne';
import FooterOne from '../wrappers/footer/FooterOne';
import ScrollToTop from '../components/scroll-to-top';

const LayoutOne = ({ children, headerContainerClass, headerTop, headerPaddingClass, headerPositionClass }) => {
  return (
    <div className="layout-one" style={{ backgroundColor: '#ffffff' }}>
      <HeaderOne
        layout={headerContainerClass}
        top={headerTop}
        headerPaddingClass={headerPaddingClass}
        headerPositionClass={headerPositionClass}
      />
      <main style={{ paddingLeft: '5%', paddingRight: '5%' }}>
        {children}
      </main>
      <FooterOne
        backgroundColorClass="bg-gray"
        spaceTopClass="pt-100"
        spaceBottomClass="pb-70"
      />
      <ScrollToTop />
    </div>
  );
};

LayoutOne.propTypes = {
  children: PropTypes.node,
  headerContainerClass: PropTypes.string,
  headerTop: PropTypes.string,
  headerPaddingClass: PropTypes.string,
  headerPositionClass: PropTypes.string
};

export default LayoutOne;
