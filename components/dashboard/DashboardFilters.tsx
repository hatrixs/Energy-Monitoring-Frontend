import { DateRangeFilter } from "./filters/DateRangeFilter";
import { WorkCenterFilter } from "./filters/WorkCenterFilter";
import { AreaFilter } from "./filters/AreaFilter";
import { SensorFilter } from "./filters/SensorFilter";

export function DashboardFilters() {
  return (
    <div className="flex flex-wrap gap-4">
      <DateRangeFilter />
      <WorkCenterFilter />
      <AreaFilter />
      <SensorFilter />
    </div>
  );
}
