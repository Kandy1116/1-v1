
import React from 'react';
import Link from 'next/link';
import { books } from '@/src/mock-data';

const BookPage = ({ params }) => {
  const book = books.find((book) => book.id === parseInt(params.id));

  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <div className="book-page">
      <h1>{book.title}</h1>
      <h2>{book.author}</h2>
      <img src={book.image} alt={book.title} />
      <p>Full book content will be displayed here.</p>
      <Link href={`/player/${book.id}`}>
        <button>Listen</button>
      </Link>
    </div>
  );
};

export default BookPage;
