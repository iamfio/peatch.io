const { Schema, model } = require("mongoose");

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
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profile: {
      firstName: String,
      lastName: String,
      bio: String,
      userpic: String,
      userpicPath: {
        type: String,
        default: "https://picsum.photos/200/200?grayscale"
      },
      userpicPublicId: String,
      address: {
        street: String,
        houseNr: String,
        city: String,
        zipCode: String,
        country: String,
      },
    },

    peatches: [{ type: Schema.Types.ObjectId, ref: "Peatch" }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
