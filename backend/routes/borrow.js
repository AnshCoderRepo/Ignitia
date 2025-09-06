const express = require('express');
const { borrowBook, returnBook } = require('../controllers/borrowController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/borrow/:id', protect, borrowBook);
router.post('/return/:id', protect, returnBook);

module.exports = router;