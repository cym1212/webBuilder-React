import React from 'react';

function DetailPageComponent({ style, data = {} }) {
  const defaultData = {
    title: '상품 상세 페이지',
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

  const productData = Object.keys(data).length > 0 ? data : defaultData;

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
      </h2>
      
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
                {productData.specs.map((spec, index) => (
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
    </div>
  );
}

export default DetailPageComponent; 