const { Schema, model } = require("mongoose");

const peatchSchema = new Schema(
  {
    topic: {
      type: String,
      required: [true, "name for new peatch is required"],
      unique: true,
    },
    description: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: false,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true,
      },
    ],
    proposals: [
      {
        text: {
          type: String,
          required: [true, "question text is required"],
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
    ],
  },
  {
    timestamps: true,
  }
);

peatchSchema.plugin(require("mongoose-beautiful-unique-validation"));

module.exports = model("Peatch", peatchSchema);
