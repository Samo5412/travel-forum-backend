/**
 * Middleware to check if the user is authenticated
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next  The next middleware
 */
const isAuthenticated = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        res.status(401).json({error: 'Unauthorized - Please login' });
    } else {
       next();
    }
};

module.exports = isAuthenticated;