import jwt from 'jsonwebtoken';

/**
 * Generate a JWT token with 4 hour expiry
 * @param {Object} payload - Data to encode in the token
 * @returns {string} JWT token
 */
export function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '4h' // Matches cookie maxAge
  });
}

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded payload
 * @throws {Error} If token is invalid or expired
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}
