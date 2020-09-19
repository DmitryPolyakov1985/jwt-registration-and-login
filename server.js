const express = require("express");
const connectDB = require("./config/mongodb");
const cookieParser = require("cookie-parser");
const authRouter = require('./routes/authRouter');
const {
    requireAuth,
    checkUser
} = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 8080;

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection
connectDB();

// routes
app.get('*', checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.use('/', authRouter);

// 404 page
app.use("*", (req, res) => res.render("404"));

app.listen(8080, () => console.log(`Server is up on port ${PORT}`));