const express = require("express");
const router = express.Router();
const controller = require("../controller/testimonialController");
const { verifyToken, hasPermission } = require("../middleware/auth");

const cpUpload = controller.upload.fields([
  { name: "companylogo", maxCount: 1 },
  { name: "Flag", maxCount: 1 },
]);

router.get("/alltestimonials", controller.getAllTestimonials);
router.get("/activetestimonials", controller.getActiveTestimonials);

router.post(
  "/addtestimonials",
  verifyToken,
  hasPermission,
  cpUpload,
  controller.addTestimonial
);

router.put(
  "/updatetestimonials/:id",
  verifyToken,
  hasPermission,
  cpUpload,
  controller.updateTestimonial
);

module.exports = router;