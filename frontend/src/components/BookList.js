import React, { useState, useEffect } from 'react';
import BookItem from './BookItem';
import SearchBar from './SearchBar';
import { getAvailableBooks, searchBooks } from '../services/api';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await getAvailableBooks();
            setBooks(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch books');
            setLoading(false);
        }
    };

    const handleSearch = async (query) => {
        if (!query.trim()) {
            fetchBooks();
            return;
        }

        try {
            setLoading(true);
            const response = await searchBooks(query);
            setBooks(response.data);
            setLoading(false);
        } catch (error) {
            setError('Search failed');
            setLoading(false);
        }
    };

    if (loading) return <div>Loading books...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="book-list">
            <h2>Available Books</h2>
            <SearchBar onSearch={handleSearch} />
            <div className="books-container">
                {books.length === 0 ? (
                    <p>No books available</p>
                ) : (
                    books.map(book => (
                        <BookItem key={book._id} book={book} onAction={fetchBooks} />
                    ))
                )}
            </div>
        </div>
    );
};

export default BookList;