const express = require('express');
const {
    addBook,
    getAvailableBooks,
    getAllBooks,
    searchBooks,
    updateBookCopies,
    getMyBooks
} = require('../controllers/bookController');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const router = express.Router();

router.get('/available', getAvailableBooks);
router.get('/search', searchBooks);
router.get('/all', protect, roleCheck(['admin']), getAllBooks);
router.get('/my-books', protect, getMyBooks);
router.post('/', protect, roleCheck(['admin']), addBook);
router.put('/:id/copies', protect, roleCheck(['admin']), updateBookCopies);

module.exports = router;