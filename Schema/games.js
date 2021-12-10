const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("../Schema/consoles");

const GameSchema = new Schema({
  title: {
    type: String,
    validate: {
      validator: (title) => title.length > 3,
      message: "Title must be longer than 3 characters.",
    },
    required: [true, "Title is required."],
  },
  description: {
    type: String,
    validate: {
      validator: (description) => description.length >= 10,
      message: "Description must be longer than 9 characters",
    },
    required: [true, "Description is required."],
  },
  releaseDate: {
    type: String,
    required: [true, "Release date is required"],
  },
  genre: {
    type: String,
    required: [true, "Genre is required."],
  },
  studio: {
    type: Schema.Types.ObjectId,
    ref: "studio",
    required: [false],
  },
  console: [
    {
      type: Schema.Types.ObjectId,
      ref: "console",
      required: [true, "Console is required."],
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    required: [true, "No user available"],
  },
});

const Game = mongoose.model("game", GameSchema);

module.exports = Game;
