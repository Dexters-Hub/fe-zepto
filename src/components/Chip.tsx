
import React from 'react';

interface ChipProps {
  label: string;
  onDelete: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, onDelete }) => {
  return (
    <div className="flex items-center bg-gray-300 text-gray-600 rounded-full px-3 py-1 m-1">
      <span className="mr-2">{label}</span>
      <button type="button" className="focus:outline-none" onClick={onDelete}>
        &times;
      </button>
    </div>
  );
};

export default Chip;
