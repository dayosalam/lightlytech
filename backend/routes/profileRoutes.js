const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  updateNotifications,
  changePassword,
  saveCondoName,
  updateUserDetails,
  getUserDetails,
} = require("../controllers/profileController");

const {
  uploadAvatar,
  avatarUploadMiddleware,
} = require("../controllers/profileController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/user-profile", authMiddleware, getUserDetails);
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.put("/notifications", authMiddleware, updateNotifications);
router.post("/avatar", authMiddleware, avatarUploadMiddleware, uploadAvatar);
router.put("/change-password", authMiddleware, changePassword);
router.put("/condo-name", authMiddleware, saveCondoName);
router.put("/user-details", authMiddleware, updateUserDetails);
module.exports = router;
