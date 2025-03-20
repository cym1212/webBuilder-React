import React, { useState, useEffect } from 'react';

function DetailPageComponent({ style, data = {} }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // 데이터 구조 처리
  let productId = '';
  let productTitle = '상품 상세 페이지';
  
  // 객체 형태의 데이터 처리
  if (data && typeof data === 'object') {
    productId = data.productId || '';
    productTitle = data.title || '상품 상세 페이지';
  }

  const defaultData = {
    title: productTitle,
    image: 'https://via.placeholder.com/400x300',
    price: '50,000원',
    description: '이 제품은 고품질의 소재로 제작되었으며, 다양한 용도로 활용할 수 있습니다. 편안한 사용감과 세련된 디자인으로 많은 사랑을 받고 있는 제품입니다.',
    specs: [
      { label: '제조사', value: '샘플 제조사' },
      { label: '원산지', value: '대한민국' },
      { label: '재질', value: '고급 소재' },
      { label: '크기', value: '가로 30cm x 세로 20cm x 높이 10cm' },
    ]
  };

  // 상품 ID에 따른 API URL 생성 함수
  const getApiUrl = (id) => {
    if (!id) return null;
    return `http://49.247.174.32:8080/products/${id}`;
  };

  // ID가 변경될 때마다 API 호출
  useEffect(() => {
    setLoading(true);
    setError(false);
    
    // API URL 결정
    const apiUrl = getApiUrl(productId);
    
    // 실제 API 호출
    const fetchData = async () => {
      try {
        // 유효한 API URL이 있는 경우에만 호출
        if (apiUrl) {
          const response = await fetch(apiUrl);
          
          if (!response.ok) {
            throw new Error('API 응답 오류: ' + response.status);
          }
          
          const responseData = await response.json();
          
          // 응답 데이터 처리
          setProduct(responseData);
        } else {
          // API URL이 없는 경우 기본 데이터 사용
          setProduct(defaultData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('상품 API 호출 오류:', err);
        
        // 오류 발생 시 기본 데이터로 대체
        setProduct(defaultData);
        
        // 에러 메시지 표시
        setError(true);
        setLoading(false);
      }
    };
    
    // API 호출 실행 (약간의 지연으로 로딩 상태 표시)
    const timer = setTimeout(fetchData, 500);
    
    return () => clearTimeout(timer);
  }, [productId]);

  // 최종적으로 사용할 상품 데이터
  const productData = product || defaultData;

  const defaultStyle = {
    fontFamily: 'Arial, sans-serif',
    width: '100%',
    height: '100%',
    overflow: 'auto',
    padding: '20px',
    backgroundColor: '#ffffff',
    ...style
  };

  return (
    <div style={defaultStyle} className="detail-page-component">
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginTop: '0' }}>
        {productData.title}
        {productId && <span style={{ fontSize: '0.7em', color: '#666', marginLeft: '10px' }}>
          (상품 ID: {productId})
        </span>}
      </h2>
      
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '14px', color: '#666' }}>상품 정보를 불러오는 중...</div>
        </div>
      )}
      
      {error && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#dc3545', marginBottom: '20px' }}>
          <div style={{ fontSize: '14px' }}>
            상품 정보를 불러오는데 실패했습니다. 기본 데이터를 표시합니다.
            <br />
            <small>상품 ID: {productId}</small>
          </div>
        </div>
      )}
      
      {!loading && (
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: '1 1 300px' }}>
            <img 
              src={productData.image} 
              alt={productData.title} 
              style={{ width: '100%', maxWidth: '400px', border: '1px solid #eee' }}
            />
          </div>
          
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>가격</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#e63946' }}>{productData.price}</p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>제품 설명</h3>
              <p style={{ lineHeight: '1.6' }}>{productData.description}</p>
            </div>
            
            <div>
              <h3 style={{ margin: '0 0 10px 0' }}>제품 스펙</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {Array.isArray(productData.specs) && productData.specs.map((spec, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                      <th style={{ padding: '8px', textAlign: 'left', width: '30%', backgroundColor: '#f8f9fa' }}>
                        {spec.label}
                      </th>
                      <td style={{ padding: '8px' }}>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div style={{ marginTop: '30px' }}>
              <button style={{ 
                backgroundColor: '#4CAF50', 
                color: 'white', 
                padding: '10px 20px', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                marginRight: '10px'
              }}>
                장바구니 담기
              </button>
              <button style={{ 
                backgroundColor: '#2196F3', 
                color: 'white', 
                padding: '10px 20px', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}>
                바로 구매하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailPageComponent; 