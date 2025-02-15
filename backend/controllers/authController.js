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

    res
      .status(200)
      .json({ message: "User registered successfully", user: data.user });
  } catch (err) {
    console.error("❌ Unexpected Error:", err);
    res.status(500).json({
      error: "Unexpected error during registration",
      details: err.message,
    });
  }
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ user: data.user });
};

exports.logout = async (req, res) => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ message: "Logged out successfully" });
};
