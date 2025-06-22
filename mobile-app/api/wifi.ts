import axios from "axios";

export const sendWifiCredentials = async (ssid: string, password: string) =>{
    try {
        const response = await axios.post(
            'http://192.168.4.1/set_wifi',  // ESP32 IP address in AP mode
            new URLSearchParams({
              ssid,
              password,
            }).toString(),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              timeout: 5000, // optional timeout
            }
          );
    } catch (error) {
        console.log(error);
    }
}