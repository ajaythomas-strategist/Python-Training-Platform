import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing or invalid format. Please log in.' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_key');
    
    // Fetch user from database (excluding the sensitive password hash)
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ message: 'The user belonging to this token no longer exists.' });
    }

    // Attach user document to the request object so controllers can access it!
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
    }
    return res.status(401).json({ message: 'Invalid token. Access denied.', error: error.message });
  }
};
