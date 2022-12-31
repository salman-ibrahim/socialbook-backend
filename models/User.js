import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            maxlength: 255,
        },
        password: {
            type: String,
            required: true,
            min: 8,
        },
        picturePath: {
            type: String,
            default: ""
        },
        friends: {
            type: Array,
            default: []
        },
        location: String,
        bio: String,
        occupation: String,
        viewedProfile: Number,
        impressions: Number,
    }, { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;