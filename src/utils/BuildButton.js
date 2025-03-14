import React, { useState } from 'react';
import buildAndDownloadBuildFolder from '../utils/buildAndDownloadBuildFolder';  

function BuildButton() {
  const [isBuilding, setIsBuilding] = useState(false);

  const handleBuild = async () => {
    try {
      setIsBuilding(true);
      const result = await buildAndDownloadBuildFolder();
      
      if (result.success) {
        alert(result.message || '🚀 빌드 완료! 빌드 폴더가 다운로드됩니다.');
      } else {
        alert('❌ 빌드 실패: ' + (result.error || '알 수 없는 오류'));
      }
    } catch (error) {
      console.error('빌드 실패:', error);
      alert('❌ 빌드 실패: ' + (error.message || '알 수 없는 오류'));
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <button 
      className="build-button" 
      onClick={handleBuild}
      disabled={isBuilding}
      title="현재 작업 중인 프로젝트를 빌드하여 build 폴더를 다운로드합니다"
    >
      {isBuilding ? '빌드 중...' : '📦 빌드 및 다운로드'}
    </button>
  );
}

export default BuildButton;