"use client";
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { useUser } from '@/src/UserContext';
import type { Book } from '@/types';
import './library.css';
import BookCard from '@/src/components/BookCard';
import Skeleton from '@/src/components/Skeleton';

const LibraryPage = () => {
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const [finishedBooks, setFinishedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchUserBooks = async () => {
      if (!user) {
        setLoading(false);
        setSavedBooks([]);
        setFinishedBooks([]);
        return;
      }

      setLoading(true);
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const booksRef = collection(db, "books");

          // Fetch saved books
          if (userData.savedBooks && userData.savedBooks.length > 0) {
            const savedBooksQuery = query(booksRef, where("__name__", "in", userData.savedBooks));
            const savedBooksSnapshot = await getDocs(savedBooksQuery);
            const savedBooksData = savedBooksSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Book);
            setSavedBooks(savedBooksData);
          } else {
            setSavedBooks([]);
          }

          // Fetch finished books
          if (userData.finishedBooks && userData.finishedBooks.length > 0) {
            const finishedBooksQuery = query(booksRef, where("__name__", "in", userData.finishedBooks));
            const finishedBooksSnapshot = await getDocs(finishedBooksQuery);
            const finishedBooksData = finishedBooksSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Book);
            setFinishedBooks(finishedBooksData);
          } else {
            setFinishedBooks([]);
          }
        } else {
          setSavedBooks([]);
          setFinishedBooks([]);
        }
      } catch (error) {
        console.error("Error fetching user books:", error);
        setSavedBooks([]);
        setFinishedBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBooks();
  }, [user]);

  return (
    <div className="library__container">
      {loading ? (
        <div className="library__skeleton-wrapper">
          <Skeleton width="200px" height="32px" />
          <div className="book-list">
            {Array(1).fill(0).map((_, i) => (
              <div className="book-card--skeleton" key={i}>
                <Skeleton width="100%" height="200px" />
                <Skeleton width="80%" height="20px" />
                <Skeleton width="60%" height="16px" />
              </div>
            ))}
          </div>
          <Skeleton width="200px" height="32px" />
          <div className="book-list">
            {Array(1).fill(0).map((_, i) => (
              <div className="book-card--skeleton" key={i}>
                <Skeleton width="100%" height="200px" />
                <Skeleton width="80%" height="20px" />
                <Skeleton width="60%" height="16px" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="library__section">
            <h2 className="library__section-title">Saved Books</h2>
            {savedBooks.length > 0 && <p className="library__section-count">{savedBooks.length} item{savedBooks.length > 1 ? 's' : ''}</p>}
            {savedBooks.length > 0 ? (
              <div className="book-list">
                {savedBooks.map(book => <BookCard book={book} key={book.id} />)}
              </div>
            ) : (
              <p className="library__empty-message">You have no saved books.</p>
            )}
          </div>

          <div className="library__section">
            <h2 className="library__section-title">Finished</h2>
            {finishedBooks.length > 0 && <p className="library__section-count">{finishedBooks.length} item{finishedBooks.length > 1 ? 's' : ''}</p>}
            {finishedBooks.length > 0 ? (
              <div className="book-list">
                {finishedBooks.map(book => <BookCard book={book} key={book.id} />)}
              </div>
            ) : (
              <p className="library__empty-message">You have not finished any books yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LibraryPage;
