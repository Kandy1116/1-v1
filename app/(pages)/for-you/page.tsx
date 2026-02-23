'use client';
import React, { useState, useEffect } from 'react';
import BookPill from '@/src/components/BookPill';
import Skeleton from '@/src/components/Skeleton';
import { Book } from '@/src/types';
import './for-you.css';
import { BsFillPlayFill } from 'react-icons/bs';
import Link from 'next/link';

const ForYouPage = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const [selectedRes, recommendedRes, suggestedRes] = await Promise.all([
          fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected'),
          fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended'),
          fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested'),
        ]);
        
        const selectedData = await selectedRes.json();
        const recommendedData = await recommendedRes.json();
        const suggestedData = await suggestedRes.json();

        setSelectedBook(selectedData[0]);
        setRecommendedBooks(recommendedData);
        setSuggestedBooks(suggestedData);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="for-you__wrapper">
        <div className="for-you__container">
            {loading ? (
                <div className="foryou__container">
                    <div className="foryou__title"><Skeleton width="200px" height="24px" /></div>
                    <Skeleton width="100%" height="200px" />
                    <div className="foryou__title"><Skeleton width="250px" height="24px" /></div>
                    <div className="foryou__books-grid">
                        {Array(3).fill(0).map((_, i) => <Skeleton key={i} width="100%" height="200px" />)}
                    </div>
                    <div className="foryou__title"><Skeleton width="220px" height="24px" /></div>
                    <div className="foryou__books-grid">
                        {Array(3).fill(0).map((_, i) => <Skeleton key={i} width="100%" height="200px" />)}
                    </div>
                </div>
            ) : (
                <>
                    <div className="foryou__title">Selected just for you</div>
                    {selectedBook && (
                        <Link href={`/book/${selectedBook.id}`} className="selected-book__link">
                            <div className="selected-book__wrapper">
                                <div className="selected-book__sub-title">{selectedBook.subTitle}</div>
                                <div className="selected-book__details">
                                    <figure className="selected-book__image--wrapper">
                                        <img src={selectedBook.imageLink} alt={selectedBook.title} className="selected-book__image" />
                                    </figure>
                                    <div className="selected-book__text">
                                        <div className="selected-book__title">{selectedBook.title}</div>
                                        <div className="selected-book__author">{selectedBook.author}</div>
                                        <div className="selected-book__audio">
                                            <div className="selected-book__play-icon">
                                                <BsFillPlayFill />
                                            </div>
                                            <span>3 mins 23 secs</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}

                    <div className="foryou__title">Recommended For You</div>
                    <div className="foryou__sub-title">We think you'll like these</div>
                    <div className="foryou__books-grid">
                        {recommendedBooks.map(book => <BookPill key={book.id} book={book} />)}
                    </div>

                    <div className="foryou__title">Suggested Books</div>
                    <div className="foryou__sub-title">Browse those books</div>
                    <div className="foryou__books-grid">
                        {suggestedBooks.map(book => <BookPill key={book.id} book={book} />)}
                    </div>
                </>
            )}
        </div>
    </div>
  );
};

export default ForYouPage;
