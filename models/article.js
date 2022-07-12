const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: [5, 'Title must be at least 5 characters.'],
        maxlength: [400, 'Title cannot exceed 400 characters.']
    },
    subtitle: {
        type: String,
        required: false,
        minlength: [5, 'Subtitle must be at least 5 characters.']
    },
    description: {
        type: String,
        required: true,
        minlength: [5, 'Description must be at least 5 characters.'],
        maxlength: [5000, 'Description cannot exceed 5000 characters.']
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: {
            values: ['sport', 'games', 'history'],
            message: 'You have to choose one of these roles: sport, games, history.'
        }
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Article', ArticleSchema);