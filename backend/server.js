const path = require("path");
const dotenv = require("dotenv");
const app = require("./app");
const connectDB = require("./config/database");
const { Server } = require("http");
const cloudinary = require("cloudinary");

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is listening on http://localhost:${process.env.PORT}`);
});

//Unhandled Uncaught Exceptions(if something is not defined)
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exceptions`);

  server.close(() => {
    process.exit(1);
  });
});

//Declaring dotenv path
//dotenv.config({ path: path.resolve(__dirname, "config/config.env") });

//Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

connectDB(); //connect to mongoDB database..

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on http://localhost:${process.env.PORT}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to your Home Page!!");
});

//Unhandled Promise Rejections(if MongoDb URI is wrong from .env)
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
