"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DownloadIcon } from "lucide-react";

import { WorkCenterFilter } from "@/components/dashboard/filters/WorkCenterFilter";
import { AreaFilter } from "@/components/dashboard/filters/AreaFilter";
import { SensorFilter } from "@/components/dashboard/filters/SensorFilter";
import { DateRangeFilter } from "@/components/dashboard/filters/DateRangeFilter";
import { MeasurementHistoryChart } from "@/components/dashboard/MeasurementHistoryChart";
import { MeasurementTable } from "@/components/dashboard/MeasurementTable";
import { useFiltersStore } from "@/store/filters.store";
import { useWorkCentersStore } from "@/store/work-centers.store";
import { getMeasurements } from "@/lib/services/measurements-service";

export function WorkCentersInfoDashboard() {
  // Estado para el tab activo
  const [activeTab, setActiveTab] = useState<string>("grafica");

  // Obtener filtros del store
  const {
    dateRange,
    selectedWorkCenter,
    selectedArea,
    selectedSensor,
    reset: resetFilters,
  } = useFiltersStore();

  // Obtenemos información sobre centros, áreas y sensores
  const workCenters = useWorkCentersStore((state) => state.workCenters);

  // Buscar nombres correspondientes a los IDs seleccionados
  const workCenterObj = workCenters.find((wc) => wc.id === selectedWorkCenter);
  const workCenterName = workCenterObj?.name;

  // Formatear fechas para API
  const startDate = dateRange?.from
    ? new Date(dateRange.from).toISOString().split("T")[0]
    : undefined;
  const endDate = dateRange?.to
    ? new Date(dateRange.to).toISOString().split("T")[0]
    : undefined;

  // Query para obtener mediciones
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      "measurements",
      selectedWorkCenter,
      selectedArea,
      selectedSensor,
      startDate,
      endDate,
    ],
    queryFn: () =>
      getMeasurements({
        workCenterId: selectedWorkCenter,
        areaId: selectedArea,
        sensorId: selectedSensor,
        startDate,
        endDate,
        page: 1,
        limit: 1000, // Límite alto para obtener suficientes datos históricos
      }),
    enabled: Boolean(selectedWorkCenter), // Solo consultar si hay al menos un centro seleccionado
  });

  // Función para exportar datos a CSV
  const exportToCSV = () => {
    if (!data?.data || data.data.length === 0) return;

    // Cabecera CSV
    const headers = [
      "Fecha",
      "Hora",
      "Centro de Trabajo",
      "Área",
      "Sensor",
      "Voltaje",
      "Corriente",
    ];

    // Datos formateados
    const csvData = data.data.map((m) => {
      const date = new Date(m.date);
      return [
        date.toLocaleDateString(),
        date.toLocaleTimeString(),
        m.sensor.area.workCenter.name,
        m.sensor.area.name,
        m.sensor.sensorId,
        m.voltage,
        m.current,
      ].join(",");
    });

    // Unir todo
    const csvContent = [headers.join(","), ...csvData].join("\n");

    // Crear y descargar archivo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `mediciones_${workCenterName || "todos"}_${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    link.click();
  };

  // Determinar si hay datos disponibles
  const hasData = data?.data && data.data.length > 0;

  return (
    <div className="space-y-6">
      {/* Sección de filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Consulta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <WorkCenterFilter />
            <AreaFilter />
            <SensorFilter />
            <DateRangeFilter />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="flex items-center gap-1"
            >
              Limpiar Filtros
            </Button>
            <Button variant="default" size="sm" onClick={() => refetch()}>
              Consultar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contenido principal y visualización */}
      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="pt-6 text-red-500">
            <div className="text-center">
              <p>
                Error al cargar las mediciones. Por favor, intenta nuevamente.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : !selectedWorkCenter ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-muted-foreground">
              <h3 className="text-lg font-medium">
                Selecciona un Centro de Trabajo
              </h3>
              <p className="mt-1">
                Utiliza los filtros para visualizar los datos de mediciones.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : !hasData ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-muted-foreground">
              <h3 className="text-lg font-medium">No hay datos disponibles</h3>
              <p className="mt-1">
                No se encontraron mediciones con los filtros seleccionados.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Tabs para cambiar entre gráfica y tabla */}
          <Tabs
            defaultValue="grafica"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="grafica">Gráfica</TabsTrigger>
                <TabsTrigger value="tabla">Tabla</TabsTrigger>
              </TabsList>

              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                className="flex items-center gap-1"
              >
                <DownloadIcon className="h-4 w-4" />
                Exportar CSV
              </Button>
            </div>

            <TabsContent value="grafica" className="mt-4">
              <MeasurementHistoryChart data={data?.data || []} />
            </TabsContent>

            <TabsContent value="tabla" className="mt-4">
              <MeasurementTable data={data?.data || []} />
            </TabsContent>
          </Tabs>

          {/* Resumen estadístico */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Mediciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.meta?.total || data?.data.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Voltaje Promedio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.data.length
                    ? (
                        data?.data.reduce((sum, m) => sum + m.voltage, 0) /
                        data?.data.length
                      ).toFixed(2)
                    : "N/A"}{" "}
                  V
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Corriente Promedio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.data.length
                    ? (
                        data?.data.reduce((sum, m) => sum + m.current, 0) /
                        data?.data.length
                      ).toFixed(2)
                    : "N/A"}{" "}
                  A
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Última Medición
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  {data?.data.length
                    ? new Date(
                        Math.max(
                          ...data?.data.map((m) => new Date(m.date).getTime())
                        )
                      ).toLocaleString()
                    : "N/A"}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
