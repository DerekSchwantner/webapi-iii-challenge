const express = require("express");
const userRouter = require("./users/userRouter");
const server = express();

server.use(logger);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use("/api/user", userRouter);

//custom middleware
function logger(req, res, next) {
  console.log(`${new Date().toISOString()}] ${req.method} to ${req.url}`);
  next();
}
module.exports = server;
