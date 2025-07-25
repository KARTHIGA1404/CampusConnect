const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  const authHeader = req.header('Authorization');
  console.log('Authorization Header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'secret_key'); // same as in login
    console.log('Decoded Token:', decoded);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found for token' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('JWT Verify Error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
