import { axiosInstance } from "@/lib/axios";

interface Sensor {
  id: string;
  sensorId: string;
}

interface Area {
  id: string;
  name: string;
  sensors: Sensor[];
}

export interface WorkCenter {
  id: string;
  name: string;
  areas: Area[];
}

export const getAllWorkCenters = async (): Promise<WorkCenter[]> => {
  const response = await axiosInstance.get<WorkCenter[]>("/work-centers");
  return response.data;
};
