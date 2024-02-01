const express = require('express'); // Creates an Express server
const router = express.Router(); // Creates a router object
const Post = require('../models/post'); // Import the Post model
const Country = require('../models/country'); // Import the Country model
const User = require('../models/user'); //  Import the User model
const isAuthenticated = require('../middleware/is-authenticated'); // Import the isAuthenticated middleware

// Helper function to format post data
function formatPostData(post) {
    return {
        id: post.id,
        title: post.title,
        author: post.author,
        content: post.content,
        mainImage: post.mainImage,
        additionalImages: post.additionalImages,
        country: post.country ? {
            name: post.country.name,
            flag: post.country.flags.png,
            population: post.country.population,
            region: post.country.region,
            subregion: post.country.subregion,
            alfa3Code: post.country.alpha3Code,
            nativeName: post.country.nativeName,
            capital: post.country.capital,
            currencies: post.country.currencies.map(c => `${c.name} (${c.symbol})`).join(', '),
            languages: post.country.languages.map(lang => lang.name).join(', '),
            area: post.country.area,
            independent: post.country.independent,
            numericCode: post.country.numericCode,
        } : {},
        city: post.city,
        likes: post.likes,
        comments: post.comments.map(comment => ({
            _id: comment._id,
            author: comment.author,
            content: comment.content,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt
        })),
        createdAt: post.createdAt
    };
}

// Route to get all posts with country details
router.get('/post', async (req, res) => {
    try {
        const posts = await Post.find({}).populate('country');
        const formattedPosts = posts.map(formatPostData);
        res.json(formattedPosts);
    } catch (error) {
        res.status(500).send('Error fetching posts:', error);
    }
});

// Route to get posts for a specific user
router.get('/user-posts/:username', async (req, res) => {
    try {

        // Extract username
        const username = req.params.username;

        // Find user by username and populate posts and country details.
        const user = await User.findOne({ username }).populate({
            path: 'posts',
            populate: { path: 'country' }
        });

        // Send 404 error response if user is not found.
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Map user posts to include country details.
        const userPostsWithCountry = user.posts.map(post => {
            const countryDetails = post.country ? {
                name: post.country.name,
                flag: post.country.flags.png
            } : {}; // empty object if country is not present

            return {
                id: post._id,
                title: post.title,
                author: post.author,
                content: post.content,
                country: countryDetails,
                mainImage: post.mainImage,
            };
        });

        res.status(201).json(userPostsWithCountry);
    } catch (error) {
        res.status(500).send('Error fetching user posts:', error);
    }
});

// Route to get a specific post by Id
router.get('/posts/:id', async (req, res) => {
    const postId = req.params.id;

    try {
        const post = await Post.findById(postId).populate('country');

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const formattedPost = formatPostData(post);
        res.status(200).json(formattedPost);

    } catch (error) {
        res.status(500).json({ error: 'Error fetching post' });
    }
});

// A Post request to add a new post
router.post('/add-post',isAuthenticated, async (req, res) => {
    try {
        const { title, author, content, mainImage, additionalImages, country, city } = req.body;
        const countryDoc = await Country.findOne({ name: country });
        if (!countryDoc) {
            return res.status(400).json({ message: 'Country not found' });
        }
        
        const newPost = new Post({
            title,
            author,
            content,
            mainImage,
            additionalImages,
            country: countryDoc._id,
            city
        });
        await newPost.save();

        // Populate the country field
        const populatedPost = await Post.findById(newPost._id).populate('country');
        res.status(201).json({ message: 'The destination added successfully',  post: populatedPost  });
    } catch (error) {
        res.status(500).json({ message: 'Error adding post', error: error.message });
    }
});

// Route to delete a post
router.delete('/posts/:id',isAuthenticated ,async (req, res) => {
    try {
        const postId = req.params.id;
        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;