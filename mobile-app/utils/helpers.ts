// calculate total energy
export const totalEnergy = (energy_kwh: number[]) => {
  if (!energy_kwh || energy_kwh.length === 0) {
    return "0.00";
  }
  return energy_kwh
    .reduce((total, current) => total + (current || 0), 0)
    .toFixed(2);
};
