const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");

const handleErrors = (err) => {
    console.log(err.message, err.code);

    const errors = {
        email: "",
        password: "",
    };

    if (err.message.includes("Email is not registered")) {
        errors["email"] = "Email is not registered";
    }

    if (err.message.includes("Incorrect password")) {
        errors["password"] = "Incorrect password";
    }

    if (err.code === 11000) {
        errors["email"] = "Email is already registered";
    }

    if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach(({
            properties
        }) => {
            errors[properties["path"]] = properties["message"];
        });
    }
    return errors;
};

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({
        id
    }, config.get("jwtSecret"), {
        expiresIn: maxAge
    });
};

module.exports.singup_get = (req, res) => {
    res.render("signup");
};

module.exports.login_get = (req, res) => {
    res.render("login");
};

module.exports.singup_post = async (req, res) => {
    const {
        email,
        password
    } = req.body;

    try {
        const user = new User({
            email,
            password
        });
        await user.save();

        const token = createToken(user._id);
        res.cookie("jwt", token, {
            maxAge: maxAge * 1000,
            httpOnly: true
        });

        res.status(201).send({
            user: user._id
        });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(500).json({
            errors
        });
    }
};

module.exports.login_post = async (req, res) => {
    const {
        email,
        password
    } = req.body;

    try {
        const user = await User.login(email, password);

        const token = createToken(user._id);
        res.cookie("jwt", token, {
            maxAge: maxAge * 1000,
            httpOnly: true
        });

        res.status(200).send({
            user: user._id
        });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({
            errors
        });
    }
};

module.exports.logout_get = (req, res) => {
    res.cookie("jwt", "", {
        maxAge: 1,
        httpOnly: true
    });
    res.redirect('/');
}