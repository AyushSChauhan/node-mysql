const express = require('express');
const router = express();
const authController = require('../controller/authController');
const upload = require('../middleware/multer');
const { authenticate, generateToken } = require('../middleware/auth');


router.post("/registration", upload.single('image'), authController.registration);
router.post("/login", generateToken, authController.login);

router.post("/verifyEmail", authController.verifyEmail);
router.post("/verifyOtp", authController.verifyOtp);

router.put("/resetPassword", authenticate, authController.resetPassword);
router.put("/updatePassword",authenticate, authController.updatePassword);

router.get("/profile", authenticate, authController.viewProfile);
router.put("/updateProfile", authenticate, upload.single('image'), authController.updateProfile);


router.get("/logout", authController.logout);

module.exports = router;