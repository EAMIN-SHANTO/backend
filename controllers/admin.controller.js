import User from '../models/user.model.js';
import Event from '../models/event.model.js';
import Resource from '../models/resource.model.js';
import Post from '../models/post.model.js';

export const getStats = async (req, res) => {
  try {
    const [totalUsers, totalEvents, totalResources, totalPosts] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Resource.countDocuments(),
      Post.countDocuments()
    ]);

    res.json({
      totalUsers,
      totalEvents,
      totalResources,
      totalPosts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 