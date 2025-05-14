const supabase = require("../config/supabaseConfig");

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

    // fetch user details from db
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", signInData.user.id)
      .single();

    if (error) {
      console.error("❌ Database Error:", error.message);
      return res.status(500).json({
        error: "Database error fetching user details",
        details: error.message,
      });
    }

    return res.status(200).json({
      message: "User logged in successfully",
      access_token: signInData.session?.access_token,
      refresh_token: signInData.session?.refresh_token,
      user: user,
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

// change password for authenticated user
exports.changePassword = async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    console.error("❌ Supabase Auth Error:", error.message);
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ message: "Password changed successfully" });
};

// change email for authenticated user
exports.changeEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const { error } = await supabase.auth.updateUser({
    email,
  });

  if (error) {
    console.error("❌ Supabase Auth Error:", error.message);
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ message: "Email changed successfully" });
};