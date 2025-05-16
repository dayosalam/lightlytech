import newRequest from "./newRequest";

/**
 * Sends relay instructions to control ESP devices
 * @param relays Array of 4 binary values (0 or 1) representing the state of each relay
 * @returns Response data from the server
 */
export const sendInstruction = async(relays: number[]) => {
    try {
        // Validate the relays array
        if (!Array.isArray(relays) || relays.length !== 4 || !relays.every(r => r === 0 || r === 1)) {
            throw new Error("relays must be an array of 4 binary values (0 or 1).");
        }
        
        console.log(`Sending relay instructions:`, relays);
        
        // Send the instruction to the sensors/relay endpoint
        const response = await newRequest.post('/sensors/relay', { relays });
        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error sending instruction:", error.message);
        }
        throw error; // Rethrow to allow handling in the component
    }
}