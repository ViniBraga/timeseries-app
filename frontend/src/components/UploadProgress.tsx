import { useUploadProgress } from "../hooks/useUploadProgress";

type UploadProgressProps = {
  uploadId: string;
};

const UploadProgress = ({ uploadId }: UploadProgressProps) => {
  const { progress, status, error, visible } = useUploadProgress(uploadId);

  if (!visible) return null;

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-600">Status: {status}</span>
        <span className="text-sm text-gray-600">{progress}%</span>
      </div>
      <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 transition-all duration-500 ${
            status === 'failed' ? 'bg-red-500' : 'bg-blue-600'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default UploadProgress;