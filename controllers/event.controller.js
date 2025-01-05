import Event from "../models/event.model.js";

// Create event
export const createEvent = async (req, res) => {
  try {
    const newEvent = new Event({
      ...req.body,
      user: req.user.id,
      image: req.file?.filename
    });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all events with filters
export const getEvents = async (req, res) => {
  try {
    const { type, organizer, from, to } = req.query;
    let query = {};
    
    if (type) query.type = type;
    if (organizer) query.organizer = organizer;
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    const events = await Event.find(query)
      .populate('user', 'username')
      .sort('-date');
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add achievement
export const addAchievement = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    event.achievements.push(req.body);
    await event.save();
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Register for event
export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event.participants.includes(req.user.id)) {
      event.participants.push(req.user.id);
      await event.save();
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Handle tags
    if (updateData.tags) {
      try {
        updateData.tags = JSON.parse(updateData.tags);
      } catch (e) {
        console.error('Error parsing tags:', e);
        return res.status(400).json({ message: 'Invalid tags format' });
      }
    }

    // Handle dates
    try {
      if (updateData.date) {
        updateData.date = new Date(updateData.date);
      }
      if (updateData.deadline) {
        updateData.deadline = updateData.deadline === 'null' ? null : new Date(updateData.deadline);
      }
    } catch (e) {
      console.error('Error parsing dates:', e);
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Handle image
    if (req.file) {
      updateData.image = req.file.filename;
    }

    // Remove null/undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === 'null' || updateData[key] === 'undefined' || updateData[key] === '') {
        delete updateData[key];
      }
    });

    console.log('Update data:', updateData); // For debugging

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { 
        new: true,
        runValidators: true 
      }
    ).populate('user', 'username');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ 
      message: 'Error updating event', 
      error: error.message 
    });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user has permission
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      message: 'Error deleting event', 
      error: error.message 
    });
  }
}; 