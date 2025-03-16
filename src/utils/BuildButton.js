import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectProjectName } from '../redux/editorSlice';
import buildAndDownloadBuildFolder from '../utils/buildAndDownloadBuildFolder';

function BuildButton() {
  const [isBuilding, setIsBuilding] = useState(false);
  
  const projectName = useSelector(selectProjectName);

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
    <div className="build-actions">
      <button 
        className="build-button" 
        onClick={handleBuild}
        disabled={isBuilding}
        title="현재 작업 중인 프로젝트를 빌드하여 build 폴더를 다운로드합니다"
      >
        {isBuilding ? '빌드 중...' : '📦 빌드 파일 다운로드'}
      </button>
    </div>
  );
}

export default BuildButton;