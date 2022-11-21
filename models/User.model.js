const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: [true, "password is required"],
    },
    profile: {
      firstName: String,
      lastName: String,
      bio: String,
      userpic: String,
      userpicPath: String,
      userpicPublicId: String,
      address: {
        street: String,
        houseNr: String,
        city: String,
        zipCode: String,
        country: String,
      },
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
