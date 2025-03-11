import { axiosInstance } from "@/lib/axios";

interface Measurement {
  id: string;
  date: string;
  voltage: number;
  current: number;
  sensor: {
    id: string;
    sensorId: string;
    area: {
      id: string;
      name: string;
      workCenter: {
        id: string;
        name: string;
      };
    };
  };
}

interface MeasurementsResponse {
  data: Measurement[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

interface MeasurementsFilter {
  dateRange?: {
    from: Date;
    to: Date;
  };
  areaId?: string;
  sensorId?: string;
  workCenterId?: string;
}

export const getMeasurements = async (
  filters: MeasurementsFilter,
  page = 1,
  limit = 100
): Promise<MeasurementsResponse> => {
  const response = await axiosInstance.get<MeasurementsResponse>(`/measurements`, {
    params: {
      ...(filters.dateRange?.from && { startDate: filters.dateRange.from.toISOString() }),
      ...(filters.dateRange?.to && { endDate: filters.dateRange.to.toISOString() }),
      ...(filters.areaId && { areaId: filters.areaId }),
      ...(filters.sensorId && { sensorId: filters.sensorId }),
      ...(filters.workCenterId && { workCenterId: filters.workCenterId }),
      page,
      limit,
    },
  });
  return response.data
};

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
