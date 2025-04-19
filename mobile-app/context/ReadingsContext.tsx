import { createContext, useState, useContext, useEffect } from "react";
import { getReadings } from "@/api/readings";
import { sensor_readings } from "@/interfaces";

interface ReadingsContextType {
  readings: sensor_readings[];
  setReadings: (readings: any[]) => void;
}

const ReadingsContext = createContext<ReadingsContextType>({
  readings: [],
  setReadings: () => {},
});

const ReadingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [readings, setReadings] = useState<any[]>([]);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const readingsData = await getReadings();
        setReadings(readingsData.sensor_readings);
      } catch (error) {
        console.error("Error fetching readings:", error);
      }
    };
    fetchReadings();
  }, []);

  return (
    <ReadingsContext.Provider value={{ readings, setReadings }}>
      {children}
    </ReadingsContext.Provider>
  );
};

export default ReadingsProvider;

export const useReadings = () => useContext(ReadingsContext);
