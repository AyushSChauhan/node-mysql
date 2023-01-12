const express = require('express');
const router = express();
const testimonialController = require('../controller/testimonialController');
const upload = require('../middleware/multer');
const { authenticate, generateToken } = require('../middleware/auth');


router.post("/addTestimonial", authenticate, upload.single('image'), testimonialController.addTestimonial);

router.get("/viewTestimonial", authenticate, testimonialController.viewTestimonial);

router.put("/updateTestimonial/:id", authenticate, upload.single('image'), testimonialController.updateTestimonial);

router.get("/deleteTestimonial/:id", authenticate, testimonialController.deleteTestimonial);
router.get("/multiTestimonial", authenticate, testimonialController.multiDeleteTestimonial);


module.exports = router;