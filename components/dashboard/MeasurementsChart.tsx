"use client";

import { useQuery } from "@tanstack/react-query";
import { useFiltersStore } from "@/store/filters.store";
import { getMeasurements } from "@/lib/services/measurements-service";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardFilters } from "./DashboardFilters";

interface MongoDate {
  $date: string;
}

const chartConfig = {
  voltage: {
    label: "Voltaje (V)",
    theme: {
      light: "hsl(142.1 76.2% 36.3%)", // Verde
      dark: "hsl(142.1 70.6% 45.3%)",
    },
  },
  current: {
    label: "Corriente (A)",
    theme: {
      light: "hsl(346.8 77.2% 49.8%)", // Rojo
      dark: "hsl(346.8 77.2% 49.8%)",
    },
  },
};

export function MeasurementsChart() {
  const { dateRange, selectedArea, selectedSensor, selectedWorkCenter } =
    useFiltersStore();

  // Determinar el tipo de agregación basado en el rango de fechas
  const getAggregationType = () => {
    if (!dateRange?.from || !dateRange?.to) return '15min';
    
    const days = differenceInDays(dateRange.to, dateRange.from);
    
    if (days <= 7) return '15min';
    if (days <= 30) return 'hour';
    if (days <= 180) return 'day';
    return 'week';
  };

  const { data, isLoading } = useQuery({
    queryKey: [
      "measurements",
      dateRange,
      selectedArea,
      selectedSensor,
      selectedWorkCenter,
      getAggregationType(),
    ],
    queryFn: () =>
      getMeasurements({
        dateRange: dateRange
          ? {
              from: dateRange.from || new Date(),
              to: dateRange.to || new Date(),
            }
          : undefined,
        areaId: selectedArea,
        sensorId: selectedSensor,
        workCenterId: selectedWorkCenter,
        aggregationType: getAggregationType(),
      }),
  });

  const chartData = data?.data?.map((measurement) => {
    // Determinar si es una medición agregada o normal
    const isAggregated = 'avgVoltage' in measurement;

    // Asegurarnos de que la fecha sea válida
    const rawDate = isAggregated ? measurement.timestamp : measurement.date;
    let dateObj;
    try {
      // Manejar formato MongoDB { $date: "..." }
      if (rawDate && typeof rawDate === 'object' && '$date' in rawDate) {
        dateObj = new Date((rawDate as MongoDate).$date);
      } else if (typeof rawDate === 'string') {
        dateObj = new Date(rawDate);
      } else {
        console.error('Formato de fecha no soportado:', rawDate);
        dateObj = new Date();
      }

      if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date');
      }
    } catch (error) {
      console.error('Error parsing date:', rawDate, error);
      dateObj = new Date();
    }

    return {
      date: format(dateObj, "dd/MM/yyyy HH:mm", { locale: es }),
      voltage: isAggregated ? measurement.avgVoltage : measurement.voltage,
      maxVoltage: isAggregated ? measurement.maxVoltage : measurement.voltage,
      minVoltage: isAggregated ? measurement.minVoltage : measurement.voltage,
      current: isAggregated ? measurement.avgCurrent : measurement.current,
      maxCurrent: isAggregated ? measurement.maxCurrent : measurement.current,
      minCurrent: isAggregated ? measurement.minCurrent : measurement.current,
    };
  }) || [];

  // Obtener información del primer registro para mostrar detalles del sensor
  const firstMeasurement = data?.data?.[0];
  const sensorInfo = firstMeasurement?.sensor;
  const subtitle = sensorInfo
    ? `${sensorInfo.sensorId} - ${sensorInfo.area.name} - ${sensorInfo.area.workCenter.name}`
    : undefined;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mediciones Históricas</CardTitle>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!chartData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mediciones Históricas</CardTitle>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <p className="text-muted-foreground">No hay datos para mostrar</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle>Mediciones Históricas</CardTitle>
          <div className="flex items-center gap-4">
            <DashboardFilters />
          </div>
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ChartContainer
            config={chartConfig}
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="voltageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142.1 76.2% 36.3%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(142.1 76.2% 36.3%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(346.8 77.2% 49.8%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(346.8 77.2% 49.8%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis
                  yAxisId="voltage"
                  orientation="left"
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                  label={{
                    value: "Voltaje (V)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <YAxis
                  yAxisId="current"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                  label={{
                    value: "Corriente (A)",
                    angle: 90,
                    position: "insideRight",
                  }}
                />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;

                    const data = payload[0]?.payload;
                    if (!data) return null;

                    // Asegurarnos de que todos los valores y colores estén definidos
                    const safeValue = (value: number | undefined): number => (value !== undefined ? value : 0);
                    
                    // Tooltip personalizado
                    return (
                      <div className="border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl">
                        <div className="font-medium">{`Fecha: ${label}`}</div>
                        <div className="grid gap-1.5">
                          {/* Voltaje */}
                          <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: chartConfig.voltage.theme.light }} />
                            <div className="flex flex-1 justify-between items-center">
                              <span className="text-muted-foreground">Voltaje</span>
                              <span className="text-foreground font-mono font-medium tabular-nums">
                                {safeValue(data.voltage).toFixed(2)} V
                              </span>
                            </div>
                          </div>
                          
                          {/* Voltaje Máx */}
                          <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: chartConfig.voltage.theme.light, opacity: 0.7 }} />
                            <div className="flex flex-1 justify-between items-center">
                              <span className="text-muted-foreground">Voltaje Máx</span>
                              <span className="text-foreground font-mono font-medium tabular-nums">
                                {safeValue(data.maxVoltage).toFixed(2)} V
                              </span>
                            </div>
                          </div>
                          
                          {/* Voltaje Mín */}
                          <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: chartConfig.voltage.theme.light, opacity: 0.7 }} />
                            <div className="flex flex-1 justify-between items-center">
                              <span className="text-muted-foreground">Voltaje Mín</span>
                              <span className="text-foreground font-mono font-medium tabular-nums">
                                {safeValue(data.minVoltage).toFixed(2)} V
                              </span>
                            </div>
                          </div>
                          
                          {/* Corriente */}
                          <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: chartConfig.current.theme.light }} />
                            <div className="flex flex-1 justify-between items-center">
                              <span className="text-muted-foreground">Corriente</span>
                              <span className="text-foreground font-mono font-medium tabular-nums">
                                {safeValue(data.current).toFixed(2)} A
                              </span>
                            </div>
                          </div>
                          
                          {/* Corriente Máx */}
                          <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: chartConfig.current.theme.light, opacity: 0.7 }} />
                            <div className="flex flex-1 justify-between items-center">
                              <span className="text-muted-foreground">Corriente Máx</span>
                              <span className="text-foreground font-mono font-medium tabular-nums">
                                {safeValue(data.maxCurrent).toFixed(2)} A
                              </span>
                            </div>
                          </div>
                          
                          {/* Corriente Mín */}
                          <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: chartConfig.current.theme.light, opacity: 0.7 }} />
                            <div className="flex flex-1 justify-between items-center">
                              <span className="text-muted-foreground">Corriente Mín</span>
                              <span className="text-foreground font-mono font-medium tabular-nums">
                                {safeValue(data.minCurrent).toFixed(2)} A
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="voltage"
                  yAxisId="voltage"
                  stroke={chartConfig.voltage.theme.light}
                  strokeWidth={2}
                  fill="url(#voltageGradient)"
                  name="Voltaje"
                  connectNulls
                  activeDot={{ r: 6, fill: chartConfig.voltage.theme.light, strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="current"
                  yAxisId="current"
                  stroke={chartConfig.current.theme.light}
                  strokeWidth={2}
                  fill="url(#currentGradient)"
                  name="Corriente"
                  connectNulls
                  activeDot={{ r: 6, fill: chartConfig.current.theme.light, strokeWidth: 1 }}
                />
                <ChartLegend
                  className="mt-2"
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={10}
                  layout="horizontal"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-sm bg-gradient-to-b from-[hsl(142.1_76.2%_36.3%)] to-transparent" />
            Voltaje: Medición del voltaje en Voltios (V)
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-sm bg-gradient-to-b from-[hsl(346.8_77.2%_49.8%)] to-transparent" />
            Corriente: Medición de la corriente en Amperios (A)
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 