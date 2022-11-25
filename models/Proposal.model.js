const { Schema, model } = require("mongoose");

const proposalSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "question text is required"],
      // unique: true,
    },
    isVoted: {
      type: Boolean,
      default: false,
    },
    votedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    votes: {
      type: Number,
      default: 0,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Proposal", proposalSchema);
