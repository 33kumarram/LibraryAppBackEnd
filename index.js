const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const ConnectDB = require("./config/db");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

var corsOptions = {
    // origin: "*",
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "https://rkchatapp.netlify.app",
    ],
    credentials: true,
  };
  
  // const io = require('socket.io')(8000)
  dotenv.config();
  const app = express();

  const userRoutes = require("./Routes/userRoutes");
  const bookRoutes = require("./Routes/bookRoutes")

  const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, (req, res) => {
  console.log(`app is listening at port ${PORT}`);
});


ConnectDB();

app.use(express.json()); // to accept json data
app.use(morgan("dev")); // to display hit url in terminal
app.use(cors(corsOptions)); // to accept request from origin specified in cor options

app.use("/users", userRoutes);
app.use("/books", bookRoutes);

app.get("/", (req, res) => {
    res.send("welcome !!!");
  });
  // app.use(express.static("public"));
  
  app.use(notFound);
  
  app.use(errorHandler);
  