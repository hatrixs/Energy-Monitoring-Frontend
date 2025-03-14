"use client";

import { useEffect, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFiltersStore } from "@/store/filters.store";
import { useWorkCentersStore } from "@/store/work-centers.store";

export function SensorFilter() {
  const selectedSensor = useFiltersStore((state) => state.selectedSensor);
  const setSelectedSensor = useFiltersStore((state) => state.setSelectedSensor);
  const selectedArea = useFiltersStore((state) => state.selectedArea);
  const selectedWorkCenter = useFiltersStore((state) => state.selectedWorkCenter);

  const getSensorsByArea = useWorkCentersStore((state) => state.getSensorsByArea);
  
  // Memorizamos el resultado para evitar recrear el array en cada renderizado
  const sensors = useMemo(() => 
    selectedArea ? getSensorsByArea(selectedArea) : [],
    [selectedArea, getSensorsByArea]
  );

  // Resetear el sensor seleccionado cuando cambia el área o el centro de trabajo
  useEffect(() => {
    if (selectedSensor && selectedArea) {
      // Verificar si el sensor seleccionado pertenece al área actual
      const sensorExists = sensors.some(s => s.id === selectedSensor);
      
      if (!sensorExists) {
        setSelectedSensor(undefined);
      }
    } else if (selectedSensor && !selectedArea) {
      setSelectedSensor(undefined);
    }
  }, [selectedArea, selectedWorkCenter, setSelectedSensor, selectedSensor, sensors]);

  // Verificamos si hay sensores disponibles para mostrar
  const hasSensors = sensors && sensors.length > 0;


  return (
    <div className="w-full md:w-[200px]">
      <Select
        value={selectedSensor}
        onValueChange={setSelectedSensor}
        disabled={!selectedArea || !hasSensors}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccionar sensor" />
        </SelectTrigger>
        <SelectContent>
          {hasSensors ? (
            sensors.map((sensor) => (
              <SelectItem key={sensor.id} value={sensor.id}>
                {String(sensor.sensorId).toUpperCase()}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-sensors" disabled>
              No hay sensores disponibles
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
} 