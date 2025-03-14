"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

// Definimos el tipo de medición basado en lo que vemos en el backend
interface Measurement {
  id: string;
  voltage: number;
  current: number;
  date: string;
  sensor: {
    id: string;
    sensorId: string;
    area: {
      id: string;
      name: string;
      workCenter: {
        id: string;
        name: string;
      };
    };
  };
}

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

export function MeasurementHistoryChart({ data }: { data: Measurement[] }) {
  // Si no hay datos, mostramos un mensaje
  if (!data || data.length === 0) {
    return (
      <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Historial de Mediciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-muted-foreground">
              No hay datos disponibles para mostrar en la gráfica.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Ordenamos los datos por fecha (ascendente)
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Procesamos los datos para la gráfica
  const chartData = sortedData.map((m) => {
    const date = new Date(m.date);
    return {
      date: date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      voltage: m.voltage,
      current: m.current,
    };
  });

  // Calculamos estadísticas para mostrar en la gráfica
  const stats = {
    minVoltage: Math.min(...sortedData.map((m) => m.voltage)),
    maxVoltage: Math.max(...sortedData.map((m) => m.voltage)),
    avgVoltage: parseFloat(
      (
        sortedData.reduce((acc, m) => acc + m.voltage, 0) / sortedData.length
      ).toFixed(2)
    ),
    minCurrent: Math.min(...sortedData.map((m) => m.current)),
    maxCurrent: Math.max(...sortedData.map((m) => m.current)),
    avgCurrent: parseFloat(
      (
        sortedData.reduce((acc, m) => acc + m.current, 0) / sortedData.length
      ).toFixed(2)
    ),
    firstDate: new Date(sortedData[0].date).toLocaleString(),
    lastDate: new Date(sortedData[sortedData.length - 1].date).toLocaleString(),
  };

  return (
    <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Historial de Mediciones</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Resumen estadístico en mini-cards */}
        <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-950/30">
            <div className="text-xs text-muted-foreground">Periodo</div>
            <div className="mt-1 text-xs">
              {stats.firstDate} - {stats.lastDate}
            </div>
          </div>
          <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-950/30">
            <div className="text-xs text-muted-foreground">Voltaje (min/max/avg)</div>
            <div className="mt-1 text-xs">
              {stats.minVoltage.toFixed(2)} / {stats.maxVoltage.toFixed(2)} /{" "}
              {stats.avgVoltage.toFixed(2)} V
            </div>
          </div>
          <div className="rounded-lg bg-green-50 p-2 dark:bg-green-950/30">
            <div className="text-xs text-muted-foreground">Corriente (min/max/avg)</div>
            <div className="mt-1 text-xs">
              {stats.minCurrent.toFixed(2)} / {stats.maxCurrent.toFixed(2)} /{" "}
              {stats.avgCurrent.toFixed(2)} A
            </div>
          </div>
          <div className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800/50">
            <div className="text-xs text-muted-foreground">Total mediciones</div>
            <div className="mt-1 text-xs">{sortedData.length} registros</div>
          </div>
        </div>

        {/* Gráfica */}
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="voltageGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tick={{ fontSize: 10 }}
              interval={"preserveEnd"}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tickLine={false}
              tick={{ fontSize: 10 }}
              width={40}
              domain={[
                (dataMin: number) => Math.floor(dataMin * 0.9),
                (dataMax: number) => Math.ceil(dataMax * 1.1),
              ]}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent 
                  formatter={(value, name) => {
                    return name === 'voltage' 
                      ? `${value} V` 
                      : `${value} A`;
                  }} 
                />
              }
            />
            <Area
              type="monotone"
              dataKey="voltage"
              stackId="1"
              stroke="var(--color-voltage)"
              fillOpacity={1}
              fill="url(#voltageGradient)"
            />
            <Area
              type="monotone"
              dataKey="current"
              stackId="2"
              stroke="var(--color-current)"
              fillOpacity={1}
              fill="url(#currentGradient)"
            />
          </AreaChart>
        </ChartContainer>

        {/* Leyenda y notas */}
        <div className="mt-4 flex items-center justify-center space-x-4">
          <div className="flex items-center">
            <div
              className="mr-1 h-3 w-3 rounded-full"
              style={{ backgroundColor: "#2563eb" }}
            ></div>
            <span className="text-xs">Voltaje (V)</span>
          </div>
          <div className="flex items-center">
            <div
              className="mr-1 h-3 w-3 rounded-full"
              style={{ backgroundColor: "#10b981" }}
            ></div>
            <span className="text-xs">Corriente (A)</span>
          </div>
        </div>
        <div className="mt-2 text-center text-xs text-muted-foreground">
          Datos mostrados: {chartData.length} de {data.length} mediciones
        </div>
      </CardContent>
    </Card>
  );
} 