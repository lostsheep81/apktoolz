const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../../core/models/User.model');
const { sendEmail } = require('../../core/services/email.service');
const { generateToken, generateRefreshToken } = require('../../core/utils/tokenUtils');
const { handleError } = require('../../core/utils/errorHandler');

// User registration with enhanced validation
exports.register = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    // Check if user exists
    if (await User.findOne({ $or: [{ email }, { username }] })) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    const user = new User({ username, email, password, name });
    const verificationToken = user.generateVerificationToken();
    await user.save();

    // Send verification email
    const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${verificationToken}`;
    await sendEmail({
      to: email,
      subject: 'Verify Your Email',
      text: `Please verify your email by clicking: ${verificationUrl}`,
      html: `<p>Please verify your email by clicking: <a href="${verificationUrl}">here</a></p>`
    });

    res.status(201).json({ 
      message: 'User registered successfully. Please check your email for verification.' 
    });
  } catch (err) {
    handleError(res, err, 'Error registering user');
  }
};

// Enhanced login with reusable token generation
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.active) {
      return res.status(403).json({ message: 'Account is inactive' });
    }

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token
    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({ 
      token, 
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name
      }
    });
  } catch (err) {
    handleError(res, err, 'Error logging in');
  }
};

// Token refresh with rotation
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    // Verify token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Check if token exists in user's refreshTokens
    const tokenIndex = user.refreshTokens.findIndex(t => t.token === refreshToken);
    if (tokenIndex === -1) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    // Remove old refresh token
    user.refreshTokens.splice(tokenIndex, 1);

    // Generate new tokens
    const newToken = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    const newRefreshToken = jwt.sign(
      { id: user._id }, 
      process.env.JWT_REFRESH_SECRET, 
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    // Store new refresh token
    user.refreshTokens.push({
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    await user.save();

    res.status(200).json({ 
      token: newToken, 
      refreshToken: newRefreshToken 
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Refresh token expired' });
    }
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};

// Password reset with token
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save();

    // Send email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Password Reset',
      text: `Reset your password by clicking: ${resetUrl}`,
      html: `<p>Reset your password by clicking: <a href="${resetUrl}">here</a></p>`
    });

    res.status(200).json({ 
      message: 'Password reset instructions sent to email' 
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    
    res.status(500).json({ 
      message: 'Error sending reset email', 
      error: err.message 
    });
  }
};

// Complete password reset
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // Hash token to compare with stored one
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token is invalid or has expired' });
    }

    // Update password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ 
      message: 'Password reset successfully' 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error resetting password', 
      error: err.message 
    });
  }
};

// Email verification
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token is invalid or has expired' });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.status(200).json({ 
      message: 'Email verified successfully' 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error verifying email', 
      error: err.message 
    });
  }
};

// Logout (revoke refresh token)
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the refresh token
    user.refreshTokens = user.refreshTokens.filter(
      t => t.token !== refreshToken
    );

    await user.save();

    res.status(200).json({ 
      message: 'Logged out successfully' 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error logging out', 
      error: err.message 
    });
  }
};
