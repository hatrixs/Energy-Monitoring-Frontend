"use client";

import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { useFiltersStore } from "@/store/filters.store";

export function DateRangeFilter() {
  const dateRange = useFiltersStore((state) => state.dateRange);
  const setDateRange = useFiltersStore((state) => state.setDateRange);

  return (
    <DatePickerWithRange
      value={dateRange}
      onChange={setDateRange}
      className="w-full md:w-[300px]"
    />
  );
}
