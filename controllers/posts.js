import Post from "../models/Post.js";
import User from "../models/user.js";
/* CREATE */
export const createPost = async (req, res) => {
    const { userId, description, picturePath } = req.body;
    try {
        const user = await User.findById(userId);

        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            description,
            picturePath,
            location: user.location,
            userPicturePath: user.picturePath,
            likes: {},
            comments: [],
        });

        await newPost.save();
        
        const posts  = await Post.find(); // All the posts with the new post

        res.status(201).json(posts);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getUserPosts = async (req, res) => {
    const { userId } = req.params;
    try {
        const posts = await Post.find({ userId })
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

/* UPDATE */
export const likePost = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);
        if (isLiked) {
            post.likes.set(userId, false);
        } else {
            post.likes.set(userId, true);
        }

        const updatePost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        )
        
        res.status(200).json(updatePost);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}