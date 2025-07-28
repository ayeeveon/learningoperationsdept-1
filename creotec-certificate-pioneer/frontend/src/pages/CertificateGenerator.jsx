import React, { useState } from "react";
import { useAuth } from "../utils/auth";
import { useNavigate } from "react-router-dom";

import TemplateSelection from "../components/TemplateSelection";
import CertificateDetails from "../components/DetailsForm";
import Signatories from "../components/SignatoriesForm";
import ExcelUploader from "../components/ExcelUploader";
import DownloadLinks from "../components/DownloadLinks";

function CertificateGenerator(){
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState("ojt");
  const [excelData, setExcelData] = useState([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState([]);

  const handleExcelParsed = async(data) => {
    setExcelData(data);

    console.log('Data to send:', data);

     try {
      const response = await fetch('http://localhost:5000/upload/excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: data }),
      });
      if (!response.ok) throw new Error('Upload failed');
      const result = await response.json();
      console.log('Upload success:', result);
    } catch (error) {
      console.error('Error uploading excel data:', error);
    }

  };

  const detectedColumns = excelData.length > 0 ? Object.keys(excelData[0]) : [];

  // Generate certificates
  const handleGenerate = async () => {
    if (excelData.length === 0) {
      alert('No data loaded. Please upload an Excel file first.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/generate/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: selectedTemplate,
          rows: excelData,
        }),
      });

      const result = await response.json();
      console.log("Generated files:", result.files);
      // Append new generated files to existing links
      setGeneratedFiles(prev => [...prev, ...(result.files || [])]);
      // Download links section will appear; no auto-download
      setPreviewLoading(false);

    } catch (err) {
      console.error("Error generating certificates:", err);
    }
  };

  // Preview handler
  const handlePreview = async () => {
    console.log('Preview clicked, excelData:', excelData);
    if (excelData.length === 0) {
      alert('No data loaded. Please upload an Excel file first.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/generate/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: selectedTemplate, rows: excelData }),
      });
      const html = await response.text();
      const previewWindow = window.open('', '_blank');
      previewWindow.document.write(html);
    } catch (err) {
      console.error('Error previewing certificate:', err);
    }
  };

  return (
    <>
      {/* Logout button */}
      <div className="flex justify-end p-2">
        <button
          className="rounded-md bg-red-600 text-white px-3 py-1 hover:bg-red-700"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >Logout</button>
      </div>
      <div className="container rounded-md">
        <h3 className="section-header">Upload Data File</h3>
        <ExcelUploader onDataParsed={handleExcelParsed} />

        {detectedColumns.length > 0 && (
          <div className="mt-4 bg-zinc-700 p-4 rounded-md text-white">
            <h4 className="font-semibold mb-2">Detected Columns:</h4>
            <div className="flex flex-wrap gap-2">
              {detectedColumns.map((col, idx) => (
                <div
                  key={idx}
                  className="bg-violet-600 text-white text-sm px-3 py-1 rounded-full shadow-sm max-w-max"
                >
                  {col}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="container rounded-md">
        <h3 className="section-header">Select a Template</h3>
        <TemplateSelection selected={selectedTemplate} onChange={setSelectedTemplate} />
      </div>

      {/* Only show these sections when custom template is selected */}
      {selectedTemplate === "custom" && (
        <>
          <div className="container rounded-md">
            <h3 className="section-header">Certificate Customization</h3>
            <CertificateDetails />
            <Signatories />
          </div>
        </>
      )}

      <div className="container rounded-md w-full flex gap-2">
        <button className="rounded-md bg-[#3737ff7e] p-2" onClick={handlePreview} disabled={previewLoading}>
          {previewLoading ? 'Loading...' : 'Preview'}
        </button>
        <button className="rounded-md bg-[#a361ef] p-2" id="generate-btn" onClick={handleGenerate}>Generate Certificates</button>
      </div>

      {/* Download component shown after generation */}
      {generatedFiles.length > 0 && <DownloadLinks files={generatedFiles} />}
    </>
  );
}

export default CertificateGenerator;