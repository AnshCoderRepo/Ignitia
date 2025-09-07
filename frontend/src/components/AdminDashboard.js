import React, { useState, useEffect } from 'react';
import { getAllBooks, addBook, updateBookCopies } from '../services/api';

const AdminDashboard = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        isbn: '',
        totalCopies: 1
    });
    const [copiesInput, setCopiesInput] = useState('');

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
            setNewBook({ title: '', author: '', isbn: '', totalCopies: 1 });
            setShowAddForm(false);
            fetchAllBooks();
        } catch (error) {
            console.error('Failed to add book');
        }
    };

    const handleUpdateCopies = async (bookId) => {
        try {
            await updateBookCopies(bookId, parseInt(copiesInput));
            setEditingBook(null);
            setCopiesInput('');
            fetchAllBooks();
        } catch (error) {
            console.error('Failed to update copies');
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
                    <input
                        type="number"
                        name="totalCopies"
                        placeholder="Total Copies"
                        min="1"
                        value={newBook.totalCopies}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Add Book</button>
                </form>
            )}

            <h3>All Books</h3>
            <div className="books-list">
                {books.map(book => (
                    <div key={book._id} className="book-item admin-book-item">
                        <h4>{book.title}</h4>
                        <p>Author: {book.author}</p>
                        <p>ISBN: {book.isbn}</p>
                        <p>Copies: {book.availableCopies} available of {book.totalCopies} total</p>

                        {editingBook === book._id ? (
                            <div className="edit-copies">
                                <input
                                    type="number"
                                    min="1"
                                    value={copiesInput}
                                    onChange={(e) => setCopiesInput(e.target.value)}
                                    placeholder="New total copies"
                                />
                                <button onClick={() => handleUpdateCopies(book._id)}>Update</button>
                                <button onClick={() => setEditingBook(null)}>Cancel</button>
                            </div>
                        ) : (
                            <button onClick={() => {
                                setEditingBook(book._id);
                                setCopiesInput(book.totalCopies);
                            }}>
                                Edit Copies
                            </button>
                        )}

                        {book.borrowers.filter(b => !b.returned).length > 0 && (
                            <div className="borrowers-list">
                                <h5>Current Borrowers:</h5>
                                {book.borrowers
                                    .filter(b => !b.returned)
                                    .map(borrower => (
                                        <div key={borrower._id} className="borrower-item">
                                            <p>{borrower.user?.name || 'Unknown User'}</p>
                                            <p>Borrowed: {new Date(borrower.borrowDate).toLocaleDateString()}</p>
                                            <p>Due: {new Date(borrower.dueDate).toLocaleDateString()}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;