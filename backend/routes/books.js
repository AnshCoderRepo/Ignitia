const express = require('express');
const { addBook, getAvailableBooks, getAllBooks, searchBooks } = require('../controllers/bookController');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const router = express.Router();

router.get('/available', getAvailableBooks);
router.get('/search', searchBooks);
router.get('/all', protect, roleCheck(['admin']), getAllBooks);
router.post('/', protect, roleCheck(['admin']), addBook);

module.exports = router;