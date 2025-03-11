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

  const { data } = useQuery({
    queryKey: ["workCenters"],
    queryFn: getAllWorkCenters,
  });

  useEffect(() => {
    if (data) setWorkCenters(data);
  }, [data, setWorkCenters]);

  return (
    <Select value={selectedWorkCenter} onValueChange={setSelectedWorkCenter}>
      <SelectTrigger className="w-full md:w-[200px]">
        <SelectValue placeholder="Seleccionar centro" />
      </SelectTrigger>
      <SelectContent>
        {workCenters.map((wc) => (
          <SelectItem key={wc.id} value={wc.id}>
            {wc.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
