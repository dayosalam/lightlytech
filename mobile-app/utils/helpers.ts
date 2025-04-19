export const totalEnergy = (energy_kwh: number[]) => {
  return energy_kwh.reduce((total, current) => total + current, 0).toFixed(2);
};