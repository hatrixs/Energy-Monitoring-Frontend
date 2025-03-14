import { api } from '@/lib/api';

// Interfaz para los filtros de mediciones
export interface MeasurementsFilter {
  workCenterId?: string;
  areaId?: string;
  sensorId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Interfaz para el resultado paginado
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Interfaz para la entidad de medición
export interface Measurement {
  id: string;
  voltage: number;
  current: number;
  date: string;
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

/**
 * Obtiene mediciones filtradas desde el backend
 * @param filters Filtros para las mediciones
 * @returns Resultado paginado con las mediciones
 */
export const getMeasurements = async (
  filters: MeasurementsFilter = {},
): Promise<PaginatedResult<Measurement>> => {
  try {
    // Construimos los parámetros de consulta
    const params = new URLSearchParams();

    if (filters.workCenterId) {
      params.append('workCenterId', filters.workCenterId);
    }

    if (filters.areaId) {
      params.append('areaId', filters.areaId);
    }

    if (filters.sensorId) {
      params.append('sensorId', filters.sensorId);
    }

    if (filters.startDate) {
      params.append('startDate', filters.startDate);
    }

    if (filters.endDate) {
      params.append('endDate', filters.endDate);
    }

    if (filters.page) {
      params.append('page', filters.page.toString());
    }

    if (filters.limit) {
      params.append('limit', filters.limit.toString());
    }

    // Hacemos la petición al endpoint
    const response = await api.get(`/measurements?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener mediciones:', error);
    // Devolvemos un resultado vacío en caso de error
    return {
      data: [],
      meta: {
        total: 0,
        page: 1,
        lastPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
};

/**
 * Obtiene mediciones por centro de trabajo
 * @param workCenterId ID del centro de trabajo
 * @param page Número de página
 * @param limit Cantidad de resultados por página
 * @returns Resultado paginado con las mediciones
 */
export const getMeasurementsByWorkCenter = async (
  workCenterId: string,
  page = 1,
  limit = 10,
): Promise<PaginatedResult<Measurement>> => {
  try {
    const response = await api.get(
      `/measurements/work-center/${workCenterId}?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener mediciones por centro de trabajo:', error);
    return {
      data: [],
      meta: {
        total: 0,
        page,
        lastPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
};

/**
 * Obtiene mediciones por área
 * @param areaId ID del área
 * @param page Número de página
 * @param limit Cantidad de resultados por página
 * @returns Resultado paginado con las mediciones
 */
export const getMeasurementsByArea = async (
  areaId: string,
  page = 1,
  limit = 10,
): Promise<PaginatedResult<Measurement>> => {
  try {
    const response = await api.get(
      `/measurements/area/${areaId}?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener mediciones por área:', error);
    return {
      data: [],
      meta: {
        total: 0,
        page,
        lastPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
};

/**
 * Obtiene mediciones por sensor
 * @param sensorId ID del sensor
 * @param page Número de página
 * @param limit Cantidad de resultados por página
 * @returns Resultado paginado con las mediciones
 */
export const getMeasurementsBySensor = async (
  sensorId: string,
  page = 1,
  limit = 10,
): Promise<PaginatedResult<Measurement>> => {
  try {
    const response = await api.get(
      `/measurements/sensor/${sensorId}?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener mediciones por sensor:', error);
    return {
      data: [],
      meta: {
        total: 0,
        page,
        lastPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
};
