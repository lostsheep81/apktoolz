const jwt = require('jsonwebtoken');
const User = require('../../core/models/User.model');

// Rate limiting and security headers would be added at the app level

const verifyToken = async (req, res, next) => {
  try {
    let token;
    
    // Check headers first
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } 
    // Then check cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ 
        message: 'You are not logged in. Please log in to get access.' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ 
        message: 'The user belonging to this token no longer exists.' 
      });
    }

    // Check if user changed password after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({ 
        message: 'User recently changed password. Please log in again.' 
      });
    }

    // Check if account is active
    if (!currentUser.active) {
      return res.status(401).json({ 
        message: 'Your account has been deactivated.' 
      });
    }

    // Grant access
    req.user = currentUser;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Your token has expired. Please log in again.' 
      });
    }
    return res.status(401).json({ 
      message: 'Invalid token. Please log in again.' 
    });
  }
};

const verifyRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ 
        message: 'No refresh token provided' 
      });
    }

    // Verify token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Check if user exists and token is valid
    const user = await User.findOne({
      _id: decoded.id,
      'refreshTokens.token': refreshToken
    });

    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid refresh token' 
      });
    }

    // Check if token is expired
    const tokenData = user.refreshTokens.find(t => t.token === refreshToken);
    if (tokenData.expiresAt < new Date()) {
      // Remove expired token
      user.refreshTokens = user.refreshTokens.filter(
        t => t.token !== refreshToken
      );
      await user.save();
      
      return res.status(401).json({ 
        message: 'Refresh token expired' 
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Refresh token expired' 
      });
    }
    return res.status(403).json({ 
      message: 'Invalid refresh token' 
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'You do not have permission to perform this action' 
    });
  }
  next();
};

const requireEmailVerified = (req, res, next) => {
  if (!req.user.emailVerified) {
    return res.status(403).json({ 
      message: 'Please verify your email address to access this resource' 
    });
  }
  next();
};

// Restrict to specific roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'You do not have permission to perform this action' 
      });
    }
    next();
  };
};

module.exports = { 
  verifyToken, 
  verifyRefreshToken, 
  requireAdmin,
  requireEmailVerified,
  restrictTo
};
