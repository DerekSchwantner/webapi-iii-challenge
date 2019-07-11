const express = require("express");
const userRouter = require("./users/userRouter");
const postRouter = require("./posts/postRouter");
const morgan = require("morgan");
const server = express();
server.use(express.json());

server.use(logger);
server.use(morgan("dev"));

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use("/api/user", userRouter);
server.use("/api/posts", postRouter);

//custom middleware
function logger(req, res, next) {
  console.log(`${new Date().toISOString()}] ${req.method} to ${req.url}`);
  next();
}
module.exports = server;
