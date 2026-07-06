export interface BusRecord {
  bus_id: string;
  registration_number: string;
  driver_name: string;
  route: string;
  capacity: number;
  status: string;
}

export function getSampleBuses(): BusRecord[] {
  return Array.from({ length: 50 }, (_, index) => {
    const busNumber = index + 1;
    const busId = `BUS${String(busNumber).padStart(3, "0")}`;
    return {
      bus_id: busId,
      registration_number: `AP39TB${String(busNumber).padStart(4, "0")}`,
      driver_name: `Driver ${busNumber}`,
      route: `Route ${((busNumber % 5) + 1)}`,
      capacity: 40 + (busNumber % 4) * 10,
      status: "Active",
    };
  });
}
