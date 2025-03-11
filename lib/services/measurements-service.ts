import { axiosInstance } from "@/lib/axios";

interface Measurement {
  id: string;
  date: string;
  voltage: number;
  current: number;
  sensorId: string;
}

interface MeasurementsResponse {
  items: Measurement[];
  total: number;
  page: number;
  limit: number;
}

export const getMeasurementsBySensor = async (
  sensorId: string,
  page = 1,
  limit = 10
): Promise<MeasurementsResponse> => {
  const response = await axiosInstance.get<MeasurementsResponse>(
    `/measurements/sensor/${sensorId}?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const getMeasurementsByArea = async (
  areaId: string,
  page = 1,
  limit = 10
): Promise<MeasurementsResponse> => {
  const response = await axiosInstance.get<MeasurementsResponse>(
    `/measurements/area/${areaId}?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const getMeasurementsByWorkCenter = async (
  workCenterId: string,
  page = 1,
  limit = 10
): Promise<MeasurementsResponse> => {
  const response = await axiosInstance.get<MeasurementsResponse>(
    `/measurements/work-center/${workCenterId}?page=${page}&limit=${limit}`
  );
  return response.data;
};
