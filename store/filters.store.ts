import { create } from "zustand";
import { DateRange } from "react-day-picker";

interface FiltersState {
  dateRange?: DateRange;
  selectedArea?: string;
  selectedSensor?: string;
  selectedWorkCenter?: string;
  setDateRange: (dateRange: DateRange | undefined) => void;
  setSelectedArea: (areaId: string) => void;
  setSelectedSensor: (sensorId: string) => void;
  setSelectedWorkCenter: (workCenterId: string) => void;
}

export const useFiltersStore = create<FiltersState>((set) => ({
  dateRange: undefined,
  selectedArea: undefined,
  selectedSensor: undefined,
  selectedWorkCenter: undefined,
  setDateRange: (dateRange) => set({ dateRange }),
  setSelectedArea: (areaId) => set({ selectedArea: areaId }),
  setSelectedSensor: (sensorId) => set({ selectedSensor: sensorId }),
  setSelectedWorkCenter: (workCenterId) =>
    set({ selectedWorkCenter: workCenterId }),
}));
