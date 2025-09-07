const Book = require('../models/Book');

// Borrow a book
const borrowBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (!book.canBorrow(req.user._id)) {
            return res.status(400).json({
                message: book.availableCopies > 0
                    ? 'You already have this book borrowed'
                    : 'No copies available'
            });
        }

        await book.borrow(req.user._id);

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

        await book.return(req.user._id);

        res.json({ message: 'Book returned successfully', book });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { borrowBook, returnBook };