
import React from 'react';
import { books } from '@/src/mock-data';
import BookPill from '@/src/components/BookPill';

const LibraryPage = () => {
  return (
    <div className="library-page">
      <h1>My Library</h1>
      <div className="library-page__section">
        <h2>Saved Books</h2>
        <div className="library-page__books">
          {books.map((book) => (
            <BookPill key={book.id} book={book} />
          ))}
        </div>
      </div>
      <div className="library-page__section">
        <h2>Finished Books</h2>
        <div className="library-page__books">
          {books.map((book) => (
            <BookPill key={book.id} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;
