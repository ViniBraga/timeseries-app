import { useEffect, useState } from 'react';
import { fileApi } from '../services/api';
import { useUploadContext } from '../context/uploadContext';

const statusToProgress: Record<string, number> = {
  pending: 10,
  processing: 60,
  completed: 100,
  failed: 100,
};

export const useUploadProgress = (uploadId: string) => {
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>('pending');
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState<boolean>(true);

  const { notifyUploadComplete } = useUploadContext();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fileApi.getUploadStatus(uploadId);
        console.log('res', res)
        setStatus(res.data);
        setProgress(statusToProgress[res.data] ?? 0);

        if (res.data === 'completed' || res.data === 'failed') {
          clearInterval(interval);
          setTimeout(() => setVisible(false), 2000);
          notifyUploadComplete()
        }
      } catch (err) {
        console.error('Failed to fetch upload status:', err);
        setError('Failed to fetch status');
        clearInterval(interval);
        setTimeout(() => setVisible(false), 2000);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [uploadId]);

  return { progress, status, error, visible };
};