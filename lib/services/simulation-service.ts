// frontend/lib/services/simulation-service.ts
import { axiosInstance } from "@/lib/axios";

interface SimulationConfig {
  workCenter: string;
  area?: string;
  sensorId?: string;
  intervalSeconds: number;
  voltageBase?: number;
  currentBase?: number;
  apiKey: string;
}

export interface SimulationStatus {
  isRunning: boolean;
  lastSent?: Date;
  count: number;
}

let simulationInterval: number | null = null;
const status: SimulationStatus = {
  isRunning: false,
  count: 0,
};

// Función auxiliar para generar variaciones aleatorias
const randomVariation = (base: number, variancePct: number = 5): number => {
  const variance = (base * variancePct) / 100;
  return base + (Math.random() * variance * 2 - variance);
};

// Formatea la fecha correctamente: yyyy-mm-dd
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Envía una medición individual
const sendMeasurement = async (config: SimulationConfig): Promise<void> => {
  const now = new Date();
  // Usa formato estricto yyyy-mm-dd
  const date = formatDate(now);
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const voltageBase = config.voltageBase || 110;
  const currentBase = config.currentBase || 25;

  const payload = {
    workCenter: config.workCenter,
    area: config.area,
    sensorId: config.sensorId,
    date,
    time,
    voltage: Number(randomVariation(voltageBase, 8).toFixed(2)),
    current: Number(randomVariation(currentBase, 10).toFixed(2)),
  };

  try {
    await axiosInstance.post("/measurements", payload, {
      headers: {
        "x-api-key": config.apiKey,
      },
    });
    
    status.lastSent = now;
    status.count++;
    
    console.log("Medición enviada:", payload);
  } catch (error) {
    console.error("Error al enviar medición:", error);
  }
};

// Iniciar la simulación
export const startSimulation = (config: SimulationConfig): SimulationStatus => {
  if (simulationInterval) {
    window.clearInterval(simulationInterval);
  }
  
  // Enviar una medición inmediatamente
  sendMeasurement(config);
  
  // Configurar el intervalo para enviar mediciones periódicamente
  simulationInterval = window.setInterval(() => {
    sendMeasurement(config);
  }, config.intervalSeconds * 1000);
  
  status.isRunning = true;
  return { ...status };
};

// Detener la simulación
export const stopSimulation = (): SimulationStatus => {
  if (simulationInterval) {
    window.clearInterval(simulationInterval);
    simulationInterval = null;
  }
  
  status.isRunning = false;
  return { ...status };
};

// Obtener el estado actual
export const getSimulationStatus = (): SimulationStatus => {
  return { ...status };
};