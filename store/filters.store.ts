import { create } from "zustand";
import { DateRange } from "react-day-picker";

interface FiltersState {
  dateRange: DateRange | undefined;
  selectedWorkCenter: string | undefined;
  selectedArea: string | undefined;
  selectedSensor: string | undefined;
  setDateRange: (dateRange: DateRange | undefined) => void;
  setSelectedWorkCenter: (workCenterId: string | undefined) => void;
  setSelectedArea: (areaId: string | undefined) => void;
  setSelectedSensor: (sensorId: string | undefined) => void;
  reset: () => void;
}

export const useFiltersStore = create<FiltersState>((set) => ({
  dateRange: undefined,
  selectedWorkCenter: undefined,
  selectedArea: undefined,
  selectedSensor: undefined,
  setDateRange: (dateRange) => set({ dateRange }),
  setSelectedWorkCenter: (workCenterId) => set({ selectedWorkCenter: workCenterId }),
  setSelectedArea: (areaId) => set({ selectedArea: areaId }),
  setSelectedSensor: (sensorId) => set({ selectedSensor: sensorId }),
  reset: () => set({
    dateRange: undefined,
    selectedWorkCenter: undefined,
    selectedArea: undefined,
    selectedSensor: undefined,
  }),
}));
