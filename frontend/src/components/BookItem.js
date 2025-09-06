import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { borrowBook, returnBook } from '../services/api';

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

    const handleReturn = async () => {
        try {
            setLoading(true);
            setError('');
            await returnBook(book._id);
            onAction();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to return book');
        } finally {
            setLoading(false);
        }
    };

    const canReturn = isAuthenticated &&
        (user.role === 'admin' || book.borrowedBy === user._id);

    return (
        <div className="book-item">
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>ISBN: {book.isbn}</p>
            <p>Status: {book.available ? 'Available' : 'Borrowed'}</p>

            {error && <p className="error">{error}</p>}

            <div className="book-actions">
                {book.available ? (
                    <button
                        onClick={handleBorrow}
                        disabled={loading || !isAuthenticated}
                    >
                        {loading ? 'Processing...' : 'Borrow'}
                    </button>
                ) : (
                    canReturn && (
                        <button
                            onClick={handleReturn}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Return'}
                        </button>
                    )
                )}
            </div>
        </div>
    );
};

export default BookItem;