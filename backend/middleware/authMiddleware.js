import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Route protection middleware
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode token to get user id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the database, exclude password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      res.json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401);
    res.json({ message: 'Not authorized, no token' });
  }
};

// Admin middleware (optional helper)
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    res.json({ message: 'Not authorized as an admin' });
  }
};

// Generate JWT token utility helper
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
