const express = require('express');
const router = express.Router();

const { createUser, getAllUsers } = require('../service/user');

router.get('/', getAllUsers);

router.post('/', createUser);

module.exports = router;
