import { io, Socket } from 'socket.io-client';

export interface Measurement {
  workCenter: string;
  area: string;
  sensorId: string;
  voltage: number;
  current: number;
  date: string;
  time: string;
}

class WebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(data: Measurement) => void>> = new Map();

  connect() {
    if (this.socket) return;

    this.socket = io(process.env.NEXT_PUBLIC_API_URL, {
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log('Conectado al servidor WebSocket');
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor WebSocket');
    });

    this.socket.on('new:measurement', (data: Measurement) => {
      this.notifyListeners('new:measurement', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribe(event: string, callback: (data: Measurement) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  unsubscribe(event: string, callback: (data: Measurement) => void) {
    this.listeners.get(event)?.delete(callback);
  }

  private notifyListeners(event: string, data: Measurement) {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }

  subscribeToMeasurements(filters: { workCenterId?: string; areaId?: string; sensorId?: string }) {
    if (this.socket) {
      this.socket.emit('subscribe:measurements', filters);
    }
  }
}

export const websocketService = new WebSocketService(); 