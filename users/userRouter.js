const express = require("express");

userDb = require("./userDb");
const router = express.Router();

router.post("/", (req, res) => {});

router.post("/:id/posts", validateUserId, (req, res) => {});

router.get("/", async (req, res) => {
  try {
    const users = await userDb.get();
    res.status(200).json(users);
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: "Error retrieving the users"
    });
  }
});

router.get("/:id", validateUserId, (req, res) => {});

router.get("/:id/posts", validateUserId, (req, res) => {});

router.delete("/:id", validateUserId, (req, res) => {});

router.put("/:id", validateUserId, (req, res) => {});

//custom middleware

function validateUserId(req, res, next) {
  const userId = req.headers.password;
  if (userId && userId === "mellon") {
    next();
  } else {
    next(401);
  }
}

function validateUser(req, res, next) {
  const user = req.body;
  if (!user) {
    res.status(400).json({ message: "missing user data" });
  } else if (!user.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  const post = req.body;
  if (post) {
    next();
  } else {
    next(401);
  }
}

module.exports = router;
