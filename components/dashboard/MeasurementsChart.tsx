"use client";

import { useQuery } from "@tanstack/react-query";
import { useFiltersStore } from "@/store/filters.store";
import { getMeasurements } from "@/lib/services/measurements-service";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

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

  const { data, isLoading } = useQuery({
    queryKey: [
      "measurements",
      dateRange,
      selectedArea,
      selectedSensor,
      selectedWorkCenter,
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
      }),
  });

  const chartData = data?.data?.map((measurement) => ({
    date: format(new Date(measurement.date), "dd/MM/yyyy HH:mm", {
      locale: es,
    }),
    voltage: measurement.voltage,
    current: measurement.current,
  })) || [];

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
      <CardHeader>
        <CardTitle>Mediciones Históricas</CardTitle>
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

                  return (
                    <ChartTooltipContent
                      active={active}
                      payload={payload}
                      label={label}
                      labelFormatter={(value) => `Fecha: ${value}`}
                      nameKey="name"
                    />
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="voltage"
                yAxisId="voltage"
                stroke="hsl(142.1 76.2% 36.3%)"
                strokeWidth={2}
                fill="url(#voltageGradient)"
                name="Voltaje"
              />
              <Area
                type="monotone"
                dataKey="current"
                yAxisId="current"
                stroke="hsl(346.8 77.2% 49.8%)"
                strokeWidth={2}
                fill="url(#currentGradient)"
                name="Corriente"
              />
              <ChartLegend
                className="mt-2"
                verticalAlign="bottom"
              />
            </AreaChart>
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