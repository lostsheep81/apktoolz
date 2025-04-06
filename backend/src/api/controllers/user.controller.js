const User = require('../../core/models/User.model');
const logger = require('../../config/logger');

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'A user with this email already exists'
        }
      });
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      name
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    logger.info({ userId: user._id }, 'New user registered');

    return res.status(201).json({
      success: true,
      data: {
        user: userResponse
      }
    });
  } catch (error) {
    logger.error({ error }, 'Error during user registration');
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred during registration'
      }
    });
  }
};