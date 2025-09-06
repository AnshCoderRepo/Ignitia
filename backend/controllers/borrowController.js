const Book = require('../models/Book');

// Borrow a book
const borrowBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (!book.available) {
            return res.status(400).json({ message: 'Book is not available' });
        }

        book.available = false;
        book.borrowedBy = req.user._id;
        book.borrowDate = new Date();

        await book.save();

        res.json({ message: 'Book borrowed successfully', book });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Return a book
const returnBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.available) {
            return res.status(400).json({ message: 'Book is not borrowed' });
        }

        // Check if the user is the one who borrowed the book or an admin
        if (book.borrowedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You can only return books you borrowed' });
        }

        book.available = true;
        book.borrowedBy = null;
        book.borrowDate = null;

        await book.save();

        res.json({ message: 'Book returned successfully', book });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { borrowBook, returnBook };