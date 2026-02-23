
import React from 'react';
import { books } from '@/src/mock-data';

const PlayerPage = ({ params }) => {
  const book = books.find((book) => book.id === parseInt(params.id));

  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <div className="player-page">
      <h1>{book.title}</h1>
      <h2>{book.author}</h2>
      <audio controls src="/placeholder-audio.mp3" />
      <p>Book summary will be displayed here.</p>
    </div>
  );
};

export default PlayerPage;
