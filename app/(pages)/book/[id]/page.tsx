"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Book } from "@/src/types";
import "./book.css";
import { AiFillStar } from "react-icons/ai";
import { FaBookmark, FaRegBookmark, FaHeadphones } from "react-icons/fa";
import Link from "next/link";
import Skeleton from "@/src/components/Skeleton";
import { useUser } from "@/src/UserContext";

const BookPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user, openModal } = useUser();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("summary");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
        );
        const data = await res.json();
        setBook(data);
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  const handleListenClick = () => {
    if (!user) {
        openModal();
        return;
    }
    if (book?.subscriptionRequired) {
        // Assuming we'll add subscription status to the user object later
        // For now, let's simulate a non-subscribed user
        router.push("/choose-plan");
    } else {
        router.push(`/player/${id}`);
    }
  }

  const toggleSaved = () => {
    if (!user) {
        openModal();
        return;
    }
    setIsSaved(!isSaved);
    // Here you would typically also make an API call to save/unsave the book
  };

  return (
    <div className="book__wrapper">
      {loading ? (
        <div className="book__container--skeleton">
            <Skeleton width="100%" height="100%" />
        </div>
      ) : book ? (
        <div className="book__container">
          <div className="book__main-content">
            <div className="book__content">
              <h1 className="book__title">{book.title}</h1>
              <p className="book__author">{book.author}</p>
              <p className="book__sub-title">{book.subTitle}</p>
              <div className="book__details-wrapper">
                <div className="book__details-item">
                  <div className="book__details-icon">
                    <AiFillStar />
                  </div>
                  <span className="book__details-text">
                    {book.averageRating} ({book.totalRating} ratings)
                  </span>
                </div>
                <div className="book__details-item">
                  <div className="book__details-icon">
                    <FaHeadphones />
                  </div>
                  <span className="book__details-text">
                    {book.audioLink}
                  </span>
                </div>
                <div className="book__details-item">
                  <div className="book__details-icon">
                    <FaRegBookmark />
                  </div>
                  <span className="book__details-text">
                    {book.keyIdeas} Key ideas
                  </span>
                </div>
              </div>
              <div className="book__actions">
                <button onClick={handleListenClick} className="book__listen-btn">
                    <div className="book__listen-icon">
                        <FaHeadphones />
                    </div>
                    <span>Listen</span>
                </button>
                <button onClick={toggleSaved} className="book__save-btn">
                  <div className="book__save-icon">
                    {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                  </div>
                  <span>{isSaved ? "Saved" : "Save"}</span>
                </button>
              </div>
            </div>
            <figure className="book__image--wrapper">
              <img
                src={book.imageLink}
                alt={book.title}
                className="book__image"
              />
            </figure>
          </div>
          <div className="book__tabs">
            <button
              className={`book__tab ${
                activeTab === "summary" ? "book__tab--active" : ""
              }`}
              onClick={() => setActiveTab("summary")}
            >
              Summary
            </button>
            <button
              className={`book__tab ${
                activeTab === "author" ? "book__tab--active" : ""
              }`}
              onClick={() => setActiveTab("author")}
            >
              About the Author
            </button>
          </div>
          <div className="book__tab-content">
            {activeTab === "summary" && <p>{book.summary}</p>}
            {activeTab === "author" && <p>{book.authorDescription}</p>}
          </div>
        </div>
      ) : (
        <div>Book not found.</div>
      )}
    </div>
  );
};

export default BookPage;
