import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from './controllers/auth.js';
import { createPost } from './controllers/posts.js';
import { verifyToken } from "./middleware/auth.js";
// import { users, posts } from "./data/index.js";
// import User from "./models/user.js";
// import Post from "./models/Post.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);  // Get current file name
const __dirname = path.dirname(__filename); // Get current directory
dotenv.config();    // Load environment variables from .env file
const app = express();  // Initialize express app
app.use(express.json());    // Parse JSON bodies
app.use(helmet());  // Set security HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Set cross-origin resource policy
app.use(morgan("common"));  // Log HTTP requests
app.use(bodyParser.json({ limit: "30mb", extended: true }));  // Parse JSON bodies
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));  // Parse URL-encoded bodies
app.use(cors());    // Enable CORS
app.use('/assets', express.static(path.join(__dirname, 'public/assets'))); // Set the directory for static assets

/* FILE STORAGE */

// Set the directory for storing files (copied from multer docs)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register); // Register user with image
app.post("/posts", verifyToken, upload.single("picture"), createPost); // Create post with image
/* ROUTES WITHOUT FILES */
app.use("/auth", authRoutes);   // Auth routes
app.use("/users", userRoutes);  // User routes
app.use("/posts", postRoutes);  // Post routes

/* MOMGOOSE CONNECTION */
const PORT = process.env.PORT || 6001;
// mongoose.set("strictQuery", true);  // Enable strict query
console.log(`Connecting to MongoDB...`)
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => {console.log(`Server running on port: ${PORT}`)});

    /* ADD THE DATE ONE TIME*/
    // User.insertMany(users); // Insert users
    // Post.insertMany(posts); // Insert posts
}).catch((error) => console.log(`Connection error: ${error.message}`));
