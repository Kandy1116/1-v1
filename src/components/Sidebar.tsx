
import React from 'react';
import Link from 'next/link';
import './Sidebar.css';
import SearchBar from './SearchBar';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <h2>Summarist</h2>
      </div>
      <SearchBar />
      <ul className="sidebar__links">
        <li>
          <Link href="/for-you">
            For You
          </Link>
        </li>
        <li>
          <Link href="/library">
            Library
          </Link>
        </li>
        <li>
          <Link href="/">
                  Home
                </Link>
        </li>
        <li>
          <Link href="/choose-plan">
            Choose Plan
          </Link>
        </li>
        <li>
          <Link href="/settings">
            Settings
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
