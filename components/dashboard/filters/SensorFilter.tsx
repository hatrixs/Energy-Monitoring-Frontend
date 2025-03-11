import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFiltersStore } from "@/store/filters.store";
import { useWorkCentersStore } from "@/store/work-centers.store";

export function SensorFilter() {
  const selectedSensor = useFiltersStore((state) => state.selectedSensor);
  const setSelectedSensor = useFiltersStore((state) => state.setSelectedSensor);
  const selectedArea = useFiltersStore((state) => state.selectedArea);

  const getSensorsByArea = useWorkCentersStore((state) => state.getSensorsByArea);
  const sensors = getSensorsByArea(selectedArea);

  return (
    <Select
      value={selectedSensor}
      onValueChange={setSelectedSensor}
      disabled={!selectedArea}
    >
      <SelectTrigger className="w-full md:w-[200px]">
        <SelectValue placeholder="Seleccionar sensor" />
      </SelectTrigger>
      <SelectContent>
        {sensors.map((sensor) => (
          <SelectItem key={sensor.id} value={sensor.id}>
            {sensor.sensorId}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 