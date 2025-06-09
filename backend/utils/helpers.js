const { supabase } = require("../config/supabaseConfig")
const { Groq } = require('groq-sdk');
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

// AI helper function
exports.useAi = async (message) => {
    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY
    });
 return await groq.chat.completions.create({
  "messages": [
    {
      "role": "user",
      "content": message
    }
  ],
  "model": "deepseek-r1-distill-llama-70b",
  "temperature": 0.6,
  "max_completion_tokens": 4096,
  "top_p": 0.95,
  "stream": true,
  "stop": null
});

}


// get latest user energy record
exports.getLatestUserEnergyData = async (userId) => {
    const { data, error } = await supabase
        .from("data_records")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

    if (error) {
        console.error("❌ Error fetching user energy data:", error);
        throw new Error("Failed to fetch user energy data");
    }

    return data;
};

// summarize energy data
exports.summarizeEnergyData = async (record) =>{
    if (!record) throw new Error("No record provided");
    
    return `
    - Voltage: ${record.voltage}
    - Currents: ${JSON.stringify(record.currents)}
    - Total energy: ${record.total_energy}
    - Bill: ₦${record.bill}
    - Device readings: ${JSON.stringify(record.device_readings)}
    - Power (watts): ${JSON.stringify(record.power_watts)}
    - Energy (kWh): ${JSON.stringify(record.energy_kwh)}
    - Accumulated energy: ${record.accumulated_energy}
    - Accumulated bill: ₦${record.accumulated_bill}
    `;
}


// Get cached user alerts from Supabase (valid for 24 hours)
exports.getCachedUserAlerts = async (userId) => {
    const { data, error } = await supabase
        .from('ai_alert_cache')
        .select('*')
        .eq('user_id', userId)
        .single();
    if (error || !data) return null;
    const now = new Date();
    const createdAt = new Date(data.created_at);
    const hoursDiff = (now - createdAt) / (1000 * 60 * 60);
    if (hoursDiff < 24) {
        return data.alerts_json;
    }
    return null;
};

// Cache AI alerts in Supabase
exports.cacheUserAlerts = async (userId, alerts) => {
    await supabase
        .from('ai_alert_cache')
        .upsert([{ user_id: userId, alerts_json: alerts, created_at: new Date().toISOString() }]);
};

// generate user alerts
exports.generateUserAlerts = async (userId) =>{
    if (!userId) throw new Error("No user id provided");
    
    // Check cache first
    const cached = await exports.getCachedUserAlerts(userId);
    if (cached) {
        console.log("Returning cached AI alerts for user:", userId);
        return cached;
    }
    
    const record = await this.getLatestUserEnergyData(userId);
    const summary = await this.summarizeEnergyData(record);
    
    // Create a more explicit prompt to avoid thinking process
    const prompt = `
    IMPORTANT: Respond ONLY with a valid JSON array and nothing else.
    
    Based on this energy data, create 3 actionable alerts:
    ${summary}
    
    Each alert must have these fields:
    - id: a short identifier (string)
    - message: a helpful message WITHOUT emojis in the text
    - emoji: a single relevant emoji
    
    Format: [{ "id": "...", "message": "...", "emoji": "..." }]
    `;

    const response = await this.useAi(prompt);

    if (!response) throw new Error("Failed to generate alerts");

    let result = "";

    for await (const chunk of response) {
        result += chunk.choices[0].delta.content || "";
    }

    console.log("Raw AI response:", result);
    
    // Create a fallback set of alerts in case parsing fails
    const fallbackAlerts = [
        {
            id: "energy-usage",
            message: "Monitor your energy usage to reduce your bill.",
            emoji: "💡"
        },
        {
            id: "power-saving",
            message: "Consider turning off devices when not in use.",
            emoji: "🔌"
        },
        {
            id: "efficiency",
            message: "Energy-efficient appliances can help reduce consumption.",
            emoji: "🌱"
        }
    ];
    
    // Try to extract JSON using regex pattern matching
    let alerts;
    try {
        // Look for JSON array pattern
        const jsonRegex = /\[\s*{[^]*}\s*\]/;
        const match = result.match(jsonRegex);
        
        if (match && match[0]) {
            // Try to parse the matched JSON string
            alerts = JSON.parse(match[0]);
            console.log("Successfully parsed alerts:", alerts);
            // Cache the new alerts
            await exports.cacheUserAlerts(userId, alerts);
            return alerts;
        }
        
        // If regex didn't find a match, try the original approach
        const startIndex = result.indexOf('[');
        const endIndex = result.lastIndexOf(']');
        
        if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
            const cleanedJson = result.substring(startIndex, endIndex + 1);
            const alerts = JSON.parse(cleanedJson);
            console.log("Successfully parsed alerts (method 2):", alerts);
            // Cache the new alerts
            await exports.cacheUserAlerts(userId, alerts);
            return alerts;
        }
        
        
        // If we got here, we couldn't parse the JSON
        console.warn("Could not extract valid JSON from AI response. Using fallback alerts.");
        await exports.cacheUserAlerts(userId, fallbackAlerts);
        return fallbackAlerts;
        
    } catch (error) {
        console.error("Failed to parse AI response:", error);
        console.warn("Using fallback alerts instead.");
        await exports.cacheUserAlerts(userId, fallbackAlerts);
        return fallbackAlerts;
    }
}