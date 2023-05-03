const router = require('express').Router();
const thoughtRoutes = require('./thought-route.js');
const userRoutes = require('./user-route.js');

router.use('/thoughts', thoughtRoutes);
router.use('/users', userRoutes);

module.exports = router;