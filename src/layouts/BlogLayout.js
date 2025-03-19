// import React from "react";
// import PropTypes from "prop-types";

// const BlogLayout = ({ 
//   children, 
//   showSidebar = true, 
//   sidebarPosition = "right", 
//   showFeatured = true,
//   headerStyle = "magazine",
//   footerStyle = "standard",
//   colorTheme = "light"
// }) => {
//   // 색상 테마 스타일
//   const getThemeColors = () => {
//     switch(colorTheme) {
//       case 'professional':
//         return {
//           bgMain: '#ffffff',
//           bgSecondary: '#f8f9fa',
//           text: '#212529',
//           accent: '#0d6efd',
//           accentLight: '#cfe2ff',
//           border: '#dee2e6',
//           featuredBg: '#e9ecef'
//         };
//       case 'bold':
//         return {
//           bgMain: '#ffffff',
//           bgSecondary: '#f8f9fa',
//           text: '#212529',
//           accent: '#dc3545',
//           accentLight: '#f8d7da',
//           border: '#dee2e6',
//           featuredBg: '#f8f9fa'
//         };
//       case 'subtle':
//         return {
//           bgMain: '#ffffff',
//           bgSecondary: '#f8f9fa',
//           text: '#495057',
//           accent: '#6c757d',
//           accentLight: '#e9ecef',
//           border: '#dee2e6',
//           featuredBg: '#f1f3f5'
//         };
//       default:
//         return {
//           bgMain: '#ffffff',
//           bgSecondary: '#f8f9fa',
//           text: '#212529',
//           accent: '#0d6efd',
//           accentLight: '#e7f1ff',
//           border: '#dee2e6',
//           featuredBg: '#f8f9fa'
//         };
//     }
//   };

//   // 헤더 스타일 렌더링
//   const renderHeader = () => {
//     const colors = getThemeColors();

//     switch(headerStyle) {
//       case 'personal':
//         return (
//           <div className="header-container p-3 mb-4" style={{ backgroundColor: colors.bgMain, borderBottom: `1px solid ${colors.border}` }}>
//             <div className="text-center">
//               <h1 className="display-5 mb-0" style={{ color: colors.text, fontWeight: 'bold' }}>마이 블로그</h1>
//               <p className="lead mt-2" style={{ color: colors.accent }}>나만의 생각과 경험을 공유하는 공간</p>
//             </div>
//             <div className="d-flex justify-content-center mt-3">
//               <button className="btn btn-link mx-2" style={{ color: colors.accent }}>홈</button>
//               <button className="btn btn-link mx-2" style={{ color: colors.accent }}>소개</button>
//               <button className="btn btn-link mx-2" style={{ color: colors.accent }}>카테고리</button>
//               <button className="btn btn-link mx-2" style={{ color: colors.accent }}>연락처</button>
//             </div>
//           </div>
//         );
        
//       case 'minimal':
//         return (
//           <div className="header-container p-3 mb-4" style={{ backgroundColor: colors.bgMain, borderBottom: `1px solid ${colors.border}` }}>
//             <div className="d-flex justify-content-between align-items-center">
//               <h2 className="mb-0" style={{ color: colors.text }}>미니멀 블로그</h2>
//               <div>
//                 <button className="btn btn-sm" style={{ color: colors.accent, backgroundColor: 'transparent' }}>로그인</button>
//                 <button className="btn btn-sm ms-2" style={{ backgroundColor: colors.accent, color: '#fff' }}>구독하기</button>
//               </div>
//             </div>
//           </div>
//         );
        
//       case 'magazine':
//       default:
//         return (
//           <div className="header-container p-4 mb-4" style={{ 
//             backgroundColor: colors.bgSecondary, 
//             borderBottom: `1px solid ${colors.border}`,
//             boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
//           }}>
//             <div className="row align-items-center">
//               <div className="col-lg-4">
//                 <h2 className="mb-0" style={{ color: colors.text, fontWeight: 'bold' }}>매거진 블로그</h2>
//               </div>
//               <div className="col-lg-5">
//                 <ul className="nav justify-content-center">
//                   <li className="nav-item">
//                     <a className="nav-link" href="#" style={{ color: colors.accent, fontWeight: 'bold' }}>홈</a>
//                   </li>
//                   <li className="nav-item">
//                     <a className="nav-link" href="#" style={{ color: colors.text }}>테크</a>
//                   </li>
//                   <li className="nav-item">
//                     <a className="nav-link" href="#" style={{ color: colors.text }}>라이프스타일</a>
//                   </li>
//                   <li className="nav-item">
//                     <a className="nav-link" href="#" style={{ color: colors.text }}>여행</a>
//                   </li>
//                   <li className="nav-item">
//                     <a className="nav-link" href="#" style={{ color: colors.text }}>요리</a>
//                   </li>
//                 </ul>
//               </div>
//               <div className="col-lg-3 text-end">
//                 <div className="input-group">
//                   <input type="text" className="form-control form-control-sm" placeholder="검색..." />
//                   <button className="btn btn-sm" style={{ backgroundColor: colors.accent, color: '#fff' }}>
//                     <i className="fas fa-search"></i>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//     }
//   };

