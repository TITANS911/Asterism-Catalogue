const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

const authAdmin = async (req, res, next) => {
  try {
    await auth(req, res, () => {});
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authorization required'
      });
    }

    if (req.user.user_group_id !== 1) {
      return res.status(403).json({
        success: false,
        message: 'Admin access only'
      });
    }

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Admin authorization required'
    });
  }
};

module.exports = { auth, authAdmin };
