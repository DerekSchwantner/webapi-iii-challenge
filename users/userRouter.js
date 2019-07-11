const express = require("express");

const userDb = require("./userDb");
const postDb = require("../posts/postDb");
const router = express.Router();

router.post("/", validateUser, async (req, res) => {
  console.log("new user is:", req);
  const newUser = req.body;

  if (!newUser) {
    res.status(400).json({
      errorMessage: "Please provide name for the user."
    });
  } else {
    try {
      const userInfo = await userDb.insert(req.body);
      const users = await userDb.get();
      res.status(201).json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "There was an error while saving the user to the database"
      });
    }
  }
});

router.post("/:id/posts", validatePost, async (req, res) => {
  const newPost = req.body;
  console.log("new post is:", newPost);
  if (!newPost) {
    res.status(400).json({
      message: "missing post data"
    });
  } else if (!newPost.text) {
    res.status(400).json({
      message: "missing required text field"
    });
  } else {
    try {
      const postInfo = await postDb.insert({
        ...req.body,
        user_id: req.params.id
      });
      const posts = await postDb.get();
      res.status(201).json(posts);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "There was an error while saving the post to the database"
      });
    }
  }
});

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

router.get("/:id", validateUserId, (req, res) => {
  const id = req.params.id;
  if (id) {
  }
  userDb
    .getById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  const id = req.params.id;
  userDb
    .getUserPosts(id)
    .then(posts => {
      if (posts) {
        res.status(200).json(posts);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." });
    });
});

router.delete("/:id", validateUserId, async (req, res) => {
  try {
    const count = await userDb.remove(req.params.id);
    if (count > 0) {
      res.status(200).json({ message: "The user has been deleted" });
    } else {
      res.status(404).json({ message: "The user could not be found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error removing the user"
    });
  }
});

router.put("/:id", validateUserId, (req, res) => {});

//custom middleware
//found still isnt working
async function validateUserId(req, res, next) {
  console.log("ID:", req.params.id);
  try {
    const found = await userDb.getById(req.params.id);
    console.log("FOUND:", found);
    if (found) {
      next();
    } else {
      res.status(400).json({ message: "invalid user id" });
    }
  } catch (error) {}
  //   const userId = req.params;
}

function validateUser(req, res, next) {
  const user = req.body;
  console.log("time to validate the user");
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
