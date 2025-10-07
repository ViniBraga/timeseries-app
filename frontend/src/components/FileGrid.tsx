import type { FileSummaryItem } from "../services/api";
import FileCard from "./FileCard";

type FileGridProps = {
  files: FileSummaryItem[];
  onDownload: (file: FileSummaryItem) => void;
  onDelete: (file: FileSummaryItem) => void;
};

const FileGrid = ({ files, onDownload, onDelete }: FileGridProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {files.map((file, i) => (
      <FileCard
        key={i}
        file={file}
        onDelete={() => onDelete(file)}
        onDownload={() => onDownload(file)}
      />
    ))}
  </div>
)

export default FileGrid