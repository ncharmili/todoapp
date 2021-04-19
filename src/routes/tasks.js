const express = require('express');
const router = express.Router();

const { createTask, getUserTasks } = require('../service/tasks');

router.post('/users/:id', createTask);
router.post('/users/:id/search', getUserTasks);
module.exports = router;
