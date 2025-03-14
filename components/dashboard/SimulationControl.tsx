"use client";

import { useEffect, useState } from "react";
import { 
  AlertCircle, 
  PlayCircle,
  StopCircle,
  RefreshCw
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFiltersStore } from "@/store/filters.store";
import { useWorkCentersStore } from "@/store/work-centers.store";
import { startSimulation, stopSimulation, getSimulationStatus, SimulationStatus } from "@/lib/services/simulation-service";

const API_KEY = "6db0d9f129083e2d9bb11c2ae339fbf2c29960c6256966f80bdc8a1bea209ff3";

export function SimulationControl() {
  const { selectedWorkCenter, selectedArea, selectedSensor } = useFiltersStore();
  const workCenters = useWorkCentersStore((state) => state.workCenters);
  const getAreasByWorkCenter = useWorkCentersStore((state) => state.getAreasByWorkCenter);
  const getSensorsByArea = useWorkCentersStore((state) => state.getSensorsByArea);
  
  const [status, setStatus] = useState<SimulationStatus>({ isRunning: false, count: 0 });
  
  // Seleccionar los datos relevantes según filtros
  const workCenter = workCenters.find(wc => wc.id === selectedWorkCenter);
  const areas = selectedWorkCenter ? getAreasByWorkCenter(selectedWorkCenter) : [];
  const area = areas.find(a => a.id === selectedArea);
  const sensors = selectedArea ? getSensorsByArea(selectedArea) : [];
  const sensor = sensors.find(s => s.id === selectedSensor);
  
  // Actualizar estado de simulación periódicamente
  useEffect(() => {
    const updateTimer = window.setInterval(() => {
      if (status.isRunning) {
        setStatus(getSimulationStatus());
      }
    }, 1000);
    
    return () => window.clearInterval(updateTimer);
  }, [status.isRunning]);
  
  const handleStartSimulation = () => {
    if (!workCenter || !area || !sensor) {
      alert("Por favor selecciona un centro de trabajo, área y sensor");
      return;
    }
    
    const config = {
      workCenter: workCenter.name,
      area: area.name,
      sensorId: sensor.sensorId,
      intervalSeconds: 5,
      apiKey: API_KEY
    };
    
    setStatus(startSimulation(config));
  };
  
  const handleStopSimulation = () => {
    setStatus(stopSimulation());
  };
  
  return (
    <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <RefreshCw className="mr-2 h-5 w-5 text-emerald-500" />
          Simulador de Mediciones
        </CardTitle>
        <CardDescription>
          Envía mediciones simuladas a la API para pruebas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Información de selección */}
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Centro:</span>
            <span className="font-medium">{workCenter?.name ? String(workCenter.name).toUpperCase() : "No seleccionado"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Área:</span>
            <span className="font-medium">{area?.name ? String(area.name).toUpperCase() : "No seleccionado"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Sensor:</span>
            <span className="font-medium">{sensor?.sensorId ? String(sensor.sensorId).toUpperCase() : "No seleccionado"}</span>
          </div>
        </div>
        
        {/* Alertas y estado */}
        {(!workCenter || !area || !sensor) && (
          <div className="flex items-center gap-2 rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-2 text-xs text-yellow-800 dark:text-yellow-300">
            <AlertCircle className="h-4 w-4" />
            <span>Selecciona un centro de trabajo, área y sensor para iniciar</span>
          </div>
        )}
        
        {status.isRunning && status.lastSent && (
          <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Última medición:</span>
              <span className="font-mono">
                {status.lastSent.toLocaleTimeString()}
              </span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-gray-600 dark:text-gray-300">Total enviadas:</span>
              <span className="font-mono">{status.count}</span>
            </div>
          </div>
        )}
        
        {/* Botones de control */}
        <div className="flex justify-end pt-2">
          {!status.isRunning ? (
            <Button 
              onClick={handleStartSimulation}
              disabled={!workCenter || !area || !sensor}
              className="bg-emerald-500 hover:bg-emerald-600 w-full md:w-auto"
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Iniciar Simulación
            </Button>
          ) : (
            <Button 
              onClick={handleStopSimulation}
              variant="destructive"
              className="w-full md:w-auto"
            >
              <StopCircle className="mr-2 h-4 w-4" />
              Detener Simulación
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
