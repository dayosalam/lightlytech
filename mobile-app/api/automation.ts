import newRequest from "./newRequest";

/**
 * Sends a binary instruction to control ESP devices
 * @param code Binary code (0 or 1) to send to the device
 * @returns Response data from the server
 */
export const sendInstruction = async(code: number | string) => {
    try {
        // Convert to string to ensure it's sent as a binary string
        const binaryCode = code.toString();
        console.log(`Sending binary instruction: ${binaryCode}`);
        
        // Send the instruction to the sensors endpoint
        const response = await newRequest.post(`/sensors/${binaryCode}`);
        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error sending instruction:", error.message);
        }
        throw error; // Rethrow to allow handling in the component
    }
}