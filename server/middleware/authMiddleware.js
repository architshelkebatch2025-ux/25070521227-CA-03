const jwt = require('jsonwebtoken');

/**
 * Express middleware to verify JWT token in incoming requests.
 * Expects header: Authorization: Bearer <token>
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return res.status(401).json({ message: 'Access denied. No authorization token provided.' });
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : authHeader.trim();

    if (!token) {
      return res.status(401).json({ message: 'Access denied. Token is empty.' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'btech_smart_library_secret_key_2026'
    );

    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
  }
};

module.exports = authMiddleware;
