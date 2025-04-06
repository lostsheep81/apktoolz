const express = require('express');
const router = express.Router();
const { register } = require('../controllers/user.controller');
const { validateUserRegistration } = require('../middleware/userValidation');

router.post('/register', validateUserRegistration, register);

module.exports = router;