//   // 푸터 스타일 렌더링
//   const renderFooter = () => {
//     const colors = getThemeColors();

//     switch(footerStyle) {
//       case 'author':
//         return (
//           <div className="footer-container p-4 mt-4" style={{ backgroundColor: colors.bgSecondary, borderTop: `1px solid ${colors.border}` }}>
//             <div className="row">
//               <div className="col-md-3 text-center mb-3 mb-md-0">
//                 <img src="https://via.placeholder.com/120" className="rounded-circle" alt="Author" />
//               </div>
//               <div className="col-md-9">
//                 <h5 style={{ color: colors.text }}>저자 소개</h5>
//                 <p style={{ color: colors.text }}>안녕하세요. 저는 다양한 주제에 대한 블로그를 운영하고 있습니다. 이 블로그에서는 일상, 기술, 여행 등 다양한 이야기를 나눕니다.</p>
//                 <div className="d-flex mt-3">
//                   <a href="#" className="me-3" style={{ color: colors.accent }}><i className="fab fa-twitter"></i> Twitter</a>
//                   <a href="#" className="me-3" style={{ color: colors.accent }}><i className="fab fa-instagram"></i> Instagram</a>
//                   <a href="#" style={{ color: colors.accent }}><i className="fas fa-envelope"></i> Email</a>
//                 </div>
//               </div>
//             </div>
//             <div className="text-center mt-3" style={{ color: colors.text, borderTop: `1px solid ${colors.border}`, paddingTop: '15px' }}>
//               <p className="mb-0">© 2023 작가형 블로그. All rights reserved.</p>
//             </div>
//           </div>
//         );
        
//       case 'subscription':
//         return (
//           <div className="footer-container p-4 mt-4" style={{ backgroundColor: colors.bgSecondary, borderTop: `1px solid ${colors.border}` }}>
//             <div className="row align-items-center">
//               <div className="col-md-6">
//                 <h4 style={{ color: colors.text }}>최신 소식을 받아보세요</h4>
//                 <p style={{ color: colors.text }}>이메일을 구독하시면 새로운 글이 업데이트될 때 알려드립니다.</p>
//               </div>
//               <div className="col-md-6">
//                 <div className="input-group">
//                   <input type="email" className="form-control" placeholder="이메일 주소" />
//                   <button className="btn" style={{ backgroundColor: colors.accent, color: '#fff' }}>구독하기</button>
//                 </div>
//               </div>
//             </div>
//             <div className="row mt-4 pt-3" style={{ borderTop: `1px solid ${colors.border}` }}>
//               <div className="col-md-8">
//                 <div className="d-flex">
//                   <a href="#" className="me-3" style={{ color: colors.text }}>이용약관</a>
//                   <a href="#" className="me-3" style={{ color: colors.text }}>개인정보처리방침</a>
//                   <a href="#" style={{ color: colors.text }}>문의하기</a>
//                 </div>
//               </div>
//               <div className="col-md-4 text-end">
//                 <p className="mb-0" style={{ color: colors.text }}>© 2023 구독형 블로그. All rights reserved.</p>
//               </div>
//             </div>
//           </div>
//         );
        
//       case 'standard':
//       default:
//         return (
//           <div className="footer-container p-4 mt-4" style={{ 
//             backgroundColor: colors.bgSecondary, 
//             borderTop: `1px solid ${colors.border}`,
//             boxShadow: '0 -2px 4px rgba(0,0,0,0.03)'
//           }}>
//             <div className="row">
//               <div className="col-md-4 mb-3 mb-md-0">
//                 <h5 style={{ color: colors.text }}>매거진 블로그</h5>
//                 <p style={{ color: colors.text }}>다양한 주제의 흥미로운 이야기가 가득한 블로그입니다. 항상 새로운 콘텐츠로 찾아뵙겠습니다.</p>
//               </div>
//               <div className="col-md-4 mb-3 mb-md-0">
//                 <h5 style={{ color: colors.text }}>카테고리</h5>
//                 <ul className="list-unstyled">
//                   <li><a href="#" style={{ color: colors.accent }}>테크</a></li>
//                   <li><a href="#" style={{ color: colors.accent }}>라이프스타일</a></li>
//                   <li><a href="#" style={{ color: colors.accent }}>여행</a></li>
//                   <li><a href="#" style={{ color: colors.accent }}>요리</a></li>
//                 </ul>
//               </div>
//               <div className="col-md-4">
//                 <h5 style={{ color: colors.text }}>팔로우</h5>
//                 <div className="d-flex">
//                   <a href="#" className="me-2" style={{ color: colors.accent }}><i className="fab fa-facebook-f"></i></a>
//                   <a href="#" className="me-2" style={{ color: colors.accent }}><i className="fab fa-twitter"></i></a>
//                   <a href="#" className="me-2" style={{ color: colors.accent }}><i className="fab fa-instagram"></i></a>
//                   <a href="#" style={{ color: colors.accent }}><i className="fab fa-pinterest"></i></a>
//                 </div>
//               </div>
//             </div>
//             <div className="text-center mt-3" style={{ color: colors.text, borderTop: `1px solid ${colors.border}`, paddingTop: '15px' }}>
//               <p className="mb-0">© 2023 블로그. All rights reserved.</p>
//             </div>
//           </div>
//         );
//     }
//   };

