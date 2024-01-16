"use client"
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Modal from '@/components/Modal';
import Chip from '@/components/Chip';
import dummyData from '@/constants/dummyData';

interface User {
  id: number;
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  picture: {
    thumbnail: string;
  };
}

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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [modalSearchQuery, setModalSearchQuery] = useState<string>('');
  const [isInputClicked, setIsInputClicked] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [highlightedChipIndex, setHighlightedChipIndex] = useState<number | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await dummyData;
        setAllUsers(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const openModal = () => {
    console.log("Modal opened");
    setModalSearchQuery('');
  };

  const closeModal = () => {
    console.log("Modal closed");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setModalSearchQuery(newValue);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      setInputValue('');
      closeModal();
    } else if (e.key === 'Backspace' && inputValue === '' && selectedUserIds.length > 0) {
 
      const updatedUserIds = [...selectedUserIds];
      const lastUserId = updatedUserIds.pop();
      setHighlightedChipIndex(updatedUserIds.length > 0 ? updatedUserIds.length - 1 : null);
      setSelectedUserIds(updatedUserIds);
    }
  };


  const handleInputClick = () => {
    console.log("Input field clicked");
    openModal();
  };

  const handleInputBlur = () => {
    console.log("Input field blurred");
    setTimeout(() => {
      if (inputRef.current && !inputRef.current.contains(document.activeElement) && !isInputClicked) {
        closeModal();
      }
      setIsInputClicked(false);
    }, 200);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      closeModal();
    }
  };

  const handleUserSelect = (userId: number) => {
    setSelectedUserIds((prevIds) => [...prevIds, userId]);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);
  
  
  return (
    <div className="p-24 mt-24 border rounded-md w-1/2 relative">
      <h2 className="text-2xl font-bold mb-8">Pick Users</h2>
      <div className="flex flex-wrap relative border-b-2 border-gray-300">
        <div className="flex flex-wrap">
          {selectedUserIds.map((userId, index) => {
            const user = allUsers.find((u) => u.id === userId);
            const userName = user ? `${user.name.first} ${user.name.last}` : '';

            return (
              <Chip
                key={index}
                label={userName}
                onDelete={() => setSelectedUserIds((prevIds) => prevIds.filter((id) => id !== userId))}
                highlight={index === highlightedChipIndex}
              />
            );
          })}
        </div>
        <div className="flex-grow">
          <input
            ref={inputRef}
            className="pr-4 py-2 ml-2 flex-grow focus:outline-none min-w-0"
            type="text"
            placeholder={selectedUserIds.length > 0 ? '' : placeholder}
            onClick={handleInputClick}
            onBlur={handleInputBlur}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
          />
          {inputRef.current && (
            <Modal
              maxWidth={maxWidth}
              maxHeight={maxHeight}
              onUserSelect={handleUserSelect}
              selectedUserIds={selectedUserIds}
              searchQuery={modalSearchQuery}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterableList;
