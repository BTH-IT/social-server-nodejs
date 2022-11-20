const mongoose = require("mongoose");

const StorySchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    stories: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

const StoryModel = mongoose.model("Stories", StorySchema);

module.exports = StoryModel;
