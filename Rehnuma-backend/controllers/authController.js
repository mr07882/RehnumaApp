const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { name, email, address, phone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, address, phone, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Signup failed', error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user });

  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('plans'); 

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch profile', error });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { name, address, phone, location, nearbySupermarkets } = req.body;
    const updateFields = { name, address, phone };
    
 
    if (location) updateFields.location = location;
    if (nearbySupermarkets) updateFields.nearbySupermarkets = nearbySupermarkets;

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      updateFields,
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error });
  }
};


exports.sendResetCode = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit PIN
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.resetCode = code;
    user.resetCodeExpires = expiry;
    await user.save();

    await sendEmail(email, 'Your Rehnuma Reset Code', `Your OTP is: ${code}`);
    res.json({ message: 'Reset code sent to email' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send reset code', error: err });
  }
};

exports.resetPasswordWithCode = async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.resetCode !== code || Date.now() > user.resetCodeExpires) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reset password', error: err });
  }
};
  

exports.updateUserProfile = async (req, res) => {
  try {
    const { name, address, phone, location, nearbySupermarkets } = req.body;
    const updateFields = { name, address, phone };
    
    if (location) updateFields.location = location;
    if (nearbySupermarkets) {
      updateFields.nearbySupermarkets = nearbySupermarkets.map(sm => ({
        name: sm.name,
        address: sm.address,
        location: sm.location
      }));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      updateFields,
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error });
  }
};


exports.savePlan = async (req, res) => {
  try {
    const { planName, planData } = req.body;
    
    if (!planName?.trim() || !planData) {
      return res.status(400).json({ 
        message: 'Plan name and data are required' 
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $push: { plans: { 
        name: planName.trim(), 
        data: planData 
      }}},
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Plan saved successfully' });
    
  } catch (error) {
    console.error('Save plan error:', error);
    res.status(500).json({ 
      message: 'Failed to save plan',
      error: error.message 
    });
  }
};

exports.deletePlans = async (req, res) => {
  try {
    const { planIds } = req.body;

    if (!planIds || !Array.isArray(planIds)) {
      return res.status(400).json({ message: 'Invalid plan IDs' });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $pull: { plans: { _id: { $in: planIds } } } }, 
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Plans deleted successfully', plans: user.plans });
  } catch (error) {
    console.error('Delete plans error:', error);
    res.status(500).json({ message: 'Failed to delete plans', error });
  }
};