//   // 추천 블로그 영역 스타일 설정
//   const renderFeaturedSection = () => {
//     const colors = getThemeColors();
    
//     return (
//       <div className="row mb-4">
//         <div className="col-12">
//           <div className="blog-featured-area p-4" style={{ 
//             backgroundColor: colors.featuredBg, 
//             border: `1px solid ${colors.border}`,
//             borderRadius: '5px',
//             boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
//           }}>
//             <div className="row">
//               <div className="col-md-5">
//                 <div className="featured-image">
//                   <img 
//                     src="https://via.placeholder.com/600x400" 
//                     alt="Featured Post" 
//                     className="img-fluid rounded"
//                     style={{ boxShadow: '0 3px 10px rgba(0,0,0,0.1)' }}
//                   />
//                 </div>
//               </div>
//               <div className="col-md-7">
//                 <div className="featured-content">
//                   <span className="badge mb-2" style={{ backgroundColor: colors.accent, color: '#fff' }}>추천</span>
//                   <h3 style={{ color: colors.text, fontWeight: 'bold' }}>추천 블로그 포스트 제목</h3>
//                   <p style={{ color: colors.text }}>추천 블로그 포스트 요약 내용이 들어갑니다. 주요 내용을 간단히 보여주는 영역입니다. 이 부분은 블로그에서 가장 주목받는 포스트나 최신 포스트를 소개하는 데 활용할 수 있습니다.</p>
//                   <div className="featured-meta" style={{ color: colors.accent }}>
//                     <span className="me-3">2023.04.15</span>
//                     <span>작성자: 홍길동</span>
//                   </div>
//                   <button className="btn mt-3" style={{ backgroundColor: colors.accent, color: '#fff' }}>자세히 보기</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="blog-layout">
//       <div className="container">
//         {/* 헤더 영역 */}
//         {renderHeader()}

//         {/* 추천 블로그 영역 */}
//         {showFeatured && renderFeaturedSection()}
        
//         <div className="row">
//           {/* 왼쪽 사이드바 */}
//           {showSidebar && sidebarPosition === "left" && (
//             <div className="col-lg-3">
//               <div className="blog-sidebar p-3 border">
//                 <div className="sidebar-widget mb-4">
//                   <h4>카테고리</h4>
//                   <ul className="list-unstyled">
//                     <li className="p-2 border-bottom"><a href="#" className="text-decoration-none">전체</a></li>
//                     <li className="p-2 border-bottom"><a href="#" className="text-decoration-none">여행</a></li>
//                     <li className="p-2 border-bottom"><a href="#" className="text-decoration-none">음식</a></li>
//                     <li className="p-2 border-bottom"><a href="#" className="text-decoration-none">라이프스타일</a></li>
//                     <li className="p-2"><a href="#" className="text-decoration-none">기술</a></li>
//                   </ul>
//                 </div>
//                 <div className="sidebar-widget">
//                   <h4>최근 글</h4>
//                   <ul className="list-unstyled">
//                     <li className="p-2 border-bottom">
//                       <a href="#" className="text-decoration-none">블로그 포스트 제목 1</a>
//                       <div className="text-muted small">2023.04.10</div>
//                     </li>
//                     <li className="p-2 border-bottom">
//                       <a href="#" className="text-decoration-none">블로그 포스트 제목 2</a>
//                       <div className="text-muted small">2023.04.08</div>
//                     </li>
//                     <li className="p-2">
//                       <a href="#" className="text-decoration-none">블로그 포스트 제목 3</a>
//                       <div className="text-muted small">2023.04.05</div>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           )}
          
