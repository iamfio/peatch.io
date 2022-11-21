const { Schema, model } = require("mongoose");

const proposalSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "question text is required"],
      unique: true,
    },
    isVoted: {
      type: Boolean,
    },
    votes: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Proposal", proposalSchema);
