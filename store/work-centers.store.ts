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
  
  setWorkCenters: (workCenters) => {
    set({ workCenters });
  },
  
  getAreasByWorkCenter: (workCenterId) => {
    if (!workCenterId) {
      return [];
    }
    
    const allWorkCenters = get().workCenters;
    const workCenter = allWorkCenters.find((wc) => wc.id === workCenterId);
    
    if (!workCenter) {
      return [];
    }
    
    return workCenter.areas || [];
  },
  
  getSensorsByArea: (areaId) => {
    if (!areaId) {
      return [];
    }
    
    const allWorkCenters = get().workCenters;
    
    // Busca el área específica en todos los centros de trabajo
    let foundArea = null;
    for (const wc of allWorkCenters) {
      if (!wc.areas) continue;
      
      const area = wc.areas.find(a => a.id === areaId);
      if (area) {
        foundArea = area;
        break;
      }
    }
    
    if (!foundArea) {
      return [];
    }
    
    return foundArea.sensors || [];
  }
})); 
