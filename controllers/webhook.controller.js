// import User from "../models/user.model.js";
// import Post from "../models/post.model.js";
// import Comment from "../models/comment.model.js";
// import { Webhook } from "svix";
// import dotenv from 'dotenv';
// dotenv.config();

// // console.log("Webhook Secret:", process.env.CLERK_WEBHOOK_SECRET);


// // 
// export const clerkWebHook = async (req, res) => {
//     const payload = req.body;
    
//     // Decode the buffer to a string (assuming the payload is a Buffer)
//     const decodedPayload = Buffer.isBuffer(payload) ? payload.toString() : payload;
  
//     // Parse the string to JSON
//     let jsonPayload;
//     try {
//       jsonPayload = JSON.parse(decodedPayload);
//     } catch (error) {
//       return res.status(400).json({
//         message: "Error parsing the webhook payload",
//         error: error.message,
//       });
//     }
  
//     console.log("Received Webhook Payload:", JSON.stringify(jsonPayload, null, 2)); // Pretty-print the whole payload
  
//     // Check if the 'type' is correctly received
//     if (jsonPayload && jsonPayload.type) {
//       console.log("Payload Type:", jsonPayload.type); // Log the type of the webhook
//     } else {
//       console.log("No 'type' field found in payload");
//     }
  
//     if (jsonPayload && jsonPayload.type === "user.created") {
//       const newUser = new User({
//         clerkUserId: jsonPayload.data.id,
//         username: jsonPayload.data.username || jsonPayload.data.email_addresses[0].email_address,
//         email: jsonPayload.data.email_addresses[0].email_address,
//         img: jsonPayload.data.profile_img_url,
//       });
  
//       try {
//         await newUser.save();
//         return res.status(200).json({ message: "User created successfully" });
//       } catch (err) {
//         console.error("Error saving user:", err);
//         return res.status(500).json({ message: "Failed to save user", error: err });
//       }
//     } else {
//       console.log("Received unsupported webhook type:", jsonPayload.type); // Log the unsupported type
//       return res.status(400).json({
//         message: "Webhook received but type not handled.",
//       });
//     }

  
    
 

    // if (evt.type === "user.created") {
    //     const newUser = new User({
    //       clerkUserId: evt.data.id,
    //       username: evt.data.username || evt.data.email_addresses[0].email_address,
    //       email: evt.data.email_addresses[0].email_address,
    //       img: evt.data.profile_img_url,
    //     });
    
    //     await newUser.save();
    //   }
    
    //   if (evt.type === "user.deleted") {
    //     const deletedUser = await User.findOneAndDelete({
    //       clerkUserId: evt.data.id,
    //     });
    
    //     await Post.deleteMany({user:deletedUser._id})
    //     await Comment.deleteMany({user:deletedUser._id})
    //   }
    
    //   return res.status(200).json({
    //     message: "Webhook received",
    //   });

// };

