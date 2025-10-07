import { Download, Trash2 } from "lucide-react";
import type { FileSummaryItem } from "../services/api";
import IconButton from "./IconButton";

type FileCardProps = {
  file: FileSummaryItem;
  onDownload: () => void;
  onDelete: () => void;
};

const FileCard = ({ file, onDownload, onDelete }: FileCardProps) => (
  <div className="bg-white border border-gray-300 shadow-sm rounded-lg p-4 transition-all duration-200 hover:border-gray-500 hover:shadow-md">
    <h2 className="text-md font-medium text-gray-700">{file.name}</h2>
    <p className="text-sm text-gray-400 mt-1">Records: {file.total}</p>

    <div className="flex gap-3 mt-4">
      <IconButton
        icon={Download}
        label="Download"
        onClick={onDownload}
        color="blue"
      />
      <IconButton
        icon={Trash2}
        label="Delete"
        onClick={onDelete}
        color="red"
      />
    </div>
  </div>
);

export default FileCard;