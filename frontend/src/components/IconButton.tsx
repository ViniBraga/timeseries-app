import type { LucideIcon } from 'lucide-react';

type IconButtonProps = {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  color?: 'blue' | 'red' | 'gray';
};

const colorMap = {
  blue: 'text-blue-600 hover:text-blue-800',
  red: 'text-red-600 hover:text-red-800',
  gray: 'text-gray-600 hover:text-gray-800',
};

const IconButton = ({ icon: Icon, label, onClick, color = 'gray' }: IconButtonProps) => {
  return (
    <div className="group relative">
      <button onClick={onClick} className={`${colorMap[color]} transition`}>
        <Icon size={20} />
      </button>
      <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {label}
      </span>
    </div>
  );
};

export default IconButton;