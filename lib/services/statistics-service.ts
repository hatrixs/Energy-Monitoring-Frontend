import { AxiosError } from "axios";
import { axiosInstance } from "@/lib/axios";
import { StatisticsFilter } from "@/types/statistics";

export interface Statistics {
  voltage: {
    avg: number;
    max: number;
    min: number;
  };
  current: {
    avg: number;
    max: number;
    min: number;
  };
}

export const getBasicStatistics = async ({
  dateRange,
  areaId,
  sensorId,
  workCenterId,
}: StatisticsFilter): Promise<Statistics> => {
  try {
    const { data } = await axiosInstance.get<Statistics>(`/statistics`, {
      params: {
        ...(dateRange?.from && { startDate: dateRange.from.toISOString() }),
        ...(dateRange?.to && { endDate: dateRange.to.toISOString() }),
        ...(areaId && { areaId }),
        ...(sensorId && { sensorId }),
        ...(workCenterId && { workCenterId }),
      },
    });
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Error al obtener estadísticas básicas"
      );
    }
    throw error;
  }
};
