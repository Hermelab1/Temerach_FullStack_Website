const express = require("express");
const router = express.Router();
const controller = require("../controller/blogsController");
const { verifyToken, hasPermission } = require("../middleware/auth");

// Change .put to .get and keep it public so visitors can see blogs
router.get("/activeblogs", controller.getActiveBlog); 

// Other routes
router.get("/allblogs", controller.getallblogs);
router.get("/blogsbyid/:id", controller.getblogbyid);

// Protected routes (Only these require verifyToken)
router.post("/addblogs", controller.upload.single("mediaSrc"), verifyToken, hasPermission, controller.addblogs);
router.put("/updateblogs/:id", controller.upload.single("mediaSrc"), verifyToken, hasPermission, controller.updateblog);


// COUNTERS
router.put("/blogs/:id/view", controller.incrementView);
router.put("/blogs/:id/like", controller.incrementLike);
router.put("/blogs/:id/share", controller.incrementShare);

module.exports = router;