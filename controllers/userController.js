exports.updateUserDetails = async (req, res) => {
    try {
      const { location, age, workDetails } = req.body;
      const userId = req.userId; // Assuming userId is attached to the request object by authentication middleware
  
      // Find the user by userId
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update user details
      user.location = location;
      user.age = age;
      user.workDetails = workDetails;
  
      // Save updated user details
      await user.save();
  
      res.status(200).json({ message: 'User details updated successfully', user });
    } catch (error) {
      console.error('Error updating user details:', error);
      res.status(500).json({ error: 'An error occurred while updating user details' });
    }
  };