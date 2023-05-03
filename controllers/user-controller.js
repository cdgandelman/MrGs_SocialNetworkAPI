const { User, Thought } = require('../models');

const userController = {
  // GET all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().populate({
        path: 'thoughts',
        select: '-__v'
      }).populate({
        path: 'friends',
        select: '-__v'
      });
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // GET a single user by its _id and populated thought and friend data
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.userId).populate({
        path: 'thoughts',
        select: '-__v'
      }).populate({
        path: 'friends',
        select: '-__v'
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // POST a new user
  createUser: async (req, res) => {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // PUT to update a user by its _id
  updateUserById: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
        new: true,
        runValidators: true
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // DELETE to remove user by its _id
  deleteUserById: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Remove user's associated thoughts
      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.status(200).json({ message: 'User and associated thoughts deleted!' });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // POST to add a new friend to a user's friend list
  addFriend: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.userId, { $addToSet: { friends: req.params.friendId } }, { new: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },
  // DELETE to remove a friend from a user's friend list
removeFriend: async (req, res) => {
    try {
    const user = await User.findByIdAndUpdate(
    req.params.userId,
    { $pull: { friends: req.params.friendId } },
    { new: true }
    );
    if (!user) {
    return res.status(404).json({ message: 'No user found with this id!' });
    }
    res.status(200).json(user);
    } catch (err) {
    res.status(500).json(err);
    }
    }
    };
    
    module.exports = userController;