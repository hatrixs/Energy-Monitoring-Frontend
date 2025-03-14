"use client";

import { useEffect, useState } from "react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFiltersStore } from "@/store/filters.store";
import { useWorkCentersStore } from "@/store/work-centers.store";
import {
  websocketService,
  type Measurement,
} from "@/lib/services/websocket.service";

const chartConfig = {
  voltage: {
    label: "Voltaje",
    color: "#2563eb", // Azul
  },
  current: {
    label: "Corriente",
    color: "#10b981", // Verde
  },
} satisfies ChartConfig;

// Solo vamos a mantener un número limitado de puntos de datos en la gráfica
const MAX_DATA_POINTS = 20;

export function MeasurementChart() {
  const { selectedWorkCenter, selectedArea, selectedSensor } = useFiltersStore();
  
  // Obtenemos las colecciones y las funciones para obtener información
  const workCenters = useWorkCentersStore(state => state.workCenters);
  const getAreasByWorkCenter = useWorkCentersStore(state => state.getAreasByWorkCenter);
  const getSensorsByArea = useWorkCentersStore(state => state.getSensorsByArea);
  
  // Buscamos los nombres/etiquetas correspondientes a los IDs seleccionados
  const workCenterObj = workCenters.find(wc => wc.id === selectedWorkCenter);
  const workCenterName = workCenterObj?.name;
  
  const areas = selectedWorkCenter ? getAreasByWorkCenter(selectedWorkCenter) : [];
  const areaObj = areas.find(a => a.id === selectedArea);
  const areaName = areaObj?.name;
  
  const sensors = selectedArea ? getSensorsByArea(selectedArea) : [];
  const sensorObj = sensors.find(s => s.id === selectedSensor);
  const sensorIdValue = sensorObj?.sensorId;
  
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  const canShowChart = Boolean(
    selectedWorkCenter && selectedArea && selectedSensor
  ) || debugMode;

  // Efecto para manejar la conexión al WebSocket
  useEffect(() => {
    // Conectar al WebSocket cuando el componente se monta
    websocketService.connect();
    setIsConnected(true);

    // Limpiar al desmontar
    return () => {
      websocketService.disconnect();
      setIsConnected(false);
    };
  }, []);

  // Efecto para manejar las suscripciones basadas en los filtros
  useEffect(() => {
    if (!canShowChart) {
      setMeasurements([]);
      return;
    }

    // Solo mostrar logs en modo debug
    if (debugMode) {
      console.log("Filtros seleccionados:", {
        workCenter: {
          id: selectedWorkCenter,
          name: workCenterName
        },
        area: {
          id: selectedArea,
          name: areaName
        },
        sensor: {
          id: selectedSensor,
          sensorId: sensorIdValue
        }
      });
    }

    // Actualizar la suscripción cuando cambien los filtros
    websocketService.subscribeToMeasurements({
      workCenterId: selectedWorkCenter,
      areaId: selectedArea,
      sensorId: selectedSensor,
    });

    // Manejador para nuevas mediciones
    const handleNewMeasurement = (measurement: Measurement) => {
      // Solo loguear en modo debug
      if (debugMode) {
        console.log("Nueva medición recibida:", measurement);
      }
      
      // En modo depuración, aceptamos todas las mediciones
      if (debugMode) {
        setMeasurements((prevMeasurements) => {
          const newMeasurements = [...prevMeasurements, measurement];
          return newMeasurements.slice(-MAX_DATA_POINTS);
        });
        return;
      }
      
      // Solo guardar mediciones que coincidan con los filtros seleccionados
      // La comparación se hace con los nombres/etiquetas, no con los IDs
      if (
        (workCenterName && 
         measurement.workCenter.toLowerCase() !== workCenterName.toLowerCase()) ||
        (areaName && 
         measurement.area.toLowerCase() !== areaName.toLowerCase()) ||
        (sensorIdValue && 
         measurement.sensorId.toLowerCase() !== sensorIdValue.toLowerCase())
      ) {
        // Este log es útil mantenerlo para depurar problemas de filtro
        if (debugMode) {
          console.log("Comparación fallida:", {
            workCenter: { 
              selected: workCenterName, 
              received: measurement.workCenter 
            },
            area: { 
              selected: areaName, 
              received: measurement.area 
            },
            sensor: { 
              selected: sensorIdValue, 
              received: measurement.sensorId 
            }
          });
        }
        return;
      }

      setMeasurements((prevMeasurements) => {
        // Este log no es necesario
        const newMeasurements = [...prevMeasurements, measurement];
        return newMeasurements.slice(-MAX_DATA_POINTS);
      });
    };

    websocketService.subscribe("new:measurement", handleNewMeasurement);

    // Limpiar al desmontar o cuando cambien los filtros
    return () => {
      websocketService.unsubscribe("new:measurement", handleNewMeasurement);
    };
  }, [
    selectedWorkCenter, 
    selectedArea, 
    selectedSensor, 
    workCenterName,
    areaName,
    sensorIdValue,
    canShowChart, 
    debugMode,
    workCenters,
    getAreasByWorkCenter,
    getSensorsByArea
  ]);

  // Formatear los datos para la gráfica
  const chartData = measurements.map((m, index) => ({
    id: index,
    timestamp: `${m.time}`,
    voltage: m.voltage,
    current: m.current,
  }));

  if (!canShowChart) {
    return null; // No mostrar nada si no se han seleccionado los filtros
  }

  return (
    <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Mediciones en Tiempo Real</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setDebugMode(!debugMode)}
            className={debugMode ? "bg-yellow-100 dark:bg-yellow-900/30" : ""}
          >
            {debugMode ? "Modo Debug: ON" : "Modo Debug: OFF"}
          </Button>
        </div>
        {isConnected ? (
          <div className="text-xs text-emerald-600 flex items-center">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1"></span>
            Conectado al servidor
          </div>
        ) : (
          <div className="text-xs text-red-600 flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
            Desconectado del servidor
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Centro:</span>
            <span className="font-medium">{debugMode ? "Modo Debug" : workCenterName || selectedWorkCenter || "No seleccionado"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Área:</span>
            <span className="font-medium">{debugMode ? "Modo Debug" : areaName || selectedArea || "No seleccionado"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Sensor:</span>
            <span className="font-medium">{debugMode ? "Modo Debug" : sensorIdValue || selectedSensor || "No seleccionado"}</span>
          </div>
          {debugMode && (
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs text-yellow-800 dark:text-yellow-300">
              Modo depuración activado: mostrando todas las mediciones sin filtrar
            </div>
          )}
        </div>

        {measurements.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Esperando datos del sensor...
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="min-h-[300px] max-h-[500px] h-[400px] lg:h-[450px] w-full">
            <LineChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                yAxisId="left"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                domain={["auto", "auto"]}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="voltage"
                stroke="var(--color-voltage)"
                strokeWidth={2}
                dot={{ fill: "var(--color-voltage)", r: 4 }}
                activeDot={{ r: 6 }}
                yAxisId="left"
              />
              <Line
                type="monotone"
                dataKey="current"
                stroke="var(--color-current)"
                strokeWidth={2}
                dot={{ fill: "var(--color-current)", r: 4 }}
                activeDot={{ r: 6 }}
                yAxisId="left"
              />
            </LineChart>
          </ChartContainer>
        )}

        {debugMode && measurements.length > 0 && (
          <div className="mt-4 text-xs overflow-auto max-h-[150px] border rounded p-2">
            <h4 className="font-medium mb-2">Datos Recibidos (Debug):</h4>
            <pre>{JSON.stringify(measurements, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
