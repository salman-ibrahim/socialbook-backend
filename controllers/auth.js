import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

/* REGISTER USER */
export const register = async (req, res) => {
    try {
        const { 
                firstName, 
                lastName, 
                email, 
                password,
                picturePath,
                friends,
                location, 
                bio, 
                occupation 
            } = req.body;

            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                picturePath,
                friends,
                location,
                bio,
                occupation,
                viewedProfile: 0,
                impressions: 0,
            });
            const savedUser = await newUser.save();
            res.status(201).json(savedUser); // 201 Signifies that a new resource has been created
    } catch (error) {
        res.status(500).json({ error: error.message }); // 500 Signifies that the server encountered an unexpected condition
    }
}

/* LOGIN USER */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ msg: "User not found" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            res.status(400).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ user, token });
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}