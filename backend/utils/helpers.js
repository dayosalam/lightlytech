const { supabase } = require("../config/supabaseConfig")
// get user details from db
exports.getUser = async (userId) => {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) {
        console.error("❌ Error fetching user details:", error);
        return null;
    }

    return data;
};