"use client";
import dummyData from '@/constants/dummyData';
import React, { useState, useEffect } from 'react';

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

interface ModalProps {
  maxWidth?: string;
  maxHeight?: string;
  style?: React.CSSProperties;
  onUserSelect: (userId: number) => void;
  selectedUserIds: number[];
  searchQuery: string;
}

const Modal: React.FC<ModalProps> = ({ maxWidth = '300px', maxHeight = '400px', style = {}, onUserSelect, selectedUserIds, searchQuery }) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

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

  useEffect(() => {
    const currentSearchQuery = searchQuery.trim().toLowerCase();

    const updatedFilteredUsers = allUsers
      .filter((user) => !selectedUserIds.includes(user.id))
      .filter((user) =>
        `${user.name.first} ${user.name.last} ${user.email}`.toLowerCase().includes(currentSearchQuery)
      );

    setFilteredUsers(updatedFilteredUsers);
  }, [allUsers, selectedUserIds, searchQuery]);

  return (
    <div
      className="modal-container text-xs"
      style={{
        position: 'absolute',
        ...style,
        maxHeight,
        maxWidth,
        overflowY: 'auto',
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
      }}
    >
      <ul>
        {filteredUsers.map((user) => (
          <li
            key={user.id}
            className="flex items-center space-x-2 border p-4 cursor-pointer hover:bg-gray-100"
            onClick={() => onUserSelect(user.id)}
          >
            <img src={user.picture.thumbnail} alt={`${user.name.first} ${user.name.last}`} className="rounded-full w-12 h-12" />
            <div>
              <div className="text-sm">{highlightMatch(`${user.name.first} ${user.name.last} ${user.email}`, searchQuery)}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};



const escapeRegExp = (text: string) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const highlightMatch = (text: string, query: string) => {
  if (!query) return text;

  const escapedQuery = escapeRegExp(query);
  const regex = new RegExp(`(${escapedQuery})`, 'gi');

  return text.split(regex).map((part, index) => {
    return regex.test(part) ? <strong key={index}>{part}</strong> : part;
  });
};

export default Modal;
