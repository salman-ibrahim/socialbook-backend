import User from '../models/user.js';

/* READ */
export const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getUserFriends = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);

        var friends = [];
        if(user.friends.length > 0) {
            friends = await Promise.all(
                user.friends.map((friendId) => {
                    return User.findById(friendId);
                })
            );
        }
        const formattedFriends = friends.map((friend) => {
            return {
                _id: friend._id,
                firstName: friend.firstName,
                lastName: friend.lastName,
                picturePath: friend.picturePath,
                location: friend.location,
                occupation: friend.occupation,
            };
        });
        res.status(200).json(formattedFriends);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    const { id, friendId } = req.params;
    try {
        if(id === friendId) {
            res.status(400).json({ message: "You can't add yourself as a friend" })
        }
        else {

            const user = await User.findById(id);
            const friend = await User.findById(friendId);
    
            if (user.friends.includes(friendId)) {
                user.friends = user.friends.filter((id) => id !== friendId);
                friend.friends = friend.friends.filter((id) => id !== id);
            }
            else {
                user.friends.push(friendId);
                friend.friends.push(id);
            }
            await user.save();
            await friend.save();
    
            // Fetch all friends
            var friends = [];
            if(user.friends.length > 0) {
                friends = await Promise.all(
                    user.friends.map((friendId) => {
                        return User.findById(friendId);
                    })
                );
            }
            const formattedFriends = friends.map((friend) => {
                return {
                    _id: friend._id,
                    firstName: friend.firstName,
                    lastName: friend.lastName,
                    picturePath: friend.picturePath,
                    location: friend.location,
                    occupation: friend.occupation,
                };
            });
    
            res.status(200).json(formattedFriends);
        }

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}