
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { uploadResume } from '../../services/api';

interface UploadFormProps {
  onUploadSuccess: (resumeId: string) => void;
}

export function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or Word document (.pdf, .doc, .docx)');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Get token from localStorage or wherever it's stored
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }


      // Create a new resume first
      const API_BASE = import.meta.env?.VITE_API_URL || 'http://localhost:4000/api';
      const createResponse = await fetch(`${API_BASE}/resumes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: `Uploaded Resume - ${file.name}` })
      });

      if (!createResponse.ok) {
        const err = await createResponse.json();
        throw new Error(err.error || 'Failed to create resume');
      }

      const resume = await createResponse.json();
      const resumeId = resume.id;

      console.log('[UploadForm] Resume created with ID:', resumeId)

      // Validate resume ID more thoroughly
      if (!resumeId || 
          resumeId === 'undefined' || 
          resumeId === 'null' || 
          typeof resumeId !== 'string' || 
          resumeId.trim() === '') {
        console.error('[UploadForm] Invalid resume ID generated:', resumeId)
        throw new Error('Invalid resume ID generated')
      }

      // Upload the file
      const uploadResponse = await uploadResume(resumeId, file, token);
      
      if (uploadResponse && uploadResponse.structured) {
        console.log('[UploadForm] Upload successful, calling onUploadSuccess with ID:', resumeId)
        onUploadSuccess(resumeId);
      } else {
        throw new Error('Failed to parse resume content');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      // Clear the file input
      event.target.value = '';
    }
  };

  return (
    <div className="mb-6 p-6 bg-slate-50 border border-slate-200 rounded-xl">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Upload className="w-8 h-8 text-slate-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-3">
          Upload Existing Resume
        </h3>
        <p className="text-slate-600 mb-6 max-w-md mx-auto">
          Upload a PDF or Word document to automatically populate your
          resume fields with parsed content.
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div className="flex flex-col items-center gap-4">
          <label className="flex items-center gap-3 px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
            <Upload className="w-5 h-5" />
            {uploading ? "Uploading..." : "Choose File"}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
          {uploading && (
            <div className="flex items-center gap-2 text-slate-600">
              <div className="w-4 h-4 border border-slate-400 border-t-slate-600 rounded-full animate-spin"></div>
              <span className="text-sm">Processing your resume...</span>
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-4">
          Supported formats: PDF, DOC, DOCX (Max 10MB)
        </p>
      </div>
    </div>
  );
}
