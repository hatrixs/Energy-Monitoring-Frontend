"use client";

import { useEffect } from "react";
import { AreaFilter } from "@/components/dashboard/filters/AreaFilter";
import { SensorFilter } from "@/components/dashboard/filters/SensorFilter";
import { WorkCenterFilter } from "@/components/dashboard/filters/WorkCenterFilter";
import { SimulationControl } from "@/components/dashboard/SimulationControl";
import { websocketService } from "@/lib/services/websocket.service";
import { useFiltersStore } from "@/store/filters.store";
import type { Measurement } from "@/lib/services/websocket.service";

export default function DashboardPage() {
  const { selectedWorkCenter, selectedArea, selectedSensor } = useFiltersStore();

  useEffect(() => {
    // Conectar al WebSocket cuando el componente se monta
    websocketService.connect();

    // Suscribirse a nuevas mediciones
    const handleNewMeasurement = (measurement: Measurement) => {
      console.log('Nueva medición recibida:', measurement);
      // Aquí puedes actualizar el estado o la UI con la nueva medición
    };

    websocketService.subscribe('new:measurement', handleNewMeasurement);

    // Actualizar la suscripción cuando cambien los filtros
    websocketService.subscribeToMeasurements({
      workCenterId: selectedWorkCenter,
      areaId: selectedArea,
      sensorId: selectedSensor,
    });

    // Limpiar al desmontar
    return () => {
      websocketService.unsubscribe('new:measurement', handleNewMeasurement);
      websocketService.disconnect();
    };
  }, [selectedWorkCenter, selectedArea, selectedSensor]);

  return (
    <div className="flex-1 space-y-6">
      <div className="p-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-medium mb-3">Filtros de Monitorización</h2>
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <WorkCenterFilter />
          <AreaFilter />
          <SensorFilter />
        </div>
      </div>      
      <SimulationControl />
    </div>
  );
}
