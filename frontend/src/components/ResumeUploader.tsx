import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { UploadCloudIcon, FileIcon, XIcon, FileTextIcon } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
export const ResumeUploader: React.FC = () => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');
  const [resumeText, setResumeText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const {
    uploadResume,
    isLoading
  } = useResume();
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  const handleFile = (file: File) => {
    // Check if file is PDF, DOCX, DOC, or text
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.type)) {
      setSelectedFile(file);
    } else {
      alert('Please upload a PDF, DOCX, DOC, or TXT file');
    }
  };
  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const handleSubmit = async () => {
    if (inputMode === 'file' && selectedFile) {
      await uploadResume(selectedFile);
    } else if (inputMode === 'text' && resumeText.trim()) {
      // Send text directly to the API
      await uploadResume(null, resumeText);
    }
  };
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  const toggleInputMode = () => {
    setInputMode(inputMode === 'file' ? 'text' : 'file');
  };
  return <Card variant="glass" className={`w-full max-w-md transition-all duration-200 ${dragActive ? 'border-primary glow-primary' : ''}`}>
      <div className="flex justify-end mb-2">
        <Button variant="ghost" size="sm" onClick={toggleInputMode} className="flex items-center text-xs">
          {inputMode === 'file' ? <>
              <FileTextIcon size={14} className="mr-1" />
              Switch to Text Input
            </> : <>
              <UploadCloudIcon size={14} className="mr-1" />
              Switch to File Upload
            </>}
        </Button>
      </div>
      {inputMode === 'file' ? <div className="flex flex-col items-center justify-center py-6" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
          <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.docx,.doc,.txt" onChange={handleChange} />
          {!selectedFile ? <>
              <motion.div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-dark-100" whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }}>
                <UploadCloudIcon size={32} className="text-primary" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Upload your resume</h3>
              <p className="text-gray-400 text-center mb-6">
                Drag and drop your resume or click to browse
              </p>
              <p className="text-gray-500 text-sm mb-6">
                Supports PDF, DOCX, DOC, TXT (Max 5MB)
              </p>
              <Button onClick={handleButtonClick}>Browse Files</Button>
            </> : <>
              <div className="w-full">
                <div className="flex items-center p-4 bg-dark-100 rounded-lg mb-4">
                  <FileIcon className="text-primary mr-3" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white truncate">{selectedFile.name}</p>
                    <p className="text-gray-400 text-sm">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button onClick={removeFile} className="ml-2 text-gray-400 hover:text-white p-1">
                    <XIcon size={18} />
                  </button>
                </div>
                <Button variant="primary" fullWidth onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? 'Uploading...' : 'Analyze Resume'}
                </Button>
              </div>
            </>}
        </div> : <div className="flex flex-col items-center justify-center py-6">
          <motion.div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-dark-100" whileHover={{
        scale: 1.05
      }} whileTap={{
        scale: 0.95
      }}>
            <FileTextIcon size={32} className="text-primary" />
          </motion.div>
          <h3 className="text-xl font-semibold mb-2">Paste your resume</h3>
          <p className="text-gray-400 text-center mb-6">
            Copy and paste the content of your resume
          </p>
          <div className="w-full mb-6">
            <textarea ref={textAreaRef} value={resumeText} onChange={e => setResumeText(e.target.value)} className="w-full h-64 bg-dark-50 border border-gray-700 rounded-lg p-4 text-white resize-none focus:ring-primary focus:border-primary" placeholder="Paste your resume content here..."></textarea>
          </div>
          <Button variant="primary" fullWidth onClick={handleSubmit} disabled={isLoading || !resumeText.trim()}>
            {isLoading ? 'Processing...' : 'Analyze Resume'}
          </Button>
        </div>}
    </Card>;
};