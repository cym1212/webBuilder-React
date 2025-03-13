import React from 'react';
import { useSelector } from 'react-redux';
import { selectComponents } from '../redux/editorSlice';
import { exportAsZip } from '../utils/codeGenerator';

function ExportButton() {
  const components = useSelector(selectComponents);
  
  const handleExport = () => {
    exportAsZip(components);
  };
  
  return (
    <button className="export-button" onClick={handleExport}>
      HTML/CSS 다운로드
    </button>
  );
}

export default ExportButton;