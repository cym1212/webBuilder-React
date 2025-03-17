import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectProjectName } from '../redux/editorSlice';
import buildAndDownloadBuildFolder, { uploadToS3 } from '../utils/buildAndDownloadBuildFolder';  

function BuildButton() {
  const [isBuilding, setIsBuilding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showS3Config, setShowS3Config] = useState(false);
  const [s3Config, setS3Config] = useState({
    bucketName: '',
    region: 'ap-northeast-2',
    accessKeyId: '',
    secretAccessKey: ''
  });
  
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
  
  const handleS3ConfigChange = (e) => {
    const { name, value } = e.target;
    setS3Config(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleS3Upload = async (e) => {
    e.preventDefault();
    
    // 필수 필드 검증
    if (!s3Config.bucketName) {
      alert('S3 버킷 이름을 입력해주세요.');
      return;
    }
    
    try {
      setIsUploading(true);
      const result = await uploadToS3(projectName, s3Config);
      
      if (result.success) {
        alert(`🚀 S3 업로드 완료!\n${result.url}`);
        setShowS3Config(false);
      } else {
        alert('❌ S3 업로드 실패: ' + (result.error || '알 수 없는 오류'));
      }
    } catch (error) {
      console.error('S3 업로드 실패:', error);
      alert('❌ S3 업로드 실패: ' + (error.message || '알 수 없는 오류'));
    } finally {
      setIsUploading(false);
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
        {isBuilding ? '빌드 중...' : '📦 빌드 및 다운로드'}
      </button>
      
      <button 
        className="s3-upload-button" 
        onClick={() => setShowS3Config(!showS3Config)}
        disabled={isUploading}
        title="현재 작업 중인 프로젝트를 S3에 업로드합니다"
      >
        {isUploading ? 'S3 업로드 중...' : '☁️ S3 업로드'}
      </button>
      
      {showS3Config && (
        <div className="s3-config-modal">
          <form onSubmit={handleS3Upload}>
            <h3>S3 업로드 설정</h3>
            
            <div className="form-group">
              <label htmlFor="bucketName">S3 버킷 이름 *</label>
              <input
                type="text"
                id="bucketName"
                name="bucketName"
                value={s3Config.bucketName}
                onChange={handleS3ConfigChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="region">리전</label>
              <input
                type="text"
                id="region"
                name="region"
                value={s3Config.region}
                onChange={handleS3ConfigChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="accessKeyId">액세스 키 ID</label>
              <input
                type="text"
                id="accessKeyId"
                name="accessKeyId"
                value={s3Config.accessKeyId}
                onChange={handleS3ConfigChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="secretAccessKey">시크릿 액세스 키</label>
              <input
                type="password"
                id="secretAccessKey"
                name="secretAccessKey"
                value={s3Config.secretAccessKey}
                onChange={handleS3ConfigChange}
              />
            </div>
            
            <div className="form-actions">
              <button type="button" onClick={() => setShowS3Config(false)}>
                취소
              </button>
              <button type="submit" disabled={isUploading}>
                {isUploading ? '업로드 중...' : '업로드'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default BuildButton;