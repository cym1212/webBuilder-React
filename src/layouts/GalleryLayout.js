// import React from "react";
// import PropTypes from "prop-types";

// const GalleryLayout = ({
//   children,
//   columns = 3,
//   showFilter = true,
//   darkMode = false
// }) => {
//   return (
//     <div className={`gallery-layout ${darkMode ? "dark-mode" : "light-mode"}`}>
//       <div className="container">
//         {/* 헤더 영역 */}
//         <div className="row mb-4">
//           <div className="col-12">
//             <div className="header-container p-3 bg-light border">
//               <h2 className="mb-0">갤러리 레이아웃</h2>
//             </div>
//           </div>
//         </div>

//         {/* 필터 영역 */}
//         {showFilter && (
//           <div className="row mb-4">
//             <div className="col-12">
//               <div className="gallery-filter p-3 border">
//                 <ul className="nav nav-pills justify-content-center">
//                   <li className="nav-item mx-2">
//                     <button className="nav-link active">전체</button>
//                   </li>
//                   <li className="nav-item mx-2">
//                     <button className="nav-link">사진</button>
//                   </li>
//                   <li className="nav-item mx-2">
//                     <button className="nav-link">일러스트</button>
//                   </li>
//                   <li className="nav-item mx-2">
//                     <button className="nav-link">디자인</button>
//                   </li>
//                   <li className="nav-item mx-2">
//                     <button className="nav-link">작품</button>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         )}
        
//         {/* 갤러리 컨텐츠 영역 */}
//         <div className="row">
//           <div className="col-12">
//             <div className="gallery-content p-3 border">
//               {children || (
//                 <div className={`row gallery-columns-${columns}`}>
//                   {/* 예시 갤러리 아이템들 */}
//                   {Array.from({ length: 9 }).map((_, index) => (
//                     <div 
//                       key={index} 
//                       className={`col-lg-${12 / columns} col-md-6 col-sm-12 mb-4`}
//                     >
//                       <div className="gallery-item">
//                         <div className="gallery-image position-relative">
//                           <img 
//                             src={`https://via.placeholder.com/600x400?text=Gallery+Item+${index + 1}`} 
//                             alt={`Gallery Item ${index + 1}`}
//                             className="img-fluid"
//                           />
//                           <div className="gallery-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
//                             <div className="gallery-actions">
//                               <button className="btn btn-light btn-sm mx-1">
//                                 <i className="fa fa-eye"></i> 보기
//                               </button>
//                               <button className="btn btn-light btn-sm mx-1">
//                                 <i className="fa fa-link"></i> 링크
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="gallery-info p-2">
//                           <h5 className="gallery-title">갤러리 아이템 {index + 1}</h5>
//                           <p className="gallery-category text-muted">카테고리: {
//                             index % 4 === 0 ? '사진' : 
//                             index % 4 === 1 ? '일러스트' : 
//                             index % 4 === 2 ? '디자인' : '작품'
//                           }</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
        
//         {/* 페이지네이션 영역 */}
//         <div className="row mt-4 mb-4">
//           <div className="col-12">
//             <div className="d-flex justify-content-center">
//               <nav>
//                 <ul className="pagination">
//                   <li className="page-item">
//                     <a className="page-link" href="#">이전</a>
//                   </li>
//                   <li className="page-item active">
//                     <a className="page-link" href="#">1</a>
//                   </li>
//                   <li className="page-item">
//                     <a className="page-link" href="#">2</a>
//                   </li>
//                   <li className="page-item">
//                     <a className="page-link" href="#">3</a>
//                   </li>
//                   <li className="page-item">
//                     <a className="page-link" href="#">다음</a>
//                   </li>
//                 </ul>
//               </nav>
//             </div>
//           </div>
//         </div>
        
//         {/* 푸터 영역 */}
//         <div className="row">
//           <div className="col-12">
//             <div className="footer-container p-3 bg-light border">
//               <p className="mb-0 text-center">© 2023 갤러리 레이아웃. All rights reserved.</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// GalleryLayout.propTypes = {
//   children: PropTypes.node,
//   columns: PropTypes.number,
//   showFilter: PropTypes.bool,
//   darkMode: PropTypes.bool
// };

// export default GalleryLayout; 