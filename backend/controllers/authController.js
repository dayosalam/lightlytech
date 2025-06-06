const { supabase, supabaseServiceRole } = require("../config/supabaseConfig");
const {getUser} = require("../utils/helpers");

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      if (error.message.includes("already registered")) {
        return res.status(400).json({ error: "Email already registered" });
      }
      console.error("❌ Supabase Signup Error:", error);
      return res.status(400).json({ error: error.message, details: error });
    }

    const userId = data.user?.id;
    if (!userId) {
      console.error("❌ Error: User ID not returned from Supabase Auth");
      return res.status(500).json({ error: "Failed to retrieve user ID" });
    }

    console.log("✅ User created in Supabase Auth with ID:", userId);

    const { error: dbError } = await supabase
      .from("users")
      .insert([{ id: userId, email, name }]);

    if (dbError) {
      console.error("❌ Database Insert Error:", dbError);
      return res
        .status(500)
        .json({ error: "Database error saving new user", details: dbError });
    }

    res.status(200).json({
      message: "User registered successfully",
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      user: data.user,
    });
  } catch (err) {
    console.error("❌ Unexpected Error:", err);
    res.status(500).json({
      error: "Unexpected error during registration",
      details: err.message,
    });
  }
};

exports.signIn = async (req, res) => {
  console.log("✅ SignIn endpoint called with body:", JSON.stringify(req.body));

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error("❌ Supabase Auth Error:", signInError.message);
      return res.status(400).json({ error: signInError.message });
    }

    const user = await getUser(signInData.user.id);


    return res.status(200).json({
      message: "User logged in successfully",
      access_token: signInData.session?.access_token,
      refresh_token: signInData.session?.refresh_token,
      user,
    });
  } catch (err) {
    console.error("❌ Unexpected error during sign in:", err);
    return res.status(500).json({
      error: "Unexpected error during sign in",
      details: err.message,
    });
  }
};


exports.logout = async (req, res) => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ message: "Logged out successfully" });
  console.log(`✅ user logged out`);
};

// Change password for authenticated user
exports.changePassword = async (req, res) => {
  const { password } = req.body;
  const user_id = req.user.id;


  const {error} = await supabaseServiceRole.auth.admin.updateUserById(user_id, {
    password
  })

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ message: "Password changed successfully" });
};


// Change email for authenticated user
exports.changeEmail = async (req, res) => {
  const { email } = req.body;
  const user_id = req.user.id;


  const {error} = await supabaseServiceRole.auth.admin.updateUserById(user_id, {
    email
  })

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ message: "Email changed successfully" });
};
