const mongoose = require('mongoose');

const url = `mongodb+srv://it22077288:IT22077288@cluster0.fuzmzrf.mongodb.net/bloodbank?retryWrites=true&w=majority`;

const connectDatabase = async (req, res) => {
    try {
        await mongoose
            .connect(url)
            .then(() => {
                console.log("MongoDB Connected!!");
            });
    } catch (error) {
        console.error("MongoDB Connection Failed");
    }
};
connectDatabase();