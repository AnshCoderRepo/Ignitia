import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { borrowBook } from '../services/api';

const BookItem = ({ book, onAction }) => {
    const { isAuthenticated, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleBorrow = async () => {
        if (!isAuthenticated) {
            setError('Please login to borrow books');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await borrowBook(book._id);
            onAction();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to borrow book');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="book-item">
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>ISBN: {book.isbn}</p>
            <p>Available copies: {book.availableCopies} / {book.totalCopies}</p>

            {error && <p className="error">{error}</p>}

            <div className="book-actions">
                {book.availableCopies > 0 ? (
                    <button
                        onClick={handleBorrow}
                        disabled={loading || !isAuthenticated}
                    >
                        {loading ? 'Processing...' : 'Borrow'}
                    </button>
                ) : (
                    <p className="out-of-stock">No copies available</p>
                )}
            </div>
        </div>
    );
};

export default BookItem;