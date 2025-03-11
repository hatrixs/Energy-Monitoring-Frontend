import { DateRange } from "react-day-picker";

export interface StatisticsFilter {
  dateRange?: DateRange;
  areaId?: string;
  sensorId?: string;
  workCenterId?: string;
}
