import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import WifiManager from 'react-native-wifi-reborn';
import { Platform, PermissionsAndroid } from 'react-native';

// Define the WiFi network interface
interface WifiNetwork {
  SSID: string;
  BSSID?: string;
  capabilities?: string;
  frequency?: number;
  level?: number;
  timestamp?: number;
}

interface WifiContextType {
  // State
  networks: WifiNetwork[];
  currentSSID: string | null;
  isScanning: boolean;
  error: string | null;
  isConnecting: boolean;
  
  // Actions
  scanNetworks: () => Promise<void>;
  connectToNetwork: (ssid: string, password: string, isHidden?: boolean) => Promise<boolean>;
  disconnectFromNetwork: (ssid: string) => Promise<boolean>;
  clearError: () => void;
}

// Create the context with default values
const WifiContext = createContext<WifiContextType>({
  networks: [],
  currentSSID: null,
  isScanning: false,
  error: null,
  isConnecting: false,
  
  scanNetworks: async () => {},
  connectToNetwork: async () => false,
  disconnectFromNetwork: async () => false,
  clearError: () => {},
});

// Provider component
const WifiProvider = ({ children }: { children: ReactNode }) => {
  const [networks, setNetworks] = useState<WifiNetwork[]>([]);
  const [currentSSID, setCurrentSSID] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // Check for location permissions (required for WiFi scanning on Android)
  // const requestLocationPermission = async (): Promise<boolean> => {
  //   if (Platform.OS === 'ios') {
  //     return true; // iOS doesn't need this permission for WiFi
  //   }

  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       {
  //         title: 'Location Permission',
  //         message: 'We need your location to scan for WiFi networks',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       }
  //     );
  //     return granted === PermissionsAndroid.RESULTS.GRANTED;
  //   } catch (err) {
  //     console.error('Failed to request location permission:', err);
  //     return false;
  //   }
  // };

  // Check if location services are enabled
  const checkLocationEnabled = async (): Promise<boolean> => {
    try {
      // This is a workaround to check if location is enabled
      await WifiManager.getCurrentWifiSSID();
      return true;
    } catch (error) {
      // If error contains "Location service is turned off", then location is not enabled
      if (error instanceof Error && error.message.includes("Location service is turned off")) {
        return false;
      }
      // For other errors, assume location might be enabled
      return true;
    }
  };

  // Get current WiFi SSID
  const getCurrentWifi = async () => {
    try {
      const ssid = await WifiManager.getCurrentWifiSSID();
      setCurrentSSID(ssid);
      return ssid;
    } catch (error) {
      console.log('Error getting current SSID:', error);
      if (error instanceof Error && error.message.includes("Location service is turned off")) {
        setError("Please enable Location Services in your device settings");
      }
      setCurrentSSID(null);
      return null;
    }
  };

  // Scan for available WiFi networks
  const scanNetworks = async () => {
    setIsScanning(true);
    setError(null);
    
    try {
      // First check if location services are enabled
      const locationEnabled = await checkLocationEnabled();

      console.log("Location enabled:", locationEnabled);
      if (!locationEnabled) {
        setError("Please enable Location Services in your device settings to scan for WiFi networks");
        console.log("Location services are turned off");
        return;
      }
      
        // Get current SSID
        try {
          const currentSSID = await WifiManager.getCurrentWifiSSID();
          setCurrentSSID(currentSSID);
        } catch (error) {
          console.log("Error getting current SSID:", error);
          // Handle specific errors
          if (error instanceof Error && error.message.includes("Location service is turned off")) {
            setError("Please enable Location Services in your device settings");
            return;
          }
        }
        
        try {
          // Scan for networks
          const wifiList = await WifiManager.loadWifiList();
          const uniqueNetworks = wifiList.filter(network => network.SSID && network.SSID.length > 0);
          setNetworks(uniqueNetworks);
        } catch (error) {
          console.log("Error loading WiFi list:", error);
          if (error instanceof Error && error.message.includes("Location service is turned off")) {
            setError("Please enable Location Services in your device settings");
          } else {
            setError("Error scanning for WiFi networks");
          }
        }
    } catch (error) {
      console.log("Error scanning WiFi:", error);
      // Better error handling with specific messages
      if (error instanceof Error) {
        if (error.message.includes("Location service is turned off")) {
          setError("Please enable Location Services in your device settings");
        } else {
          setError("Error scanning for WiFi networks: " + error.message);
        }
      } else {
        setError("Error scanning for WiFi networks");
      }
    } finally {
      setIsScanning(false);
    }
  };

  // Connect to a WiFi network
  const connectToNetwork = async (ssid: string, password: string, isHidden: boolean = false): Promise<boolean> => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // Connect to the selected network
      const connected = await WifiManager.connectToProtectedSSID(
        ssid,
        password,
        false, // isWEP - we assume modern networks use WPA/WPA2, not WEP
        isHidden // isHidden - whether this is a hidden network
      );

      console.log("Connected to WiFi:", connected);
      
      if (connected) {
        console.log(`Successfully connected to ${ssid}`);
        // Update current SSID
        await getCurrentWifi();
        return true;
      } else {
        console.log(`Failed to connect to ${ssid}`);
        setError("Failed to connect to the network. Please check your password and try again.");
        return false;
      }
    } catch (error) {
      console.log('Error connecting to WiFi:', error);
      setError("Error connecting to the network");
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect from a WiFi network
  const disconnectFromNetwork = async (ssid: string): Promise<boolean> => {
    try {
      // This functionality depends on the platform and may not be available in all versions
      // of react-native-wifi-reborn
      if (Platform.OS === 'android') {
        await WifiManager.disconnect();
        return true;
      }
      return false;
    } catch (error) {
      console.log('Error disconnecting from WiFi:', error);
      setError("Error disconnecting from the network");
      return false;
    }
  };

  // Clear any error messages
  const clearError = () => {
    setError(null);
  };

  // Initial setup - request location permission and get current WiFi when component mounts
  useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "We need your location to scan for WiFi networks",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
  }, []);

  return (
    <WifiContext.Provider
      value={{
        networks,
        currentSSID,
        isScanning,
        error,
        isConnecting,
        scanNetworks,
        connectToNetwork,
        disconnectFromNetwork,
        clearError,
      }}
    >
      {children}
    </WifiContext.Provider>
  );
};

export default WifiProvider;

// Custom hook to use the WiFi context
export const useWifi = () => {
  const context = useContext(WifiContext);
  if (context === undefined) {
    throw new Error('useWifi must be used within a WifiProvider');
  }
  return context;
};
