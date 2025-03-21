import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

// 로고 이미지 직접 import
import logoImg from "../../assets/img/logo/logo.png";
import logoImg2 from "../../assets/img/logo/logo-2.png";

const Logo = ({ imageUrl, logoClass }) => {
  // 선택된 레이아웃 정보 가져오기 (실제 리덕스 상태가 있다면 사용)
  const selectedLayout = useSelector(
    (state) => state.editor?.layout?.selectedLayout || 'layout01'
  );

  // 이미지 URL에 따라 적절한 로고 선택
  const getLogoSrc = () => {
    // logo-2.png가 포함된 경우 두 번째 로고 사용
    if (imageUrl && imageUrl.includes("logo-2.png")) {
      return logoImg2;
    }
    // 기본 로고 이미지 사용
    return logoImg;
  };

  return (
    <div className={clsx(logoClass)}>
      <Link to={process.env.PUBLIC_URL + "/"}>
        <img 
          alt=""
          src={getLogoSrc()} 
          onError={(e) => {
            console.error("로고 이미지 로드 오류");
            e.target.src = ""; // 이미지 로드 실패 시 빈 값 설정
          }} 
        />
      </Link>
    </div>
  );
};

Logo.propTypes = {
  imageUrl: PropTypes.string,
  logoClass: PropTypes.string
};

export default Logo;
