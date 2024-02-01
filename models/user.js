const mongoose = require('mongoose');
const bcrypt = require("bcrypt") // Used to hash the password
const Schema = mongoose.Schema;

const saltRounds = 10

/**
 * Mongoose Schema that represents an individual user.
 */
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    country: { 
        type: Schema.Types.ObjectId, // Reference to the Country schema
        ref: 'Country'
    },
    posts: [{ 
        type: Schema.Types.ObjectId, // Reference to the Post schema
        ref: 'Post' 
    }],
    comments: [{
        post: { 
            type: Schema.Types.ObjectId, 
            ref: 'Post'
        },
        content: String,
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now},
    }]
});

/**
 * Hashes the password before saving it to the database.
 */
userSchema.pre('save', async function(next) {
    // Check if the password is new or hasn't been changed to prevent re-hashing 
    if (this.isModified('password') || this.isNew) {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
    }
    next();
});

/**
 * Validates the user's password
 * @returns True if the password is valid, false otherwise.
 * @param {*} password The password to validate.
 */
userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

// Create a model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
