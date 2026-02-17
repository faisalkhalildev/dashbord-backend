import express from 'express';
import cloudinary from '../utils/cloudinary.js';
import User from '../models/User.js';
import { authMiddleware } from "../middleware/authmiddleware.js"; 

const router = express.Router();

// Get user profile with avatar
router.get('/profile', authMiddleware, async (req, res) => {  // ✅ capital M
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Upload/Update user avatar
router.post('/avatar', authMiddleware, async (req, res) => {  // ✅ capital M
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image provided' 
      });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    if (user.avatarPublicId) {
      try {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      } catch (error) {
        console.log('Error deleting old avatar:', error);
      }
    }

    const result = await cloudinary.uploader.upload(image, {
      folder: `user-avatars/${req.user.id}`,
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' }
      ],
      resource_type: 'auto',
    });

    user.avatar = result.secure_url;
    user.avatarPublicId = result.public_id;
    await user.save();

    res.json({
      success: true,
      url: result.secure_url,
      message: 'Avatar uploaded successfully',
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message,
    });
  }
});

// Delete user avatar
router.delete('/avatar', authMiddleware, async (req, res) => {  // ✅ capital M
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    if (user.avatarPublicId) {
      try {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      } catch (error) {
        console.log('Error deleting from Cloudinary:', error);
      }
    }

    user.avatar = '';
    user.avatarPublicId = '';
    await user.save();

    res.json({
      success: true,
      message: 'Avatar deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting avatar:', error);
    res.status(500).json({
      success: false,
      message: 'Delete failed',
      error: error.message,
    });
  }
});

export { router as uploadRouter };