const { createClient } = require("@supabase/supabase-js");
const multer = require("multer");
const path = require("path");
const storage = multer.memoryStorage();
const avatarUploadMiddleware = multer({ storage }).single("avatar");
// configure multer storage (in memory)
const upload = multer({ storage });

// expose this middleware to route file
exports.avatarUploadMiddleware = upload.single("avatar");

// GET /profile

const getUserProfile = async (req, res) => {
  const user_id = req.user.id;
  const token = req.headers.authorization.split(" ")[1];

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY, // or SUPABASE_ANON_KEY if renamed
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, phone, notifications_enabled, avatar_url, created_at")
      .eq("user_id", user_id)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(200).json({
        user_id,
        full_name: null,
        phone: null,
        notifications_enabled: true,
        avatar_url: null,
        created_at: null,
      });
    }

    return res.status(200).json({ user_id, ...data });
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// PUT /profile
const updateUserProfile = async (req, res) => {
  const user_id = req.user.id;
  const { full_name, phone, avatar_url } = req.body;

  const token = req.headers.authorization.split(" ")[1];
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  try {
    const { error } = await supabase
      .from("profiles")
      .upsert([{ user_id, full_name, phone, avatar_url }]);

    if (error) throw error;

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    return res.status(500).json({ error: "Failed to update profile" });
  }
};

const updateNotifications = async (req, res) => {
  const user_id = req.user.id;
  const { enabled } = req.body;
  const token = req.headers.authorization.split(" ")[1];

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY, // or SUPABASE_ANON_KEY
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  if (typeof enabled !== "boolean") {
    return res.status(400).json({ error: "Invalid value for notifications" });
  }

  try {
    const { error } = await supabase
      .from("profiles")
      .upsert([{ user_id, notifications_enabled: enabled }]);

    if (error) throw error;

    return res.status(200).json({ message: "Notification setting updated" });
  } catch (error) {
    console.error("Error updating notifications:", error.message);
    return res.status(500).json({ error: "Failed to update notifications" });
  }
};

const uploadAvatar = async (req, res) => {
  const user_id = req.user.id;
  const file = req.file;
  const token = req.headers.authorization?.split(" ")[1];

  console.log("user_id from auth:", user_id);
  console.log("auth.uid from token:", user_id);
  
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  // ✅ Create Supabase client with user's token for RLS
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  try {
    const fileExt = path.extname(file.originalname);
    const filePath = `${user_id}/avatar${fileExt}`;

    // ✅ Upload to Supabase Storage
    
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      return res.status(500).json({ error: "Failed to upload avatar" });
    }

    // ✅ Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const avatar_url = publicUrlData?.publicUrl;

    //
    const { error: updateError } = await supabase
      .from("profiles")
      .upsert({ user_id, avatar_url })
      .select();

    if (updateError) {
      console.error("Profile update error:", updateError.message);
      return res.status(500).json({ error: "Failed to update avatar URL" });
    }

    return res.status(200).json({ message: "Avatar uploaded", avatar_url });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Unexpected server error" });
  }
};


const changePassword = async (req, res) => {
  const { new_password, confirm_password } = req.body;
  const user_id = req.user.id; // comes from authMiddleware

  if (!new_password || !confirm_password) {
    return res.status(400).json({ error: "Both fields are required" });
  }

  if (new_password !== confirm_password) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  // ⚠️ Use service key here — admin rights
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(user_id, {
      password: new_password,
    });

    if (error) {
      console.error("Password update error:", error.message);
      return res.status(500).json({ error: "Failed to change password" });
    }

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Unexpected error:", err.message);
    return res.status(500).json({ error: "Unexpected server error" });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateNotifications,
  uploadAvatar,
  avatarUploadMiddleware,
  changePassword,
};
