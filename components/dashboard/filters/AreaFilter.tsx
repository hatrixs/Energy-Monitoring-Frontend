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
  const areas = getAreasByWorkCenter(selectedWorkCenter ?? '');

  return (
    <Select
      value={selectedArea}
      onValueChange={setSelectedArea}
      disabled={!selectedWorkCenter}
    >
      <SelectTrigger className="w-full md:w-[200px]">
        <SelectValue placeholder="Seleccionar área" />
      </SelectTrigger>
      <SelectContent>
        {areas.map((area) => (
          <SelectItem key={area.id} value={area.id}>
            {area.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
