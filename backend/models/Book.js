const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    isbn: {
        type: String,
        required: true,
        unique: true,
    },
    totalCopies: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },
    availableCopies: {
        type: Number,
        required: true,
        default: 1,
        min: 0
    },
    borrowers: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        borrowDate: {
            type: Date,
            default: Date.now,
        },
        dueDate: {
            type: Date,
        },
        returned: {
            type: Boolean,
            default: false,
        },
        returnDate: {
            type: Date,
        }
    }]
}, {
    timestamps: true,
});

// Method to check if a user can borrow this book
bookSchema.methods.canBorrow = function (userId) {
    // Check if user already has this book borrowed and not returned
    const activeBorrow = this.borrowers.find(
        b => b.user.toString() === userId.toString() && !b.returned
    );

    return this.availableCopies > 0 && !activeBorrow;
};

// Method to borrow a book
bookSchema.methods.borrow = function (userId) {
    if (!this.canBorrow(userId)) {
        throw new Error('Cannot borrow this book');
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks from now

    this.borrowers.push({
        user: userId,
        borrowDate: new Date(),
        dueDate: dueDate
    });

    this.availableCopies -= 1;

    return this.save();
};

// Method to return a book
bookSchema.methods.return = function (userId) {
    const borrowRecord = this.borrowers.find(
        b => b.user.toString() === userId.toString() && !b.returned
    );

    if (!borrowRecord) {
        throw new Error('No active borrow record found for this user');
    }

    borrowRecord.returned = true;
    borrowRecord.returnDate = new Date();
    this.availableCopies += 1;

    return this.save();
};

module.exports = mongoose.model('Book', bookSchema);