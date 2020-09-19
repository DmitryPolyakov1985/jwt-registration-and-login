const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, config.get("jwtSecret"), (err, decodedToken) => {
            if (err) {
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                next();
            }
        })
    } else {
        res.redirect('/login');
    }
}

const checkUser = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, config.get('jwtSecret'), async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next();
            } else {
                let user = await User.findById(decodedToken.id)
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = {
    requireAuth,
    checkUser
};