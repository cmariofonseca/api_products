const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.createUser);

router.delete("/:id", checkAuth, userCtrl.deleteUser);

router.post('/login', userCtrl.createLogin);

module.exports = router;