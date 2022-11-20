const mongoose = require("mongoose");
const StoryModel = require("../Models/StoryModel");
const UserModel = require("../Models/UserModel");
const { verifyToken } = require("./AuthController");

async function createStory(req, res) {
  if (!verifyToken(req)) {
    return res.status(401).json("Token expired");
  }
  const newStory = new StoryModel(req.body);

  try {
    await newStory.save();
    res.status(200).json("Post created");
  } catch (error) {
    res.status(500).json(error.message);
  }
}

async function getStory(req, res) {
  if (!verifyToken(req)) {
    return res.status(401).json("Token expired");
  }
  const storyId = req.params.id;

  try {
    const story = await StoryModel.findById(storyId);
    res.status(200).json(story);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

async function updateStory(req, res) {
  if (!verifyToken(req)) {
    return res.status(401).json("Token expired");
  }
  const storyId = req.params.id;
  const { userId } = req.body;

  try {
    const story = await StoryModel.findById(storyId);

    if (story.userId === userId) {
      await story.updateOne({ $set: req.body });
      res.status(200).json("Update successfully");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
}

async function deleteStory(req, res) {
  if (!verifyToken(req)) {
    return res.status(401).json("Token expired");
  }
  const storyId = req.params.id;
  const { userId } = req.body;

  try {
    const story = await StoryModel.findById(storyId);

    if (story.userId === userId) {
      await story.deleteOne();
      res.status(200).json("Delete successfully");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
}

async function getTimelineStories(req, res) {
  if (!verifyToken(req)) {
    return res.status(401).json("Token expired");
  }
  const userId = req.params.id;

  try {
    const currentUserStories = await StoryModel.find({ userId: userId });
    const followingStories = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "stories",
          localField: "followings",
          foreignField: "userId",
          as: "followingStories",
        },
      },
      {
        $project: {
          followingStories: 1,
          _id: 0,
        },
      },
    ]);

    res
      .status(200)
      .json(currentUserStories.concat(...followingStories[0].followingStories));
  } catch (error) {
    res.status(500).json(error.message);
  }
}

module.exports = {
  createStory,
  getStory,
  updateStory,
  deleteStory,
  getTimelineStories,
};
