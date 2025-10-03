const express = require('express');
const router = express.Router();

// Admin subroutes
router.use('/', require('../admin/homeRoutes'));

router.use('/users', require('../admin/userRoutes'));
router.use('/drivers', require('../admin/driverRoutes'));
router.use('/profileMaster', require('./profileMaster.js'));


module.exports = router;
