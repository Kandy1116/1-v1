"use client";
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/src/firebase';
import Book from '@/src/types/Book';
import './library.css';
import BookPill from '@/src/components/BookPill';
import Skeleton from '@/src/components/Skeleton';

const LibraryPage = () => {
  const [activeTab, setActiveTab] = useState('saved');
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const [finishedBooks, setFinishedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBooks = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoading(true);
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          
          // Fetch saved books
          if (userData.savedBooks && userData.savedBooks.length > 0) {
            const savedBooksPromises = userData.savedBooks.map((bookId: string) => getDoc(doc(db, 'books', bookId)));
            const savedBooksDocs = await Promise.all(savedBooksPromises);
            const savedBooksData = savedBooksDocs.map(doc => ({ ...doc.data(), id: doc.id }) as Book);
            setSavedBooks(savedBooksData);
          }

          // Fetch finished books
          if (userData.finishedBooks && userData.finishedBooks.length > 0) {
            const finishedBooksPromises = userData.finishedBooks.map((bookId: string) => getDoc(doc(db, 'books', bookId)));
            const finishedBooksDocs = await Promise.all(finishedBooksPromises);
            const finishedBooksData = finishedBooksDocs.map(doc => ({ ...doc.data(), id: doc.id }) as Book);
            setFinishedBooks(finishedBooksData);
          }
        }
        setLoading(false);
      } else {
        // Handle user not logged in
        setLoading(false);
      }
    });

    return () => fetchUserBooks();
  }, []);

  return (
    <div className="library__container">
      <div className="library__header">
        <h1 className="library__title">Library</h1>
      </div>
      <div className="library__tabs">
        <button 
          className={`library__tab ${activeTab === 'saved' ? 'library__tab--active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          Saved
        </button>
        <button 
          className={`library__tab ${activeTab === 'finished' ? 'library__tab--active' : ''}`}
          onClick={() => setActiveTab('finished')}
        >
          Finished
        </button>
      </div>
      <div className="library__content">
        {loading ? (
          <div className="book-list">
            {Array(6).fill(0).map((_, i) => (
              <div className="book-pill--skeleton" key={i}>
                <Skeleton width="100%" height="200px" />
                <Skeleton width="80%" height="20px" />
                <Skeleton width="60%" height="16px" />
              </div>
            ))}
          </div>
        ) : (
          <div className="book-list">
            {activeTab === 'saved' && (
              savedBooks.length > 0 ? (
                savedBooks.map(book => <BookPill book={book} key={book.id} />)
              ) : (
                <p className="library__empty-message">You have no saved books.</p>
              )
            )}
            {activeTab === 'finished' && (
              finishedBooks.length > 0 ? (
                finishedBooks.map(book => <BookPill book={book} key={book.id} />)
              ) : (
                <p className="library__empty-message">You have not finished any books yet.</p>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
