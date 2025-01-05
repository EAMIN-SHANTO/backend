// controllers/trendController.js
import Trend from "../models/trend.model.js"


// Create a new trend
export const createTrend = async (req, res) => {
  try {
    const newTrend = new Trend({
      ...req.body,
      user: req.user.id,
      image: req.file ? `/uploads/trends/${req.file.filename}` : null
    });
    await newTrend.save();
    res.status(201).json(newTrend);
  } catch (error) {
    console.error('Error creating trend:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all trends
export const getTrends = async (req, res) => {
  try {
    const trends = await Trend.find()
      .populate('user', 'username role avatar')
      .sort('-createdAt');
    res.status(200).json(trends);
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({ error: error.message });
  }
};



// Delete a trend
export const deleteTrend = async (req, res) => {
  try {
    const trend = await Trend.findById(req.params.id);
    if (!trend) {
      return res.status(404).json({ message: 'Trend not found' });
    }
    await trend.deleteOne();
    res.status(200).json({ message: 'Trend deleted successfully' });
  } catch (error) {
    console.error('Error deleting trend:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update a trend
export const updateTrend = async (req, res) => {
  try {
    const trend = await Trend.findById(req.params.id);
    if (!trend) {
      return res.status(404).json({ message: 'Trend not found' });
    }

    // Update fields
    Object.assign(trend, req.body);
    if (req.file) {
      trend.image = `/uploads/trends/${req.file.filename}`;
    }

    await trend.save();
    res.status(200).json(trend);
  } catch (error) {
    console.error('Error updating trend:', error);
    res.status(500).json({ error: error.message });
  }
};

