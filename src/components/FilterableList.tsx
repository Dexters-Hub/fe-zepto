"use client"
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Modal from '@/components/Modal';
import Chip from '@/components/Chip';
import dummyData from '@/constants/dummyData';

interface FilterableListProps {
  placeholder?: string;
  maxHeight?: string;
  maxWidth?: string;
}

const FilterableList: React.FC<FilterableListProps> = ({
  placeholder = 'Type here...',
  maxHeight = '400px',
  maxWidth = '300px',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [modalSearchQuery, setModalSearchQuery] = useState<string>('');

  const openModal = () => {
    console.log("Modal opened");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    console.log("New Input Value: " + JSON.stringify(newValue));
    setModalSearchQuery(newValue);

    setModalUsers((prevUsers) =>
      prevUsers.filter((user) => user.toLowerCase().includes(newValue.toLowerCase()))
    );
  };
  
  

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      const trimmedValue = inputValue.trim();
      if (!selectedChips.includes(trimmedValue)) {
        setSelectedChips((prevChips) => [...prevChips, trimmedValue]);
      }
      setInputValue('');
      closeModal(); 
    }
  };

  const handleInputFocus = () => {
    console.log("Input field focused");
    openModal();

    updateModalUsers('');
  };
  

  const handleInputBlur = () => {

    setTimeout(() => {
      if (!inputRef.current?.contains(document.activeElement)) {
        closeModal();
      }
    }, 200);
  };



  const handleOutsideClick = (event: MouseEvent) => {
    if (isModalOpen && inputRef.current && !inputRef.current.contains(event.target as Node)) {
      if (document.activeElement !== inputRef.current) {
        closeModal();
      }
    }
  };

  const handleUserSelect = (userName: string) => {
    if (!selectedChips.includes(userName)) {
      setSelectedChips((prevChips) => [...prevChips, userName]);
  

      setModalUsers((prevUsers) => prevUsers.filter((user) => user !== userName));
    }
  
    if (inputRef.current === document.activeElement) {
      return;
    }

    
  
    closeModal();
  };
  
  

  const [modalUsers, setModalUsers] = useState<string[]>(dummyData.map(user => `${user.name.first} ${user.name.last}`));

  const updateModalUsers = useCallback((searchQuery: string) => {
    setModalUsers((prevUsers) =>
      prevUsers.filter((user) => user.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, []);

  const handleChipDelete = (index: number) => {
    const deletedChip = selectedChips[index];
    setSelectedChips((prevChips) => prevChips.filter((_, i) => i !== index));

    setModalUsers((prevUsers) => [...prevUsers, deletedChip]);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

useEffect(() => {
  console.log("Modal is open:", isModalOpen);


  if (!isModalOpen) {
    setModalSearchQuery('');
  }
}, [isModalOpen]);


  return (
    <div className="p-24 mt-24 border rounded-md w-1/2 relative">
      <h2 className="text-2xl font-bold mb-8">Pick Users</h2>
      <div className="flex flex-wrap relative border-b-2 border-gray-300">
        <div className="flex flex-wrap">
          {selectedChips.map((chip, index) => (
            <Chip
              key={index}
              label={chip}
              onDelete={() => handleChipDelete(index)}
            />
          ))}
        </div>
        <div className="flex-grow">
          <input
            ref={inputRef}
            className="pr-4 py-2 ml-2 flex-grow focus:outline-none min-w-0"
            type="text"
            placeholder={selectedChips.length > 0 ? '' : placeholder}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            value={inputValue}
            onChange={(e) => {
              handleInputChange(e);
              updateModalUsers(e.target.value);
            }}
            onKeyDown={handleInputKeyDown}
          />
          {isModalOpen && document.activeElement === inputRef.current && (
            <Modal
              maxWidth={maxWidth}
              maxHeight={maxHeight}
              users={modalUsers}
              onUserSelect={handleUserSelect}
              searchQuery={modalSearchQuery}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterableList;
