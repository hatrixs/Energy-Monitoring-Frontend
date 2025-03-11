import { create } from "zustand";
import { WorkCenter } from "@/lib/services/work-centers-service";

interface WorkCentersState {
  workCenters: WorkCenter[];
  setWorkCenters: (workCenters: WorkCenter[]) => void;
  getAreasByWorkCenter: (workCenterId: string) => WorkCenter["areas"];
  getSensorsByArea: (areaId: string) => WorkCenter["areas"][number]["sensors"];
}

export const useWorkCentersStore = create<WorkCentersState>((set, get) => ({
  workCenters: [],
  setWorkCenters: (workCenters) => set({ workCenters }),
  getAreasByWorkCenter: (workCenterId) => {
    const workCenter = get().workCenters.find((wc) => wc.id === workCenterId);
    return workCenter?.areas ?? [];
  },
  getSensorsByArea: (areaId) => {
    const area = get().workCenters
      .flatMap((wc) => wc.areas)
      .find((area) => area.id === areaId);
    return area?.sensors ?? [];
  },
})); 