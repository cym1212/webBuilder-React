import React from "react";

const LoginForm = ({ style }) => {
  const defaultStyle = {
    padding: '0px',
    backgroundColor: 'transparent',
    borderRadius: '0px',
    boxShadow: 'none',
    fontFamily: 'Arial, sans-serif',
    ...style
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '100%'
  };

  const inputStyle = {
    padding: '8px 12px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    fontSize: '14px',
    width: '100%'
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '4px'
  };

  const buttonStyle = {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '10px',
    width: '100%'
  };

  return (
    <div className="login-form" style={defaultStyle}>
      <h2 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center' }}>로그인</h2>
      <form style={formStyle}>
        <label htmlFor="email" style={labelStyle}>이메일</label>
        <input 
          id="email" 
          type="email" 
          placeholder="이메일 입력" 
          required 
          style={inputStyle}
        />

        <label htmlFor="password" style={labelStyle}>비밀번호</label>
        <input 
          id="password" 
          type="password" 
          placeholder="비밀번호 입력" 
          required 
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>로그인</button>
      </form>
    </div>
  );
};

export default LoginForm;