const express = require('express');
const router = express.Router();

const { createCategory, getAllCategories } = require('../service/categories');

router.get('/', getAllCategories);

router.post('/', createCategory);

module.exports = router;
