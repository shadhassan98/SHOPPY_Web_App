const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDB = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      //useCreateIndex: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`MongoDB connected to server : ${data.connection.host}`);
    });
  // .catch((err) => {
  //   console.log(err);
  // });
};

module.exports = connectDB;
