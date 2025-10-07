import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import FileUpload from '../../components/FileUpload';
import ConfirmModal from '../../components/ConfirmModal';
import { fileApi, type FileSummaryItem } from '../../services/api';
import SkeletonGrid from '../../components/SkeletonGrid';
import FileGrid from '../../components/FileGrid';
import { UploadProvider, useUploadContext } from '../../context/uploadContext';

const FilesContent = () => {
  const [files, setFiles] = useState<FileSummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  const { uploadCompleteTrigger } = useUploadContext();

  const fetchSummary = async () => {
    setLoading(true)
    try {
      const res = await fileApi.getSummary();
      setFiles(res);
    } catch (err) {
      console.error('Failed to fetch file summary:', err);
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [uploadCompleteTrigger]);

  const handleDownload = (file: FileSummaryItem) => {
    const url = fileApi.downloadFile(file.name);
    window.open(url, '_blank');
  };

  const handleDelete = (file: FileSummaryItem) => {
    setFileToDelete(file.name);
    setShowModal(true);
  }

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;

    try {
      await fileApi.deleteFile(fileToDelete);
      toast.success('File deleted successfully');
      setShowModal(false);
      setFileToDelete(null);
      fetchSummary();
    } catch (err) {
      toast.error('Failed to delete file');
      console.error(err);
    }
  }

  const handleModalClose = () => {
    setShowModal(false);
    setFileToDelete(null);
  };

  return (
    <>
      <div className="p-6">
        <FileUpload />

        {loading && <SkeletonGrid />}

        {!loading && files.length === 0 && (
          <p className="text-gray-500">There are no files yet</p>
        )}

        <FileGrid
          files={files}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />

      </div>
      <ConfirmModal
        isOpen={showModal}
        onClose={handleModalClose}
        onConfirm={handleDeleteConfirm}
        title="Delete File"
        message={`Are you sure you want to delete all records for "${fileToDelete}"? This action cannot be undone.`}
      />
    </>
  );
}

const Files = () => {
  return (
    <UploadProvider>
      <FilesContent />
    </UploadProvider>
  );
};

export default Files;