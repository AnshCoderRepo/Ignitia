const Book = require('../models/Book');

// Add new book (Admin only)
const addBook = async (req, res) => {
    try {
        const { title, author, isbn } = req.body;

        const bookExists = await Book.findOne({ isbn });
        if (bookExists) {
            return res.status(400).json({ message: 'Book with this ISBN already exists' });
        }

        const book = await Book.create({
            title,
            author,
            isbn,
        });

        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all available books
const getAvailableBooks = async (req, res) => {
    try {
        const books = await Book.find({ available: true });
        res.json(books);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all books (Admin only)
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('borrowedBy', 'name email');
        res.json(books);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Search books by title or author
const searchBooks = async (req, res) => {
    try {
        const { query } = req.query;
        const books = await Book.find({
            available: true,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } },
            ],
        });
        res.json(books);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { addBook, getAvailableBooks, getAllBooks, searchBooks };