//           {/* 메인 컨텐츠 영역 */}
//           <div className={`${showSidebar ? "col-lg-9" : "col-lg-12"}`}>
//             <div className="blog-main-content p-3 border">
//               {children || (
//                 <div className="placeholder-content">
//                   <div className="blog-posts">
//                     <div className="blog-post mb-5">
//                       <div className="blog-post-image mb-3">
//                         <img src="https://via.placeholder.com/800x400" alt="Blog Post" className="img-fluid" />
//                       </div>
//                       <h3 className="blog-post-title mb-2">블로그 포스트 제목</h3>
//                       <div className="blog-post-meta text-muted mb-3">
//                         <span className="me-3">2023.04.15</span>
//                         <span className="me-3">작성자: 홍길동</span>
//                         <span>카테고리: 여행</span>
//                       </div>
//                       <div className="blog-post-excerpt">
//                         <p>블로그 포스트 내용이 여기에 표시됩니다. 이 영역은 블로그 포스트의 일부 내용을 미리 보여주는 영역입니다. 사용자가 전체 내용을 보기 위해 포스트를 클릭할 수 있습니다.</p>
//                       </div>
//                       <div className="blog-post-link">
//                         <a href="#" className="btn btn-outline-primary btn-sm">더 보기</a>
//                       </div>
//                     </div>
//                     <div className="blog-post mb-5">
//                       <div className="blog-post-image mb-3">
//                         <img src="https://via.placeholder.com/800x400" alt="Blog Post" className="img-fluid" />
//                       </div>
//                       <h3 className="blog-post-title mb-2">두 번째 블로그 포스트 제목</h3>
//                       <div className="blog-post-meta text-muted mb-3">
//                         <span className="me-3">2023.04.10</span>
//                         <span className="me-3">작성자: 김철수</span>
//                         <span>카테고리: 음식</span>
//                       </div>
//                       <div className="blog-post-excerpt">
//                         <p>두 번째 블로그 포스트 내용입니다. 이 영역은 블로그 포스트의 일부 내용을 미리 보여주는 영역입니다. 사용자가 전체 내용을 보기 위해 포스트를 클릭할 수 있습니다.</p>
//                       </div>
//                       <div className="blog-post-link">
//                         <a href="#" className="btn btn-outline-primary btn-sm">더 보기</a>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="d-flex justify-content-center">
//                     <nav>
//                       <ul className="pagination">
//                         <li className="page-item"><a className="page-link" href="#">이전</a></li>
//                         <li className="page-item active"><a className="page-link" href="#">1</a></li>
//                         <li className="page-item"><a className="page-link" href="#">2</a></li>
//                         <li className="page-item"><a className="page-link" href="#">3</a></li>
//                         <li className="page-item"><a className="page-link" href="#">다음</a></li>
//                       </ul>
//                     </nav>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
          
//           {/* 오른쪽 사이드바 */}
//           {showSidebar && sidebarPosition === "right" && (
//             <div className="col-lg-3">
//               <div className="blog-sidebar p-3 border">
//                 <div className="sidebar-widget mb-4">
//                   <h4>카테고리</h4>
//                   <ul className="list-unstyled">
//                     <li className="p-2 border-bottom"><a href="#" className="text-decoration-none">전체</a></li>
//                     <li className="p-2 border-bottom"><a href="#" className="text-decoration-none">여행</a></li>
//                     <li className="p-2 border-bottom"><a href="#" className="text-decoration-none">음식</a></li>
//                     <li className="p-2 border-bottom"><a href="#" className="text-decoration-none">라이프스타일</a></li>
//                     <li className="p-2"><a href="#" className="text-decoration-none">기술</a></li>
//                   </ul>
//                 </div>
//                 <div className="sidebar-widget">
//                   <h4>최근 글</h4>
//                   <ul className="list-unstyled">
//                     <li className="p-2 border-bottom">
//                       <a href="#" className="text-decoration-none">블로그 포스트 제목 1</a>
//                       <div className="text-muted small">2023.04.10</div>
//                     </li>
//                     <li className="p-2 border-bottom">
//                       <a href="#" className="text-decoration-none">블로그 포스트 제목 2</a>
//                       <div className="text-muted small">2023.04.08</div>
//                     </li>
//                     <li className="p-2">
//                       <a href="#" className="text-decoration-none">블로그 포스트 제목 3</a>
//                       <div className="text-muted small">2023.04.05</div>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
        
//         {/* 푸터 영역 */}
//         {renderFooter()}
//       </div>
//     </div>
//   );
// };

// BlogLayout.propTypes = {
//   children: PropTypes.node,
//   showSidebar: PropTypes.bool,
//   sidebarPosition: PropTypes.string,
//   showFeatured: PropTypes.bool,
//   headerStyle: PropTypes.oneOf(['magazine', 'personal', 'minimal']),
//   footerStyle: PropTypes.oneOf(['standard', 'author', 'subscription']),
//   colorTheme: PropTypes.oneOf(['professional', 'bold', 'subtle'])
// };

// export default BlogLayout; 