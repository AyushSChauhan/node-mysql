const express = require('express');
const router = express();
const categoryController = require('../controller/categoryController');
const { authenticate, generateToken } = require('../middleware/auth');

router.post("/addCategory", authenticate, categoryController.addCategory);
router.get("/viewCategory", authenticate, categoryController.viewCategory);
router.put("/updateCategory/:id", authenticate, categoryController.updateCategory);

router.get("/deleteCategory/:id", authenticate, categoryController.deleteCategory);
router.get("/multipleDel", authenticate, categoryController.multiDeleteCategory);

module.exports = router;