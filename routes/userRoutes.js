const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.put('/update-details', userController.updateUserDetails);
router.get('/', ()=>console.log('hello'));

module.exports = router;