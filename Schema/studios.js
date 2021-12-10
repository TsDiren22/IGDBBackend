const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudioSchema = new Schema({
  name: {
    type: String,
    validate: {
      validator: (name) => name.length > 3,
      message: "Name must be longer than 3 characters.",
    },
    required: [true, "Name is required."],
  },
  address: {
    type: String,
    required: [true, "Address is required."],
  },
  founder: {
    type: String,
    required: [true, "Founder is required."],
  },
  dateFounded: {
    type: Date,
    required: [true, "Date is required."],
  },
  website: {
    type: String,
    required: [false],
  },
  amountOfEmployees: {
    type: Number,
    required: [true, "Amount of employees is required."],
  },
  user: {
    type: Schema.Types.ObjectId,
    required: [true, "No user available"],
  },
});

const Studio = mongoose.model("studio", StudioSchema);

module.exports = Studio;
