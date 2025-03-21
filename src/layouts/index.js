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

// 레이아웃 썸네일 기본 이미지
import layoutThumb1 from './layout01/assets/img/logo/logo.png';

// 레이아웃별 로고 정보
export const layoutLogoMapping = {
  'layout01': {
    logoPath: './layout01/assets/img/logo/logo.png',
    logo2Path: './layout01/assets/img/logo/logo-2.png'
  },
  // 추후 다른 레이아웃이 추가될 경우 여기에 해당 경로 추가
  // 'layout02': {
  //   logoPath: './layout02/assets/img/logo/logo.png',
  //   logo2Path: './layout02/assets/img/logo/logo-2.png'
  // },
};

// 레이아웃 ID로 로고 이미지 경로 가져오기 함수
export const getLogoPathByLayoutId = (layoutId) => {
  const mapping = layoutLogoMapping[layoutId];
  return mapping ? mapping.logoPath : layoutLogoMapping['layout01'].logoPath; // 기본값으로 layout01 로고 사용
};

export const getLogo2PathByLayoutId = (layoutId) => {
  const mapping = layoutLogoMapping[layoutId];
  return mapping ? mapping.logo2Path : layoutLogoMapping['layout01'].logo2Path; // 기본값으로 layout01 로고 사용
};

/**
 * 멀티 레이아웃 지원 가이드라인:
 * 
 * 1. 새로운 레이아웃을 추가할 때:
 *    - 레이아웃 폴더를 src/layouts/ 아래에 생성 (예: layout02, layout03 등)
 *    - 각 레이아웃 폴더 내에 assets, components, wrappers 폴더 구조 유지
 *    - 이미지 에셋은 해당 레이아웃 폴더 내의 assets/img에 저장
 * 
 * 2. 레이아웃별 이미지 사용 방법:
 *    - 위의 layoutLogoMapping 객체에 새 레이아웃 ID와 이미지 경로 추가
 *    - 컴포넌트에서 해당 레이아웃의 이미지를 직접 import하여 사용
 *    - 공통된 컴포넌트가 필요한 경우 상위 레벨의 공유 컴포넌트 폴더 사용
 * 
 * 3. 레이아웃 컴포넌트 구조화:
 *    - 레이아웃 구현 파일은 src/layouts/[레이아웃ID]/layouts/ 폴더에 배치
 *    - 레이아웃별 특화된 컴포넌트는 해당 레이아웃 폴더 내에서 관리
 *    - 여러 레이아웃에서 공유하는 공통 컴포넌트는 src/components/에 배치
 * 
 * 4. 레이아웃 선택 시 주의사항:
 *    - 리덕스 스토어에 현재 선택된 레이아웃 ID를 저장
 *    - 컴포넌트에서 현재 레이아웃 ID를 참조하여 적절한 에셋 사용
 *    - 레이아웃별 스타일 충돌 방지를 위해 CSS 모듈 또는 스코프된 스타일 사용
 */

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
    thumbnail: layoutThumb1,
    category: '기본',
    options: defaultLayoutOptions
  },
  {
    id: 'layout02',
    name: '레이아웃 2',
    component: LayoutTwo,
    thumbnail: layoutThumb1,
    category: '기본',
    options: defaultLayoutOptions
  },
  {
    id: 'layout03',
    name: '레이아웃 3',
    component: LayoutThree,
    thumbnail: layoutThumb1,
    category: '기본',
    options: defaultLayoutOptions
  },
  {
    id: 'layout04',
    name: '레이아웃 4',
    component: LayoutFour,
    thumbnail: layoutThumb1,
    category: '기본',
    options: defaultLayoutOptions
  },
  {
    id: 'layout05',
    name: '레이아웃 5',
    component: LayoutFive,
    thumbnail: layoutThumb1,
    category: '기본',
    options: defaultLayoutOptions
  },
  {
    id: 'layout06',
    name: '레이아웃 6',
    component: LayoutSix,
    thumbnail: layoutThumb1,
    category: '기본',
    options: defaultLayoutOptions
  },
  {
    id: 'layout07',
    name: '레이아웃 7',
    component: LayoutSeven,
    thumbnail: layoutThumb1,
    category: '기본',
    options: defaultLayoutOptions
  },
  {
    id: 'layout08',
    name: '레이아웃 8',
    component: LayoutEight,
    thumbnail: layoutThumb1,
    category: '기본',
    options: defaultLayoutOptions
  },
  {
    id: 'layout09',
    name: '레이아웃 9',
    component: LayoutNine,
    thumbnail: layoutThumb1,
    category: '기본',
    options: defaultLayoutOptions
  },
  {
    id: 'layout10',
    name: '레이아웃 10',
    component: LayoutTen,
    thumbnail: layoutThumb1,
    category: '기본',
    options: defaultLayoutOptions
  },
  {
    id: 'layout-board',
    name: '게시판 레이아웃',
    component: LayoutBoard,
    thumbnail: layoutThumb1,
    category: '특수',
    options: boardLayoutOptions
  },
  {
    id: 'layout-gallery',
    name: '갤러리 레이아웃',
    component: LayoutGallery,
    thumbnail: layoutThumb1,
    category: '특수',
    options: galleryLayoutOptions
  },
  {
    id: 'layout-blog',
    name: '블로그 레이아웃',
    component: LayoutBlog,
    thumbnail: layoutThumb1,
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