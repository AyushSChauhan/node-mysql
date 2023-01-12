const express = require('express');
const router = express();
const contactController = require('../controller/contactController');
const { authenticate, generateToken } = require('../middleware/auth');

router.post("/addContact", authenticate, contactController.addContact);

router.get("/viewContact", authenticate, contactController.viewContact);

router.put("/updateContact/:id", authenticate, contactController.updateContact);

router.get("/deleteContact/:id", authenticate, contactController.deleteContact);
router.get("/multiContact", authenticate, contactController.multiDeleteContact);

module.exports = router;