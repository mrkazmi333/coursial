const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controllers');

console.log("Router loaded");
router.get('/', homeController.home);
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));
//For any further routes access from here
//router.use('/routerName', require('./routerFile'));
router.use('/api', require('./api'));

module.exports = router;