import Club from "../models/club.model.js";

// Create a new club
export const createClub = async (req, res) => {
  try {
    const newClub = new Club({
      ...req.body,
      image: req.file ? `/uploads/clubs/${req.file.filename}` : undefined
    });
    await newClub.save();
    res.status(201).json(newClub);
  } catch (error) {
    console.error('Error creating club:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all clubs
export const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find({ status: 'active' }).sort('name');
    res.status(200).json(clubs);
  } catch (error) {
    console.error('Error fetching clubs:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get a single club
export const getClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    res.status(200).json(club);
  } catch (error) {
    console.error('Error fetching club:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update a club
export const updateClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Update fields
    Object.assign(club, req.body);
    if (req.file) {
      club.image = `/uploads/clubs/${req.file.filename}`;
    }

    await club.save();
    res.status(200).json(club);
  } catch (error) {
    console.error('Error updating club:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a club
export const deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    await club.deleteOne();
    res.status(200).json({ message: 'Club deleted successfully' });
  } catch (error) {
    console.error('Error deleting club:', error);
    res.status(500).json({ error: error.message });
  }
};
  