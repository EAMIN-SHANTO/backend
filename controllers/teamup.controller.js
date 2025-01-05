import TeamUp from "../models/teamup.model.js";
import Comment from "../models/comment.model.js";

// Get all team-up posts
export const getTeamUps = async (req, res) => {
  try {
    const teamUps = await TeamUp.find()
      .populate('user', 'username')
      .populate({
        path: 'comments',
        populate: [
          {
            path: 'user',
            select: 'username'
          },
          {
            path: 'replies',
            populate: {
              path: 'user',
              select: 'username'
            }
          }
        ]
      })
      .sort('-createdAt');
    
    if (!teamUps) {
      return res.status(404).json({ message: "No team-up posts found" });
    }

    res.status(200).json(teamUps);
  } catch (error) {
    console.error('Error in getTeamUps:', error);
    res.status(500).json({ 
      message: "Failed to fetch team-up posts",
      error: error.message 
    });
  }
};

// Create a team-up post
export const createTeamUp = async (req, res) => {
  try {
    const { title, content, category, skills, teamSize, deadline } = req.body;
    
    console.log('Creating teamup with:', { // Debug log
      title,
      content,
      category,
      skills,
      teamSize,
      deadline,
      user: req.user.id
    });

    const newTeamUp = new TeamUp({
      user: req.user.id,
      title,
      content,
      category,
      skills: skills ? skills.split(',').map(skill => skill.trim()) : [],
      teamSize: teamSize ? parseInt(teamSize) : null,
      deadline: deadline || null
    });

    await newTeamUp.save();
    
    const populatedTeamUp = await TeamUp.findById(newTeamUp._id)
      .populate('user', 'username');

    res.status(201).json(populatedTeamUp);
  } catch (error) {
    console.error('Error in createTeamUp:', error);
    res.status(500).json({ 
      message: "Failed to create team-up post",
      error: error.message 
    });
  }
};

// Get single team-up post
export const getTeamUp = async (req, res) => {
  try {
    const teamUp = await TeamUp.findById(req.params.id)
      .populate('user', 'username');

    if (!teamUp) {
      return res.status(404).json({ message: "Team-up post not found" });
    }

    res.status(200).json(teamUp);
  } catch (error) {
    console.error('Error in getTeamUp:', error);
    res.status(500).json({ 
      message: "Failed to fetch team-up post",
      error: error.message 
    });
  }
};

// Toggle bookmark
export const toggleBookmark = async (req, res) => {
  try {
    const teamUp = await TeamUp.findById(req.params.id);
    if (!teamUp) {
      return res.status(404).json({ message: "Team-up post not found" });
    }

    const userId = req.user.id;
    const isBookmarked = teamUp.bookmarks.includes(userId);

    const updatedTeamUp = await TeamUp.findByIdAndUpdate(
      req.params.id,
      {
        [isBookmarked ? '$pull' : '$push']: { bookmarks: userId }
      },
      { new: true }
    );

    res.status(200).json(updatedTeamUp);
  } catch (error) {
    console.error('Error in toggleBookmark:', error);
    res.status(500).json({ 
      message: "Failed to toggle bookmark",
      error: error.message 
    });
  }
};

// Add comment to a post
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.id;
    const userId = req.user.id;

    const teamUp = await TeamUp.findById(postId);
    if (!teamUp) {
      return res.status(404).json({ message: "Team-up post not found" });
    }

    const newComment = new Comment({
      user: userId,
      post: postId,
      content
    });

    await newComment.save();

    // Add comment to post
    teamUp.comments.push(newComment._id);
    await teamUp.save();

    // Fetch updated post with populated comments
    const updatedPost = await TeamUp.findById(postId)
      .populate('user', 'username')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username'
        }
      });

    res.status(201).json(updatedPost);
  } catch (error) {
    console.error('Error in addComment:', error);
    res.status(500).json({ 
      message: "Failed to add comment",
      error: error.message 
    });
  }
};

// Get comments for a post
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate('user', 'username avatar')
      .sort('-createdAt');

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error in getComments:', error);
    res.status(500).json({ 
      message: "Failed to fetch comments",
      error: error.message 
    });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is comment owner
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    // Remove comment from post
    await TeamUp.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id }
    });

    await Comment.findByIdAndDelete(req.params.commentId);

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error('Error in deleteComment:', error);
    res.status(500).json({ 
      message: "Failed to delete comment",
      error: error.message 
    });
  }
};

// Add reply to a comment
export const addReply = async (req, res) => {
  try {
    const { content } = req.body;
    const { id: postId, commentId } = req.params;
    const userId = req.user.id;

    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({ message: "Parent comment not found" });
    }

    const newReply = new Comment({
      user: userId,
      post: postId,
      content,
      parentComment: commentId
    });

    await newReply.save();

    // Add reply to parent comment
    parentComment.replies.push(newReply._id);
    await parentComment.save();

    // Fetch updated post with populated comments and replies
    const updatedPost = await TeamUp.findById(postId)
      .populate('user', 'username')
      .populate({
        path: 'comments',
        populate: [
          {
            path: 'user',
            select: 'username'
          },
          {
            path: 'replies',
            populate: {
              path: 'user',
              select: 'username'
            }
          }
        ]
      });

    res.status(201).json(updatedPost);
  } catch (error) {
    console.error('Error in addReply:', error);
    res.status(500).json({ 
      message: "Failed to add reply",
      error: error.message 
    });
  }
}; 