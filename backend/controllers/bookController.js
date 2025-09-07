const Book = require('../models/Book');

// Add new book (Admin only)
const addBook = async (req, res) => {
    try {
        const { title, author, isbn, totalCopies } = req.body;

        const bookExists = await Book.findOne({ isbn });
        if (bookExists) {
            return res.status(400).json({ message: 'Book with this ISBN already exists' });
        }

        const book = await Book.create({
            title,
            author,
            isbn,
            totalCopies: totalCopies || 1,
            availableCopies: totalCopies || 1,
        });

        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all available books
const getAvailableBooks = async (req, res) => {
    try {
        const books = await Book.find({ availableCopies: { $gt: 0 } });
        res.json(books);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all books (Admin only)
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('borrowers.user', 'name email');
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
            availableCopies: { $gt: 0 },
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

// Update book copies (Admin only)
const updateBookCopies = async (req, res) => {
    try {
        const { id } = req.params;
        const { totalCopies } = req.body;

        if (!totalCopies || totalCopies < 1) {
            return res.status(400).json({ message: 'Total copies must be at least 1' });
        }

        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Calculate how many copies to add/remove
        const copiesDifference = totalCopies - book.totalCopies;

        book.totalCopies = totalCopies;
        book.availableCopies += copiesDifference;

        // Ensure available copies doesn't go negative
        if (book.availableCopies < 0) {
            book.availableCopies = 0;
        }

        await book.save();

        res.json({ message: 'Book copies updated successfully', book });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get user's borrowed books
const getMyBooks = async (req, res) => {
    try {
        const books = await Book.find({
            'borrowers.user': req.user._id,
            'borrowers.returned': false
        }).populate('borrowers.user', 'name email');

        // Format the response to include borrow details
        const borrowedBooks = books.map(book => {
            const borrowRecord = book.borrowers.find(
                b => b.user._id.toString() === req.user._id.toString() && !b.returned
            );

            return {
                _id: book._id,
                title: book.title,
                author: book.author,
                isbn: book.isbn,
                borrowDate: borrowRecord.borrowDate,
                dueDate: borrowRecord.dueDate
            };
        });

        res.json(borrowedBooks);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    addBook,
    getAvailableBooks,
    getAllBooks,
    searchBooks,
    updateBookCopies,
    getMyBooks
};