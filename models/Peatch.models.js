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
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    proposals: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Peatch", peatchSchema);
