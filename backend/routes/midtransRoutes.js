const express = require('express');
const router = express.Router();
const midtransController = require('../controllers/midtransController');
const { auth } = require('../middleware/auth');

router.post('/create-transaction', auth, midtransController.createTransaction);
router.post('/notification', midtransController.handleNotification);

module.exports = router;
