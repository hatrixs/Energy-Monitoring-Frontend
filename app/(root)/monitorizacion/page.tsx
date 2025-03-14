import { AreaFilter } from "@/components/dashboard/filters/AreaFilter";
import { SensorFilter } from "@/components/dashboard/filters/SensorFilter";
import { WorkCenterFilter } from "@/components/dashboard/filters/WorkCenterFilter";
import { SimulationControl } from "@/components/dashboard/SimulationControl";

export default function DashboardPage() {
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
