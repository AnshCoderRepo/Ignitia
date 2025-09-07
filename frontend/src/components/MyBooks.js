import React, { useState, useEffect } from 'react';
import { getMyBooks, returnBook } from '../services/api';

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [returning, setReturning] = useState(null);

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      const response = await getMyBooks();
      setBooks(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch your books');
      setLoading(false);
    }
  };

  const handleReturn = async (bookId) => {
    try {
      setReturning(bookId);
      setError('');
      await returnBook(bookId);
      fetchMyBooks(); // Refresh the list
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to return book');
    } finally {
      setReturning(null);
    }
  };

  if (loading) return <div>Loading your books...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="my-books">
      <h2>My Borrowed Books</h2>
      
      {books.length === 0 ? (
        <p>You haven't borrowed any books yet.</p>
      ) : (
        <div className="books-container">
          {books.map(book => (
            <div key={book._id} className="book-item">
              <h3>{book.title}</h3>
              <p>Author: {book.author}</p>
              <p>ISBN: {book.isbn}</p>
              <p>Borrowed on: {new Date(book.borrowDate).toLocaleDateString()}</p>
              <p>Due on: {new Date(book.dueDate).toLocaleDateString()}</p>
              
              <div className="book-actions">
                <button 
                  onClick={() => handleReturn(book._id)} 
                  disabled={returning === book._id}
                >
                  {returning === book._id ? 'Returning...' : 'Return Book'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBooks;