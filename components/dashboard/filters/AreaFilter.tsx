"use client";

import { useEffect, useMemo } from "react";
import { useFiltersStore } from "@/store/filters.store";
import { useWorkCentersStore } from "@/store/work-centers.store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AreaFilter() {
  const selectedArea = useFiltersStore((state) => state.selectedArea);
  const setSelectedArea = useFiltersStore((state) => state.setSelectedArea);
  const selectedWorkCenter = useFiltersStore(
    (state) => state.selectedWorkCenter
  );
  
  const getAreasByWorkCenter = useWorkCentersStore((state) => state.getAreasByWorkCenter);
  
  // Memorizamos el resultado para evitar recrear el array en cada renderizado
  const areas = useMemo(() => 
    selectedWorkCenter ? getAreasByWorkCenter(selectedWorkCenter) : [],
    [selectedWorkCenter, getAreasByWorkCenter]
  );

  // Resetear el área seleccionada cuando cambia el centro de trabajo
  useEffect(() => {
    if (selectedArea && selectedWorkCenter) {
      // Verificar si el área seleccionada pertenece al centro de trabajo actual
      const areaExists = areas.some(a => a.id === selectedArea);
      
      if (!areaExists) {
        setSelectedArea(undefined);
      }
    }
  }, [selectedWorkCenter, setSelectedArea, selectedArea, areas]);

  // Verificamos si hay áreas disponibles
  const hasAreas = areas && areas.length > 0;

  return (
    <div className="w-full md:w-[200px]">
      <Select
        value={selectedArea}
        onValueChange={setSelectedArea}
        disabled={!selectedWorkCenter || !hasAreas}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccionar área" />
        </SelectTrigger>
        <SelectContent>
          {hasAreas ? (
            areas.map((area) => (
              <SelectItem key={area.id} value={area.id}>
                {String(area.name).toUpperCase()}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-areas" disabled>
              No hay áreas disponibles
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      
      {selectedWorkCenter && !hasAreas && (
        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
          Este centro no tiene áreas configuradas
        </p>
      )}
    </div>
  );
}
