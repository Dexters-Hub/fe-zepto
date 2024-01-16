import React from 'react';

interface ChipProps {
  label: string;
  onDelete: () => void;
  highlight?: boolean;
}

const Chip: React.FC<ChipProps> = ({ label, onDelete, highlight = false }) => {
  const chipClassName = `flex items-center rounded-full px-3 py-1 m-1 text-xs ${highlight ? 'border-blue-500 border' : 'bg-gray-300 text-gray-600'}`;

  return (
    <div className={chipClassName}>
      <span className={`mr-2 ${highlight ? 'text-blue-500' : ''}`}>{label}</span>
      <button type="button" className="focus:outline-none" onClick={onDelete}>
        &times;
      </button>
    </div>
  );
};

export default Chip;
