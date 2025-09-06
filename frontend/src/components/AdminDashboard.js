import React, { useState, useEffect } from 'react';
import { getAllBooks, addBook } from '../services/api';

const AdminDashboard = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        isbn: ''
    });

    useEffect(() => {
        fetchAllBooks();
    }, []);

    const fetchAllBooks = async () => {
        try {
            const response = await getAllBooks();
            setBooks(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch books');
            setLoading(false);
        }
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            await addBook(newBook);
            setNewBook({ title: '', author: '', isbn: '' });
            setShowAddForm(false);
            fetchAllBooks();
        } catch (error) {
            console.error('Failed to add book');
        }
    };

    const handleChange = (e) => {
        setNewBook({
            ...newBook,
            [e.target.name]: e.target.value
        });
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>

            <button onClick={() => setShowAddForm(!showAddForm)}>
                {showAddForm ? 'Cancel' : 'Add New Book'}
            </button>

            {showAddForm && (
                <form onSubmit={handleAddBook} className="add-book-form">
                    <h3>Add New Book</h3>
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={newBook.title}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="author"
                        placeholder="Author"
                        value={newBook.author}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="isbn"
                        placeholder="ISBN"
                        value={newBook.isbn}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Add Book</button>
                </form>
            )}

            <h3>All Books</h3>
            <div className="books-list">
                {books.map(book => (
                    <div key={book._id} className="book-item">
                        <h4>{book.title}</h4>
                        <p>Author: {book.author}</p>
                        <p>ISBN: {book.isbn}</p>
                        <p>Status: {book.available ? 'Available' : 'Borrowed'}</p>
                        {!book.available && (
                            <p>Borrowed by: {book.borrowedBy?.name || 'Unknown'}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;