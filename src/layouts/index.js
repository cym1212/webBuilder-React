import BoardLayout from './BoardLayout';
import BlogLayout from './BlogLayout';
import GalleryLayout from './GalleryLayout';

// 레이아웃 옵션 정보
export const layoutOptions = [
  {
    id: 'board',
    name: '게시판 레이아웃',
    description: '게시판, 커뮤니티 사이트에 적합한 레이아웃입니다.',
    component: BoardLayout,
    options: [
      { name: 'showSidebar', type: 'boolean', label: '사이드바 표시', default: true },
      { name: 'sidebarPosition', type: 'select', label: '사이드바 위치', options: ['left', 'right'], default: 'right' }
    ],
    defaultProps: {
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
      { name: 'showSidebar', type: 'boolean', label: '사이드바 표시', default: true },
      { name: 'sidebarPosition', type: 'select', label: '사이드바 위치', options: ['left', 'right'], default: 'right' },
      { name: 'showFeatured', type: 'boolean', label: '추천 포스트 표시', default: true }
    ],
    defaultProps: {
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
      { name: 'columns', type: 'number', label: '열 수', default: 3, min: 1, max: 4 },
      { name: 'showFilter', type: 'boolean', label: '필터 표시', default: true },
      { name: 'darkMode', type: 'boolean', label: '다크 모드', default: false }
    ],
    defaultProps: {
      columns: 3,
      showFilter: true,
      darkMode: false
    },
    previewImage: 'https://via.placeholder.com/300x200?text=Gallery+Layout'
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
  GalleryLayout
}; 