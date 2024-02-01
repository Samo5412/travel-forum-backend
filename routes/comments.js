const express = require('express'); // Creates an Express server
const router = express.Router(); // Creates a router object
const Post = require('../models/post'); // Import the Post model
const isAuthenticated = require('../middleware/is-authenticated');

// POST route for adding a comment to a post
router.post('/posts/:postId/comments', isAuthenticated, async (req, res) => {
    try {
        const { postId } = req.params;
        const { username, content } = req.body;
    
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (!username) {
            return res.status(400).json({ message: 'Error retrieving username. Please log in again to continue.' });
        }

        if (content) {
            // Create a new comment object with the username from the request body
            const newComment = {
                author: username, 
                content, 
                createdAt: new Date(), 
                updatedAt: new Date()
            };
        
            post.comments.push(newComment);
            await post.save();

            const addedComment = post.comments[post.comments.length - 1];
            
            return res.status(201).json({ message: 'Comment added successfully', comment: addedComment });
        }
    
        return res.status(400).json({ message: 'Content is required' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment',  error: error.message  });
    }
});

// DELETE route for deleting a comment
router.delete('/posts/:postId/comments/delete/:commentId', isAuthenticated, async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const {username} = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (!username) {
            return res.status(400).json({ message: 'Error retrieving username. Please log in again to continue.' });
        }

        // Find the index of the comment to be removed
        const commentIndex = post.comments.findIndex(c => c.id.toString() === commentId);
        if (commentIndex === -1) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Remove the comment from the array
        post.comments.splice(commentIndex, 1);

        await post.save();
        res.status(200).json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
});

// Route to update a specific comment in a post.
router.put('/posts/:postId/comments/update/:commentId', isAuthenticated, async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const { content, username } = req.body; 

        // Validate presence of updated content.
        if (!content) {
            return res.status(400).json({ message: 'Content is required'});
        }

        if (!username) {
            return res.status(400).json({ message: 'Error retrieving username. Please log in again to continue.' });
        }

        const post = await Post.findById(postId);

        // Return 404 if post is not found.
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Find the specific comment in the post.
        const comment = post.comments.id(commentId);
        // Return 404 if comment is not found.
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Update comment content and timestamp.
        comment.content = content;
        comment.updatedAt = new Date();

        // Save the updated post and send a success response.
        await post.save();
        res.status(200).json({ message: 'Comment updated successfully', comment });
    } catch (error) {
        res.status(500).json({ message: 'Error updating comment',  error: error.message  });
    }
});

// Route to like or unlike a post.
router.post('/posts/:postId/like', isAuthenticated, async (req, res) => {
    try {
        const { postId } = req.params;
        const { username } = req.body;

        // Find the post by postId.
        const post = await Post.findById(postId);
        
        // Return 404 if post is not found.
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        if (!username) {
            return res.status(400).json({ message: 'Error retrieving username. Please log in again to continue.' });
        }

        // Check if the user has already liked the post.
        const likeIndex = post.likes.indexOf(username);

        // Add or remove the like based on current state.
        if (likeIndex === -1) {
            post.likes.push(username);
        } else {
            post.likes.splice(likeIndex, 1);
        }

        // Save the updated post and respond with the updated likes.
        await post.save();
        res.status(200).json({ message: 'Like updated', likes: post.likes });
    } catch (error) {
        res.status(500).json({ message: 'Error updating like',  error: error.message });
    }
});

module.exports = router;