"use client";

import { useQuery } from "@tanstack/react-query";
import { useFiltersStore } from "@/store/filters.store";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { StatisticsCards } from "@/components/dashboard/StatisticsCards";
import { getBasicStatistics } from "@/lib/services/statistics-service";

export default function DashboardPage() {
  const { dateRange, selectedArea, selectedSensor, selectedWorkCenter } =
    useFiltersStore();

  const { data, isLoading } = useQuery({
    queryKey: [
      "basicStats",
      dateRange,
      selectedArea,
      selectedSensor,
      selectedWorkCenter,
    ],
    queryFn: () =>
      getBasicStatistics({
        dateRange: dateRange,
        areaId: selectedArea,
        sensorId: selectedSensor,
        workCenterId: selectedWorkCenter,
      }),
  });

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Reportes</h2>
      </div>

      <DashboardFilters />
      <StatisticsCards data={data} isLoading={isLoading} />
    </div>
  );
}
