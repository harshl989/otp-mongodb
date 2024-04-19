const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const OTP = require('../models/otpModel');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, otp } = req.body;
    
    if (!name || !email || !password || !otp) {
      return res.status(403).json({
        success: false,
        message: 'All fields are required',
      });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }
    
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).json({
        success: false,
        message: 'The OTP is not valid',
      });
    }
    
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Hashing password error for ${password}: ` + error.message,
      });
    }
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};
const cookieOptions = {
  httpOnly: false, // This ensures the cookie is not accessible via client-side JavaScript
  // Other options like secure, sameSite, etc., can be added as needed
};

exports.login = async (req, res) =>{
  try {
    const { email, password } = req.body;
     // Check if the user exists
     const user = await User.findOne({ email });
     if (!user) {
       return res.status(401).json({ error: 'Invalid email or password' });
     }    // Validate the password
     const isPasswordValid = await user.comparePassword(password); // Use correct method call
     if (!isPasswordValid) {
       return res.status(401).json({ error: 'Invalid email or password' });
     }    // Generate a JWT token
     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
         // Set the JWT token in a cookie
     res.cookie('jwt', token, cookieOptions);
     res.status(200).json({ token });
   } catch (error) {
     console.error('Error logging in:', error);
     res.status(500).json({ error: 'An error occurred while logging in' });
   }
  }

  exports.getUserInformation = async (req, res) => {
    try {
      // Extract JWT token from the cookie
      const token = req.cookies.jwt;
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
      }
  
      // Verify the JWT token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      if (!decodedToken.userId) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
  
      // Fetch user details from the database using userId
      const user = await User.findById(decodedToken.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Respond with the user information
      res.status(200).json({ user });
    } catch (error) {
      console.error('Error getting user information:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
      res.status(500).json({ error: 'An error occurred while getting user information' });
    }
  };
  