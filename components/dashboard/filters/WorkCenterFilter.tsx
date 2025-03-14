"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllWorkCenters } from "@/lib/services/work-centers-service";
import { useFiltersStore } from "@/store/filters.store";
import { useWorkCentersStore } from "@/store/work-centers.store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function WorkCenterFilter() {
  const selectedWorkCenter = useFiltersStore(
    (state) => state.selectedWorkCenter
  );
  const setSelectedWorkCenter = useFiltersStore(
    (state) => state.setSelectedWorkCenter
  );
  const setWorkCenters = useWorkCentersStore((state) => state.setWorkCenters);
  const workCenters = useWorkCentersStore((state) => state.workCenters);

  const { data, isLoading } = useQuery({
    queryKey: ["workCenters"],
    queryFn: getAllWorkCenters,
  });

  useEffect(() => {
    if (data) {
      setWorkCenters(data);
    }
  }, [data, setWorkCenters]);

  // Verificamos si hay centros de trabajo disponibles
  const hasWorkCenters = workCenters && workCenters.length > 0;

  const handleSelectWorkCenter = (value: string) => {
    // Verificar que el centro existe antes de seleccionarlo
    const workCenterExists = workCenters.some((wc) => wc.id === value);
    if (!workCenterExists) {
      return;
    }

    setSelectedWorkCenter(value);
  };

  return (
    <div className="w-full md:w-[200px]">
      <Select
        value={selectedWorkCenter}
        onValueChange={handleSelectWorkCenter}
        disabled={isLoading || !hasWorkCenters}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccionar centro" />
        </SelectTrigger>
        <SelectContent>
          {hasWorkCenters ? (
            workCenters.map((wc) => (
              <SelectItem key={wc.id} value={wc.id}>
                {String(wc.name).toUpperCase()}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-work-centers" disabled>
              No hay centros de trabajo disponibles
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
