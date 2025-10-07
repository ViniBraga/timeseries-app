import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Upload, FileText, XCircle } from 'lucide-react';
import { fileApi } from '../services/api';
import UploadProgress from './UploadProgress';

type UploadFile = {
  file: File;
  hasError: boolean;
};

const FileUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadIds, setUploadIds] = useState<string[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const incomingFiles = Array.from(e.target.files);
    const filenames = incomingFiles.map((f) => f.name);

    try {
      const existing = await fileApi.checkFilenames(filenames);
      const enrichedFiles: UploadFile[] = incomingFiles.map((file) => ({
        file,
        hasError: existing.includes(file.name),
      }));

      setFiles(enrichedFiles);
    } catch (err) {
      console.error('Filename check failed:', err);
      setFiles(incomingFiles.map((file) => ({ file, hasError: false })));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    const validFiles = files.filter(f => !f.hasError).map(f => f.file);
    if (validFiles.length === 0) {
      toast.error('No valid files to upload');
      return;
    }
    
    setIsUploading(true);

    try {
      const { message, data } = await fileApi.uploadFiles(validFiles);
      toast.success(message);
      setFiles([]);
      setUploadIds(data.uploadIds);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Upload failed: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  const hasErrors = files.some((f) => f.hasError);

  return (
    <div className="p-6">
      <div className="flex items-center justify-end mb-6">
        <button
          onClick={handleUploadClick}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          <Upload size={18} />
          Upload
        </button>
        <input
          type="file"
          multiple
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {uploadIds.length > 0 && uploadIds.map((id) => <UploadProgress key={id} uploadId={id} />)}

      {files.length > 0 && (
        <div className="mb-4">
          <h2 className="text-md font-medium text-gray-700 mb-2">Selected Files</h2>
          <ul className="space-y-2">
            {files.map(({ file, hasError }, index) => (
              <li
                key={index}
                className={`flex items-center justify-between border rounded-lg p-3 shadow-sm transition ${
                  hasError ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="text-gray-500" size={20} />
                  <span className="text-gray-700">{file.name}</span>
                </div>
                {hasError && (
                  <span className="text-sm text-red-500">Already uploaded</span>
                )}
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <XCircle size={20} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {files.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={isUploading || hasErrors}
          className={`bg-green-600 text-white px-4 py-2 rounded transition ${
            isUploading || hasErrors
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-green-700'
          }`}
        >
          {isUploading ? 'Uploading...' : 'Confirm'}
        </button>
      )}
    </div>
  );
};

export default FileUpload;