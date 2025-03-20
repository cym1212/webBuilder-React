import LayoutOne from './layout01/layouts/LayoutOne';
import LayoutTwo from './layout01/layouts/LayoutTwo';
import LayoutThree from './layout01/layouts/LayoutThree';
import LayoutFour from './layout01/layouts/LayoutFour';
import LayoutFive from './layout01/layouts/LayoutFive';
import LayoutSix from './layout01/layouts/LayoutSix';
import LayoutSeven from './layout01/layouts/LayoutSeven';
import LayoutEight from './layout01/layouts/LayoutEight';
import LayoutNine from './layout01/layouts/LayoutNine';
import LayoutTen from './layout01/layouts/LayoutTen';
import LayoutBoard from './layout01/layouts/LayoutBoard';
import LayoutGallery from './layout01/layouts/LayoutGallery';
import LayoutBlog from './layout01/layouts/LayoutBlog';

// 기본 레이아웃 옵션
const defaultLayoutOptions = [
  {
    name: 'headerPosition',
    label: '헤더 위치',
    type: 'select',
    options: ['top', 'fixed'],
    default: 'top'
  },
  {
    name: 'showSidebar',
    label: '사이드바 표시',
    type: 'boolean',
    default: false
  },
  {
    name: 'sidebarPosition',
    label: '사이드바 위치',
    type: 'select',
    options: ['left', 'right'],
    default: 'right'
  }
];

// 게시판 레이아웃 옵션
const boardLayoutOptions = [
  ...defaultLayoutOptions,
  {
    name: 'boardType',
    label: '게시판 타입',
    type: 'select',
    options: ['default', 'gallery', 'list'],
    default: 'default'
  }
];

// 갤러리 레이아웃 옵션
const galleryLayoutOptions = [
  ...defaultLayoutOptions,
  {
    name: 'galleryType',
    label: '갤러리 타입',
    type: 'select',
    options: ['grid', 'masonry', 'carousel'],
    default: 'grid'
  },
  {
    name: 'columns',
    label: '열 개수',
    type: 'number',
    min: 1,
    max: 6,
    default: 3
  },
  {
    name: 'showFilter',
    label: '필터 표시',
    type: 'boolean',
    default: true
  }
];

// 블로그 레이아웃 옵션
const blogLayoutOptions = [
  ...defaultLayoutOptions,
  {
    name: 'blogType',
    label: '블로그 타입',
    type: 'select',
    options: ['default', 'masonry', 'grid'],
    default: 'default'
  },
  {
    name: 'showFeatured',
    label: '추천 게시물 표시',
    type: 'boolean',
    default: true
  }
];

// 외부 레이아웃 컴포넌트들을 동적으로 import
const externalLayouts = {
  // 여기에 외부 레이아웃 컴포넌트들을 추가할 수 있습니다
};

export const layoutOptions = [
  {
    id: 'layout01',
    name: '레이아웃 1',
    component: LayoutOne,
    thumbnail: '/assets/img/layouts/layout01.jpg',
    category: '기본',
    options: defaultLayoutOptions
  },
  {
    id: 'layout02',
    name: '레이아웃 2',
    component: LayoutTwo,
    thumbnail: '/assets/img/layouts/layout02.jpg',
    category: '기본',
    options: defaultLayoutOptions
  },
  {
    id: 'layout03',
    name: '레이아웃 3',
    component: LayoutThree,
    thumbnail: '/assets/img/layouts/layout03.jpg',
    category: '기본',
    options: defaultLayoutOptions
  },
  {
    id: 'layout04',
    name: '레이아웃 4',
    component: LayoutFour,
    thumbnail: '/assets/img/layouts/layout04.jpg',
    category: '기본',
    options: defaultLayoutOptions
  },
  {
    id: 'layout05',
    name: '레이아웃 5',
    component: LayoutFive,
    thumbnail: '/assets/img/layouts/layout05.jpg',
    category: '기본',
    options: defaultLayoutOptions
  },
  {
    id: 'layout06',
    name: '레이아웃 6',
    component: LayoutSix,
    thumbnail: '/assets/img/layouts/layout06.jpg',
    category: '기본',
    options: defaultLayoutOptions
  },
  {
    id: 'layout07',
    name: '레이아웃 7',
    component: LayoutSeven,
    thumbnail: '/assets/img/layouts/layout07.jpg',
    category: '기본',
    options: defaultLayoutOptions
  },
  {
    id: 'layout08',
    name: '레이아웃 8',
    component: LayoutEight,
    thumbnail: '/assets/img/layouts/layout08.jpg',
    category: '기본',
    options: defaultLayoutOptions
  },
  {
    id: 'layout09',
    name: '레이아웃 9',
    component: LayoutNine,
    thumbnail: '/assets/img/layouts/layout09.jpg',
    category: '기본',
    options: defaultLayoutOptions
  },
  {
    id: 'layout10',
    name: '레이아웃 10',
    component: LayoutTen,
    thumbnail: '/assets/img/layouts/layout10.jpg',
    category: '기본',
    options: defaultLayoutOptions
  },
  {
    id: 'layout-board',
    name: '게시판 레이아웃',
    component: LayoutBoard,
    thumbnail: '/assets/img/layouts/layout-board.jpg',
    category: '특수',
    options: boardLayoutOptions
  },
  {
    id: 'layout-gallery',
    name: '갤러리 레이아웃',
    component: LayoutGallery,
    thumbnail: '/assets/img/layouts/layout-gallery.jpg',
    category: '특수',
    options: galleryLayoutOptions
  },
  {
    id: 'layout-blog',
    name: '블로그 레이아웃',
    component: LayoutBlog,
    thumbnail: '/assets/img/layouts/layout-blog.jpg',
    category: '특수',
    options: blogLayoutOptions
  }
];

// 외부 레이아웃을 추가하는 함수
export const addExternalLayout = (layout) => {
  const { id, name, component, thumbnail, category } = layout;
  
  // 이미 존재하는 레이아웃인지 확인
  if (layoutOptions.some(l => l.id === id)) {
    console.warn(`Layout with id ${id} already exists`);
    return false;
  }
  
  // 새로운 레이아웃 추가
  layoutOptions.push({
    id,
    name,
    component,
    thumbnail,
    category: category || '외부'
  });
  
  return true;
};

// 외부 레이아웃을 일괄 추가하는 함수
export const addExternalLayouts = (layouts) => {
  return layouts.map(layout => addExternalLayout(layout));
};

// 레이아웃 ID로 컴포넌트를 찾는 함수
export const getLayoutComponentById = (id) => {
  const layout = layoutOptions.find(l => l.id === id);
  return layout ? layout.component : null;
};

// 레이아웃 ID로 기본 속성을 찾는 함수
export const getLayoutDefaultPropsById = (id) => {
  const layout = layoutOptions.find(l => l.id === id);
  if (!layout) return {};
  
  // 기본 속성 객체 초기화
  const defaultProps = {};
  
  // 각 옵션에서 기본값 설정
  if (layout.options && Array.isArray(layout.options)) {
    layout.options.forEach(option => {
      if ('default' in option) {
        defaultProps[option.name] = option.default;
      }
    });
  }
  
  // 레이아웃 자체에 defaultProps가 있으면 병합
  return {
    ...defaultProps,
    ...(layout.defaultProps || {})
  };
}; 