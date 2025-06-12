import { createContext, useState, useContext, useEffect } from "react";
import { getReadings } from "@/api/readings";
import { sensor_readings } from "@/interfaces";
import { useAuth } from "./AuthContext";

interface ReadingsContextType {
  readings: sensor_readings | undefined;
  setReadings: (readings: sensor_readings) => void;
}

const ReadingsContext = createContext<ReadingsContextType>({
  readings: undefined,
  setReadings: () => {},
});

const ReadingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [readings, setReadings] = useState<sensor_readings>();
  const { isAuthenticated, loading } = useAuth();
  
  useEffect(() => {
    // Only fetch readings if the user is authenticated
    const fetchReadings = async () => {
      if (!isAuthenticated) {
        console.log("User not authenticated, skipping readings fetch");
        return;
      }
      
      try {
        console.log("Fetching readings for authenticated user");
        const readingsData = await getReadings();
        setReadings(readingsData.sensor_readings);
      } catch (error) {
        console.error("Error fetching readings:", error);
      }
    };
    
    // Wait for auth loading to complete before checking
    if (!loading) {
      fetchReadings();
    }
  }, [isAuthenticated, loading]);

  
  return (
    <ReadingsContext.Provider value={{ readings, setReadings }}>
      {children}
    </ReadingsContext.Provider>
  );
};

export default ReadingsProvider;

export const useReadings = () => useContext(ReadingsContext);
