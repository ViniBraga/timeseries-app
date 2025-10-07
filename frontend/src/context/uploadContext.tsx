import { createContext, useContext, useState, type ReactNode } from 'react';

interface UploadContextType {
  notifyUploadComplete: () => void;
  uploadCompleteTrigger: number;
}

const UploadContext = createContext<UploadContextType>({
  notifyUploadComplete: () => {},
  uploadCompleteTrigger: 0,
});

interface UploadProviderProps {
  children: ReactNode;
}

export const UploadProvider = ({ children }: UploadProviderProps) => {
  const [uploadCompleteTrigger, setUploadCompleteTrigger] = useState(0);

  const notifyUploadComplete = () => {
    setUploadCompleteTrigger((prev) => prev + 1);
  };

  return (
    <UploadContext.Provider value={{ notifyUploadComplete, uploadCompleteTrigger }}>
      {children}
    </UploadContext.Provider>
  );
};

export const useUploadContext = () => useContext(UploadContext);