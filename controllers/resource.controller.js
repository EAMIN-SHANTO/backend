import Resource from "../models/resource.model.js";
import User from "../models/user.model.js";

export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate('user', 'username _id role')
      .sort({ createdAt: -1 });
    res.status(200).json(resources);
  } catch (err) {
    console.error('Error fetching resources:', err);
    res.status(500).json({ error: "Failed to fetch resources" });
  }
};

export const createResource = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated!" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    const newResource = new Resource({
      user: userId,
      img: req.file?.filename,
      ...req.body
    });

    const resource = await newResource.save();

    // Update user's contributedResources array
    await User.findByIdAndUpdate(userId, {
      $push: { contributedResources: resource._id }
    });

    res.status(201).json(resource);
  } catch (err) {
    console.error('Error creating resource:', err);
    res.status(500).json({ error: "Failed to create resource", details: err.message });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const resourceId = req.params.id;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    const isAdmin = userRole === 'admin';
    const isStaff = userRole === 'staff';
    const isOwner = resource.user.toString() === userId;

    if (!isAdmin && !isStaff && !isOwner) {
      return res.status(403).json({ error: "Not authorized to delete this resource" });
    }

    await Resource.findByIdAndDelete(resourceId);
    
    await User.findByIdAndUpdate(userId, {
      $pull: { contributedResources: resourceId }
    });

    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete resource" });
  }
};

export const updateDownloadCount = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    resource.downloads += 1;
    await resource.save();

    res.status(200).json({ downloads: resource.downloads });
  } catch (err) {
    res.status(500).json({ error: "Failed to update download count" });
  }
};

export const updateResource = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const resourceId = req.params.id;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    const isAdmin = userRole === 'admin';
    const isStaff = userRole === 'staff';
    const isOwner = resource.user.toString() === userId;

    if (!isAdmin && !isStaff && !isOwner) {
      return res.status(403).json({ error: "Not authorized to update this resource" });
    }

    const updatedResource = await Resource.findByIdAndUpdate(
      resourceId,
      {
        ...req.body,
        // Preserve the original user
        user: resource.user
      },
      { new: true }
    ).populate('user', 'username _id');

    res.status(200).json(updatedResource);
  } catch (err) {
    console.error('Error updating resource:', err);
    res.status(500).json({ error: "Failed to update resource" });
  }
}; 