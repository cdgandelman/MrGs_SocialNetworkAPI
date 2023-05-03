const { Thought, User } = require('../models');

const thoughtController = {
  // GET all thoughts
  getAllThoughts: async (req, res) => {
    try {
      const thoughts = await Thought.find().sort({ createdAt: -1 });
      res.status(200).json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET a single thought by its _id
  getThoughtById: async (req, res) => {
    try {
      const thought = await Thought.findById(req.params.thoughtId).populate('reactions').populate('username');
      res.status(200).json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // POST a new thought
  createThought: async (req, res) => {
    try {
      const thought = await Thought.create(req.body);
      await User.findByIdAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: thought._id } },
        { new: true }
      );
      res.status(200).json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // PUT to update a thought by its _id
  updateThoughtById: async (req, res) => {
    try {
      const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, { new: true });
      res.status(200).json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // DELETE to remove a thought by its _id
  removeThoughtById: async (req, res) => {
    try {
      const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
      await User.findByIdAndUpdate(
        { _id: thought.userId },
        { $pull: { thoughts: thought._id } },
        { new: true }
      );
      res.status(200).json({ message: 'Thought deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // POST to create a reaction stored in a single thought's reactions array field
  createReaction: async (req, res) => {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $push: { reactions: req.body } },
        { new: true }
      );
      res.status(200).json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // DELETE to pull and remove a reaction by the reaction's reactionId value
  removeReaction: async (req, res) => {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true }
      );
      res.status(200).json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  }
};

module.exports = thoughtController;
