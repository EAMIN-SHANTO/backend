// import ImageKit from "imagekit";

import Post from "../models/post.model.js";
import User from "../models/user.model.js";
 // Import path to manage the file paths
 // To delete the file if saving fails
 export const getPosts = async (req, res) => {
  try {
      const posts = await Post.find()
          .populate('user', 'username _id')
          .sort({ createdAt: -1 });
      res.status(200).json(posts);
  } catch (err) {
      res.status(500).json({ error: "Failed to fetch posts" });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('user', 'username _id role');
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

export const createPost = async (req, res) => {
  try {
    // Get user ID from the JWT token (set by verifyToken middleware)
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated!" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    let slug = req.body.title.replace(/ /g, "-").toLowerCase();
    let existingPost = await Post.findOne({ slug });
    let counter = 2;

    while (existingPost) {
      slug = `${slug}-${counter}`;
      existingPost = await Post.findOne({ slug });
      counter++;
    }
    
    const newPost = new Post({ 
      user: userId, 
      slug, 
      img: req.file?.filename,
      ...req.body 
    });
    
    const post = await newPost.save();
    
    // Update user's posts array
    await User.findByIdAndUpdate(userId, {
      $push: { posts: post._id }
    });

    console.log('Post created:', post);
    res.status(201).json(post);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: "Failed to create post", details: err.message });
  }
};

// export const deletePost = async (req, res) => {
//     try {
//       const clerkUserId = req.auth.userId;
//       if (!clerkUserId) {
//         return res.status(401).json("Not authenticated!");
//       }
  
//       const user = await User.findOne({ clerkUserId });
//       if (!user) {
//         return res.status(404).json("User not found!");
//       }
  
//       const deletedPost = await Post.findOneAndDelete({
//         _id: req.params.id,
//         user: user._id,
//       });
  
//       if (!deletedPost) {
//         return res.status(404).json({ message: "Post not found or not authorized to delete" });
//       }
  
//       res.status(200).json({ message: "Post deleted successfully", deletedPost });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "An error occurred while deleting the post", error: err.message });
//     }
//   };

export const deletePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if user is admin or post owner
    const isAdmin = userRole === 'admin';
    const isOwner = post.user.toString() === userId;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(postId);
    
    // Remove post reference from user's posts array
    await User.findByIdAndUpdate(userId, {
      $pull: { posts: postId }
    });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete post" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if user is admin or post owner
    const isAdmin = userRole === 'admin';
    const isOwner = post.user.toString() === userId;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Not authorized to update this post" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        ...req.body,
        // Preserve the original user and slug
        user: post.user,
        slug: post.slug
      },
      { new: true }
    ).populate('user', 'username _id role');

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ error: "Failed to update post" });
  }
};

  // const imagekit = new ImageKit({
  //   publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  //   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  //   urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  // });

  export const uploadAuth = async (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
  };