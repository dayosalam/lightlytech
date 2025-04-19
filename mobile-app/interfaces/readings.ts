export interface sensor_readings {
  bill: number;
  created_at: string;
  currents: number[];
  energy_kwh: number[];
  id: string;
  power_watts: number[];
  recorded_at: string;
  total_energy: number;
}