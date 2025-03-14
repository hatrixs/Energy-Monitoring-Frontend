import { WorkCentersInfoDashboard } from "@/components/dashboard/WorkCentersInfoDashboard";

export default function WorkCentersPage() {
  return (
    <div className="flex-1 space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Consulta de Mediciones por Centro de Trabajo</h1>
      <p className="text-muted-foreground">
        Selecciona los filtros deseados para visualizar el historial de mediciones por centro de trabajo.
      </p>
      
      <WorkCentersInfoDashboard />
    </div>
  );
}
