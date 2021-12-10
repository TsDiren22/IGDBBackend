const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConsoleSchema = new Schema({
  name: {
    type: String,
    validate: {
      validator: (name) => name.length > 3,
      message: "Name must be longer than 3 characters.",
    },
    required: [true, "Name is required."],
  },
  amountOfUser: {
    type: Number,
    validate: {
      validator: (amount) => amount >= 0,
      message: "Amount of users must be higher than 0",
    },
    required: [false],
  },
  dateOfRelease: {
    type: Date,
    validate: {
      validator: (date) => date < Date.now(),
      message: "Date must be in the past.",
    },
    required: [true, "Release date is required"],
  },
  website: {
    type: String,
    required: [false],
  },
  user: {
    type: Schema.Types.ObjectId,
    required: [true, "No user available"],
  },
});

const Console = mongoose.model("console", ConsoleSchema);

module.exports = Console;
