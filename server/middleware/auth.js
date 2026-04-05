import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback_secret'
      );
      req.user = decoded; // { id, role }

      return next(); // ← FIXED: early return so we don't fall into the !token block
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // No token provided at all
  return res.status(401).json({ message: 'Not authorized, no token' });
};
