import { Battery, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Statistics } from "@/lib/services/statistics-service";

interface StatisticsCardsProps {
  data?: Statistics;
  isLoading?: boolean;
}

export function StatisticsCards({ data, isLoading }: StatisticsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={i}
            className="relative overflow-hidden backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 ring-1 ring-gray-200 dark:ring-gray-800 
            transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 via-gray-500/10 to-transparent opacity-60" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-[120px] bg-gray-200/60 dark:bg-gray-700/60" />
              </CardTitle>
              <div className="rounded-full p-2 bg-gray-100/50 dark:bg-gray-800/50">
                <Skeleton className="h-5 w-5 rounded-full bg-gray-300/60 dark:bg-gray-600/60" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-2">
                <Skeleton className="h-8 w-[140px] bg-gray-200/60 dark:bg-gray-700/60" />
                <Skeleton className="h-3 w-[180px] bg-gray-200/60 dark:bg-gray-700/60" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Voltaje Promedio",
      icon: <Zap className="h-5 w-5 text-blue-500" />,
      mainValue: `${data?.voltage.avg.toFixed(2) || 0} V`,
      subValue: `Máx: ${data?.voltage.max.toFixed(2) || 0} V | Mín: ${
        data?.voltage.min.toFixed(2) || 0
      } V`,
      gradient:
        "bg-gradient-to-br from-blue-500/5 via-blue-500/10 to-transparent",
      ringColor: "ring-blue-200 dark:ring-blue-800",
      iconBg: "bg-blue-500/10",
    },
    {
      title: "Corriente Promedio",
      icon: <Battery className="h-5 w-5 text-amber-500" />,
      mainValue: `${data?.current.avg.toFixed(2) || 0} A`,
      subValue: `Máx: ${data?.current.max.toFixed(2) || 0} A | Mín: ${
        data?.current.min.toFixed(2) || 0
      } A`,
      gradient:
        "bg-gradient-to-br from-amber-500/5 via-amber-500/10 to-transparent",
      ringColor: "ring-amber-200 dark:ring-amber-800",
      iconBg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card
          key={index}
          className={`relative overflow-hidden backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 ring-1 ${card.ringColor} 
          hover:shadow-xl transition-all duration-300 group`}
        >
          <div className={`absolute inset-0 ${card.gradient} opacity-60`} />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium tracking-tight text-gray-700 dark:text-gray-200">
              {card.title}
            </CardTitle>
            <div
              className={`rounded-full p-2 ${card.iconBg} group-hover:scale-110 transition-transform duration-300`}
            >
              {card.icon}
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
              {card.mainValue}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              {card.subValue}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
