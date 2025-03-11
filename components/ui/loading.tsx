'use client';

import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LoadingProps {
  size?: number;
  text?: string;
  fullScreen?: boolean;
}

export function Loading({ size = 24, text = 'Cargando...', fullScreen = false }: LoadingProps) {
  // Añadir un pequeño delay para evitar flashes en cargas rápidas
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (!show) {
    return null;
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50 transition-all duration-500 ease-out">
        <Loader2 className="animate-spin mb-2" size={size} />
        <p className="text-muted-foreground">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <Loader2 className="animate-spin mb-2" size={size} />
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
} 