const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Mongoose sub-schema that represents a comment on a post
 */
const commentSchema = new Schema({
    author: String,
    content: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

/**
 * Mongoose Schema that represents an individual post
 */
const postSchema = new mongoose.Schema({
    title: String,
    author: String,
    content: String,
    mainImage: String,
    additionalImages: [String],
    country: {
        type: Schema.Types.ObjectId, // Reference to the Country schema
        ref: 'Country'
    },
    city: String,
    likes: [String],
    comments: [commentSchema],
    createdAt: { type: Date, default: Date.now }
});


// Create a model from the schema
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
