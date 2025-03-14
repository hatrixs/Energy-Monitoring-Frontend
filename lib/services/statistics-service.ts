import { AxiosError } from "axios";
import { api } from "@/lib/api";
import { DateRange } from "react-day-picker";

// Interfaz para los filtros de estadísticas
export interface StatisticsFilter {
  dateRange?: DateRange;
  areaId?: string;
  sensorId?: string;
  workCenterId?: string;
  startDate?: string;
  endDate?: string;
}

// Interfaz para las estadísticas devueltas por el backend
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

/**
 * Obtiene estadísticas básicas aplicando filtros
 * @param filters Filtros para las estadísticas
 * @returns Estadísticas de voltaje y corriente
 */
export const getBasicStatistics = async (
  filters: StatisticsFilter
): Promise<Statistics> => {
  try {
    // Preparamos los parámetros para la consulta
    const params: Record<string, string> = {};

    // Si hay un rango de fechas, lo convertimos a strings
    if (filters.dateRange?.from) {
      params.startDate = new Date(filters.dateRange.from).toISOString().split('T')[0];
    } else if (filters.startDate) {
      params.startDate = filters.startDate;
    }

    if (filters.dateRange?.to) {
      params.endDate = new Date(filters.dateRange.to).toISOString().split('T')[0];
    } else if (filters.endDate) {
      params.endDate = filters.endDate;
    }

    // Añadimos el resto de filtros
    if (filters.workCenterId) {
      params.workCenterId = filters.workCenterId;
    }

    if (filters.areaId) {
      params.areaId = filters.areaId;
    }

    if (filters.sensorId) {
      params.sensorId = filters.sensorId;
    }

    // Realizamos la consulta
    const { data } = await api.get<Statistics>(`/statistics`, { params });
    
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error al obtener estadísticas:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Error al obtener estadísticas básicas"
      );
    }
    console.error("Error inesperado:", error);
    throw error;
  }
};
