import { createContext, useState, useContext, useEffect } from "react";
import { getReadings } from "@/api/readings";
import { sensor_readings } from "@/interfaces";
import { supabase } from "@/lib/supabase";

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
    // Initial fetch of readings
    const fetchReadings = async () => {
      try {
        const readingsData = await getReadings();
        setReadings(readingsData.sensor_readings);
      } catch (error) {
        console.error("Error fetching readings:", error);
      }
    };
    fetchReadings();

    // Set up real-time subscription
    const subscription = supabase
      .channel('data_records_changes')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'data_records' },
        (payload) => {
          // Update the readings with the new data
          setReadings(prevReadings => {
            // If the updated record is already in our list, replace it
            const updatedIndex = prevReadings.findIndex(reading => reading.id === payload.new.id);
            if (updatedIndex >= 0) {
              const newReadings = [...prevReadings];
              newReadings[updatedIndex] = payload.new;
              return newReadings;
            }
            // If it's a new record, add it to the beginning
            return [payload.new, ...prevReadings];
          });
        }
      )
      .subscribe();

    // Clean up subscription when component unmounts
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <ReadingsContext.Provider value={{ readings, setReadings }}>
      {children}
    </ReadingsContext.Provider>
  );
};

export default ReadingsProvider;

export const useReadings = () => useContext(ReadingsContext);
