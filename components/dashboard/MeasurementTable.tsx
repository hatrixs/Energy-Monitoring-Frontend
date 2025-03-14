"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

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

export function MeasurementTable({ data }: { data: Measurement[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Si no hay datos, mostramos un mensaje
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Mediciones</CardTitle>
          <CardDescription>
            Tabla de registros históricos de mediciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-muted-foreground">
              No hay datos disponibles para mostrar en la tabla.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filtramos los datos según el término de búsqueda
  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      item.sensor.sensorId.toLowerCase().includes(searchLower) ||
      item.sensor.area.name.toLowerCase().includes(searchLower) ||
      item.sensor.area.workCenter.name.toLowerCase().includes(searchLower) ||
      new Date(item.date).toLocaleString().toLowerCase().includes(searchLower)
    );
  });

  // Ordenamos por fecha descendente (más reciente primero)
  const sortedData = [...filteredData].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculamos la paginación
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  // Manejar cambios de página
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <CardTitle>Historial de Mediciones</CardTitle>
            <CardDescription>
              Tabla de registros históricos de mediciones
            </CardDescription>
          </div>
          <div className="flex w-full flex-col space-y-2 md:w-auto md:flex-row md:space-x-2 md:space-y-0">
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 md:w-[200px]"
            />
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(parseInt(value));
                setCurrentPage(1); // Reset to first page on page size change
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Fecha y Hora</TableHead>
                <TableHead>Centro de Trabajo</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Sensor</TableHead>
                <TableHead className="text-right">Voltaje (V)</TableHead>
                <TableHead className="text-right">Corriente (A)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((measurement) => (
                <TableRow key={measurement.id}>
                  <TableCell className="font-medium">
                    {new Date(measurement.date).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {measurement.sensor.area.workCenter.name}
                  </TableCell>
                  <TableCell>{measurement.sensor.area.name}</TableCell>
                  <TableCell>{measurement.sensor.sensorId}</TableCell>
                  <TableCell className="text-right">
                    {measurement.voltage.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {measurement.current.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Paginación */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1}-
              {Math.min(startIndex + pageSize, sortedData.length)} de{" "}
              {sortedData.length} registros
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <div className="text-sm">
                Página {currentPage} de {totalPages || 1}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 