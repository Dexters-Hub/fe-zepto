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
  maxHeight?: string;
  maxWidth?: string;
  style?: React.CSSProperties;
  onUserSelect: (userName: string) => void;
  users: string[];
  searchQuery: string;
}

const Modal: React.FC<ModalProps> = ({ maxWidth = '300px', maxHeight = '400px', style = {}, onUserSelect, users, searchQuery }) => {
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
    console.log("Search Query:", searchQuery);
  

    const currentSearchQuery = searchQuery;
  
    const updateFilteredUsers = () => {
      if (currentSearchQuery.trim() === '') {

        setFilteredUsers(allUsers);
      } else {

        const updatedFilteredUsers = allUsers
          .filter((user) => !users.includes(`${user.name.first} ${user.name.last} ${user.email}`))
          .filter((user) =>
            `${user.name.first} ${user.name.last} ${user.email}`.toLowerCase().includes(currentSearchQuery.toLowerCase())
          );
  
        setFilteredUsers(updatedFilteredUsers);
      }
    };

    updateFilteredUsers();
  

    return () => {

    };
  }, [allUsers, users, searchQuery]);
  

  

  console.log("Filtered Users:", filteredUsers);

  return (
    <div
      className="modal-container"
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
            onClick={() => {
              onUserSelect(`${user.name.first} ${user.name.last}`);
            }}
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
