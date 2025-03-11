import { DateRangeFilter } from "./filters/DateRangeFilter";
import { AreaFilter } from "./filters/AreaFilter";
import { WorkCenterFilter } from "./filters/WorkCenterFilter";
import { SensorFilter } from "./filters/SensorFilter";

export function DashboardFilters() {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <DateRangeFilter />
      <WorkCenterFilter />
      <AreaFilter />
      <SensorFilter />
    </div>
  );
}
