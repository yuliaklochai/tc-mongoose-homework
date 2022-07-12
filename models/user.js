const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minlength: [4, 'First name must be at least 4 characters.'],
        maxlength: [50, 'First name cannot exceed 50 characters.']
    },
    lastName: {
        type: String,
        required: true,
        minlength: [3, 'First name must be at least 3 characters.'],
        maxlength: [60, 'First name cannot exceed 60 characters.']
    },
    role: {
        type: String,
        required: true,
        enum: {
            values: ['admin', 'writer', 'guest'],
            message: 'You have to choose one of these roles: admin, writer, guest.'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    numberOfArticles: {
        type: Number,
        default: 0
    },
    nickname: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('User', UserSchema);