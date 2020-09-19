const mongoose = require('mongoose');
const config = require('config');

const connectDB = async () => {
    try {
        await mongoose.connect(config.get("mongoURI"), {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, () => console.log(`MongoDB connected...`))
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;