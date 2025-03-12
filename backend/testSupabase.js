require("dotenv").config();
const supabase = require("./config/supabaseConfig");

async function testConnection() {
    const { data, error } = await supabase.from("users").select("*").limit(1);

    if (error) {
        console.error("❌ Supabase Connection Error:", error.message);
    } else {
        console.log("✅ Supabase Connected! Users Table Sample Data:", data);
    }
}

testConnection();


