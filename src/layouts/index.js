import React from 'react';
import BoardLayout from './BoardLayout';
import BlogLayout from './BlogLayout';
import GalleryLayout from './GalleryLayout';
import TemplateOne from './TemplateOne';
import TemplateBlog from './TemplateBlog';
import TemplateBoard from './TemplateBoard';

// 간단한 대체 레이아웃 컴포넌트들
const SimpleLayoutOne = ({ children, ...props }) => (
  <div className="simple-layout-one">
    <div className="simple-header" style={{ padding: '15px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
      <h2>기본 헤더</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button className="btn btn-sm btn-outline-secondary">메뉴 1</button>
        <button className="btn btn-sm btn-outline-secondary">메뉴 2</button>
        <button className="btn btn-sm btn-outline-secondary">메뉴 3</button>
      </div>
    </div>
    <div className="simple-content" style={{ padding: '20px' }}>
      {children}
    </div>
    <div className="simple-footer" style={{ padding: '15px', backgroundColor: '#f8f9fa', borderTop: '1px solid #dee2e6' }}>
      <p>© 기본 푸터</p>
    </div>
  </div>
);

const SimpleBlogLayout = ({ children, showSidebar, sidebarPosition, ...props }) => (
  <div className="simple-blog-layout">
    <div className="simple-header" style={{ padding: '15px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
      <h2>블로그 헤더</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button className="btn btn-sm btn-outline-secondary">홈</button>
        <button className="btn btn-sm btn-outline-secondary">카테고리</button>
        <button className="btn btn-sm btn-outline-secondary">태그</button>
      </div>
    </div>
    <div className="blog-content" style={{ display: 'flex', padding: '20px' }}>
      {showSidebar && sidebarPosition === 'left' && (
        <div className="blog-sidebar" style={{ width: '30%', padding: '15px', backgroundColor: '#f8f9fa' }}>
          <h4>블로그 사이드바</h4>
          <ul className="list-unstyled">
            <li>카테고리 1</li>
            <li>카테고리 2</li>
            <li>카테고리 3</li>
          </ul>
        </div>
      )}
      <div className="blog-main" style={{ flex: 1, padding: '15px' }}>
        {children}
      </div>
      {showSidebar && sidebarPosition === 'right' && (
        <div className="blog-sidebar" style={{ width: '30%', padding: '15px', backgroundColor: '#f8f9fa' }}>
          <h4>블로그 사이드바</h4>
          <ul className="list-unstyled">
            <li>카테고리 1</li>
            <li>카테고리 2</li>
            <li>카테고리 3</li>
          </ul>
        </div>
      )}
    </div>
    <div className="simple-footer" style={{ padding: '15px', backgroundColor: '#f8f9fa', borderTop: '1px solid #dee2e6' }}>
      <p>© 블로그 푸터</p>
    </div>
  </div>
);

// 레이아웃 템플릿 코드 안전하게 불러오기
let LayoutOne, LayoutTwo, LayoutThree, LayoutBlog, LayoutBoard, LayoutGallery;

try {
  // 레이아웃 템플릿 코드 불러오기 시도
  LayoutOne = React.lazy(() => import('../layout-template-code/src/layouts/LayoutOne'));
  LayoutTwo = React.lazy(() => import('../layout-template-code/src/layouts/LayoutTwo'));
  LayoutThree = React.lazy(() => import('../layout-template-code/src/layouts/LayoutThree'));
  LayoutBlog = React.lazy(() => import('../layout-template-code/src/layouts/LayoutBlog'));
  LayoutBoard = React.lazy(() => import('../layout-template-code/src/layouts/LayoutBoard'));
  LayoutGallery = React.lazy(() => import('../layout-template-code/src/layouts/LayoutGallery'));
} catch (error) {
  console.error("템플릿 레이아웃 로드 실패:", error);
  // 대체 레이아웃 컴포넌트 사용
  LayoutOne = SimpleLayoutOne;
  LayoutTwo = SimpleLayoutOne;
  LayoutThree = SimpleLayoutOne;
  LayoutBlog = SimpleBlogLayout;
  LayoutBoard = SimpleBlogLayout;
  LayoutGallery = SimpleLayoutOne;
}

// 레이아웃 옵션 정보
export const layoutOptions = [
  {
    id: 'modern',
    name: '모던 레이아웃',
    description: '세련된 모던 스타일의 헤더와 푸터가 있는 레이아웃입니다.',
    component: BoardLayout,
    options: [
      { name: 'headerStyle', type: 'select', label: '헤더 스타일', options: ['basic', 'fixed', 'transparent'], default: 'basic' },
      { name: 'footerStyle', type: 'select', label: '푸터 스타일', options: ['basic', 'compact', 'extended'], default: 'basic' },
      { name: 'showSidebar', type: 'boolean', label: '사이드바 표시', default: true },
      { name: 'sidebarPosition', type: 'select', label: '사이드바 위치', options: ['left', 'right'], default: 'left' },
      { name: 'colorTheme', type: 'select', label: '색상 테마', options: ['light', 'dark', 'colorful'], default: 'light' }
    ],
    defaultProps: {
      headerStyle: 'basic',
      footerStyle: 'basic',
      showSidebar: true,
      sidebarPosition: 'left',
      colorTheme: 'light'
    },
    previewImage: 'https://via.placeholder.com/300x200?text=Modern+Layout'
  },
  {
    id: 'corporate',
    name: '기업형 레이아웃',
    description: '기업 웹사이트에 적합한 전문적인 레이아웃입니다.',
    component: BlogLayout,
    options: [
      { name: 'headerStyle', type: 'select', label: '헤더 스타일', options: ['mega-menu', 'minimal', 'centered'], default: 'mega-menu' },
      { name: 'footerStyle', type: 'select', label: '푸터 스타일', options: ['multi-column', 'simple', 'contact-focused'], default: 'multi-column' },
      { name: 'showHero', type: 'boolean', label: '히어로 영역 표시', default: true },
      { name: 'showBreadcrumbs', type: 'boolean', label: '경로 표시', default: true },
      { name: 'colorTheme', type: 'select', label: '색상 테마', options: ['professional', 'bold', 'subtle'], default: 'professional' }
    ],
    defaultProps: {
      headerStyle: 'mega-menu',
      footerStyle: 'multi-column',
      showHero: true,
      showBreadcrumbs: true,
      colorTheme: 'professional'
    },
    previewImage: 'https://via.placeholder.com/300x200?text=Corporate+Layout'
  },
  {
    id: 'ecommerce',
    name: '쇼핑몰 레이아웃',
    description: '온라인 쇼핑몰에 최적화된 레이아웃입니다.',
    component: GalleryLayout,
    options: [
      { name: 'headerStyle', type: 'select', label: '헤더 스타일', options: ['shop', 'marketplace', 'simple'], default: 'shop' },
      { name: 'footerStyle', type: 'select', label: '푸터 스타일', options: ['shop', 'detailed', 'minimal'], default: 'shop' },
      { name: 'showCategories', type: 'boolean', label: '카테고리 메뉴 표시', default: true },
      { name: 'showCart', type: 'boolean', label: '카트 아이콘 표시', default: true },
      { name: 'productColumns', type: 'number', label: '상품 열 수', default: 4, min: 2, max: 6 }
    ],
    defaultProps: {
      headerStyle: 'shop',
      footerStyle: 'shop',
      showCategories: true,
      showCart: true,
      productColumns: 4
    },
    previewImage: 'https://via.placeholder.com/300x200?text=Ecommerce+Layout'
  },
  {
    id: 'creative',
    name: '크리에이티브 레이아웃',
    description: '포트폴리오, 창의적인 프로젝트에 적합한 레이아웃입니다.',
    component: GalleryLayout,
    options: [
      { name: 'headerStyle', type: 'select', label: '헤더 스타일', options: ['artistic', 'minimal', 'interactive'], default: 'artistic' },
      { name: 'footerStyle', type: 'select', label: '푸터 스타일', options: ['creative', 'social', 'simple'], default: 'creative' },
      { name: 'showSocial', type: 'boolean', label: '소셜 미디어 링크 표시', default: true },
      { name: 'animation', type: 'select', label: '애니메이션 효과', options: ['fade', 'slide', 'zoom', 'none'], default: 'fade' },
      { name: 'colorTheme', type: 'select', label: '색상 테마', options: ['vibrant', 'monochrome', 'pastel'], default: 'vibrant' }
    ],
    defaultProps: {
      headerStyle: 'artistic',
      footerStyle: 'creative',
      showSocial: true,
      animation: 'fade',
      colorTheme: 'vibrant'
    },
    previewImage: 'https://via.placeholder.com/300x200?text=Creative+Layout'
  },
  {
    id: 'board',
    name: '게시판 레이아웃',
    description: '게시판, 커뮤니티 사이트에 적합한 레이아웃입니다.',
    component: BoardLayout,
    options: [
      { name: 'headerStyle', type: 'select', label: '헤더 스타일', options: ['community', 'forum', 'simple'], default: 'community' },
      { name: 'footerStyle', type: 'select', label: '푸터 스타일', options: ['community', 'simple', 'detailed'], default: 'community' },
      { name: 'showSidebar', type: 'boolean', label: '사이드바 표시', default: true },
      { name: 'sidebarPosition', type: 'select', label: '사이드바 위치', options: ['left', 'right'], default: 'right' }
    ],
    defaultProps: {
      headerStyle: 'community',
      footerStyle: 'community',
      showSidebar: true,
      sidebarPosition: 'right'
    },
    previewImage: 'https://via.placeholder.com/300x200?text=Board+Layout'
  },
  {
    id: 'blog',
    name: '블로그 레이아웃',
    description: '블로그, 뉴스 사이트에 적합한 레이아웃입니다.',
    component: BlogLayout,
    options: [
      { name: 'headerStyle', type: 'select', label: '헤더 스타일', options: ['magazine', 'personal', 'minimal'], default: 'magazine' },
      { name: 'footerStyle', type: 'select', label: '푸터 스타일', options: ['standard', 'author', 'subscription'], default: 'standard' },
      { name: 'showSidebar', type: 'boolean', label: '사이드바 표시', default: true },
      { name: 'sidebarPosition', type: 'select', label: '사이드바 위치', options: ['left', 'right'], default: 'right' },
      { name: 'showFeatured', type: 'boolean', label: '추천 포스트 표시', default: true }
    ],
    defaultProps: {
      headerStyle: 'magazine',
      footerStyle: 'standard',
      showSidebar: true,
      sidebarPosition: 'right',
      showFeatured: true
    },
    previewImage: 'https://via.placeholder.com/300x200?text=Blog+Layout'
  },
  {
    id: 'gallery',
    name: '갤러리 레이아웃',
    description: '포트폴리오, 이미지 갤러리에 적합한 레이아웃입니다.',
    component: GalleryLayout,
    options: [
      { name: 'headerStyle', type: 'select', label: '헤더 스타일', options: ['gallery', 'portfolio', 'minimal'], default: 'gallery' },
      { name: 'footerStyle', type: 'select', label: '푸터 스타일', options: ['gallery', 'copyright', 'contact'], default: 'gallery' },
      { name: 'columns', type: 'number', label: '열 수', default: 3, min: 1, max: 4 },
      { name: 'showFilter', type: 'boolean', label: '필터 표시', default: true },
      { name: 'darkMode', type: 'boolean', label: '다크 모드', default: false }
    ],
    defaultProps: {
      headerStyle: 'gallery',
      footerStyle: 'gallery',
      columns: 3,
      showFilter: true,
      darkMode: false
    },
    previewImage: 'https://via.placeholder.com/300x200?text=Gallery+Layout'
  },
  // 템플릿 레이아웃 추가
  {
    id: 'template-one',
    name: '템플릿 레이아웃 1',
    description: '깔끔하고 심플한 페이지 레이아웃입니다.',
    component: TemplateOne,
    options: [
      { name: 'headerContainerClass', type: 'select', label: '헤더 컨테이너 타입', options: ['container', 'container-fluid'], default: 'container' },
      { name: 'headerTop', type: 'select', label: '상단 헤더 표시', options: ['visible', 'hidden'], default: 'visible' },
      { name: 'headerPaddingClass', type: 'select', label: '헤더 패딩', options: ['header-padding-1', 'header-padding-2'], default: 'header-padding-1' },
      { name: 'headerPositionClass', type: 'select', label: '헤더 위치', options: ['header-position', 'header-static'], default: 'header-position' }
    ],
    defaultProps: {
      headerContainerClass: 'container',
      headerTop: 'visible',
      headerPaddingClass: 'header-padding-1',
      headerPositionClass: 'header-position'
    },
    previewImage: 'https://via.placeholder.com/300x200?text=Template+Layout+One'
  },
  {
    id: 'template-blog',
    name: '템플릿 블로그 레이아웃',
    description: '전문적인 블로그 디자인 레이아웃입니다.',
    component: TemplateBlog,
    options: [
      { name: 'headerContainerClass', type: 'select', label: '헤더 컨테이너 타입', options: ['container', 'container-fluid'], default: 'container' },
      { name: 'headerTop', type: 'select', label: '상단 헤더 표시', options: ['visible', 'hidden'], default: 'visible' },
      { name: 'headerPaddingClass', type: 'select', label: '헤더 패딩', options: ['header-padding-1', 'header-padding-2'], default: 'header-padding-1' },
      { name: 'blogType', type: 'select', label: '블로그 타입', options: ['standard', 'grid', 'list'], default: 'standard' },
      { name: 'showSidebar', type: 'boolean', label: '사이드바 표시', default: true },
      { name: 'sidebarPosition', type: 'select', label: '사이드바 위치', options: ['left', 'right'], default: 'right' },
      { name: 'showFeatured', type: 'boolean', label: '추천 포스트 표시', default: true }
    ],
    defaultProps: {
      headerContainerClass: 'container',
      headerTop: 'visible',
      headerPaddingClass: 'header-padding-1',
      blogType: 'standard',
      showSidebar: true,
      sidebarPosition: 'right',
      showFeatured: true
    },
    previewImage: 'https://via.placeholder.com/300x200?text=Template+Blog+Layout'
  },
  {
    id: 'template-board',
    name: '템플릿 게시판 레이아웃',
    description: '커뮤니티 및 게시판에 최적화된 템플릿 레이아웃입니다.',
    component: TemplateBoard,
    options: [
      { name: 'headerContainerClass', type: 'select', label: '헤더 컨테이너 타입', options: ['container', 'container-fluid'], default: 'container' },
      { name: 'headerTop', type: 'select', label: '상단 헤더 표시', options: ['visible', 'hidden'], default: 'visible' },
      { name: 'headerPaddingClass', type: 'select', label: '헤더 패딩', options: ['header-padding-1', 'header-padding-2'], default: 'header-padding-1' },
      { name: 'boardType', type: 'select', label: '게시판 타입', options: ['default', 'community', 'qna'], default: 'default' },
      { name: 'showSidebar', type: 'boolean', label: '사이드바 표시', default: true },
      { name: 'sidebarPosition', type: 'select', label: '사이드바 위치', options: ['left', 'right'], default: 'right' }
    ],
    defaultProps: {
      headerContainerClass: 'container',
      headerTop: 'visible',
      headerPaddingClass: 'header-padding-1',
      boardType: 'default',
      showSidebar: true,
      sidebarPosition: 'right'
    },
    previewImage: 'https://via.placeholder.com/300x200?text=Template+Board+Layout'
  }
];

// 레이아웃 ID로 컴포넌트 가져오기
export const getLayoutComponentById = (id) => {
  const layout = layoutOptions.find(option => option.id === id);
  return layout ? layout.component : null;
};

// 레이아웃 ID로 기본 속성 가져오기
export const getLayoutDefaultPropsById = (id) => {
  const layout = layoutOptions.find(option => option.id === id);
  return layout ? layout.defaultProps : {};
};

export {
  BoardLayout,
  BlogLayout,
  GalleryLayout,
  // 템플릿 레이아웃 내보내기
  TemplateOne,
  TemplateBlog,
  TemplateBoard
}; 