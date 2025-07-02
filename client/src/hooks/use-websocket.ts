import { useState, useEffect, useCallback } from 'react';
import type { 
  WebSocketMessage, 
  NetworkMetrics, 
  MiningOperation, 
  ProductiveBlock, 
  MathematicalWork 
} from '@shared/schema';

export function useWebSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [metrics, setMetrics] = useState<NetworkMetrics | null>(null);
  const [operations, setOperations] = useState<MiningOperation[]>([]);
  const [blocks, setBlocks] = useState<ProductiveBlock[]>([]);
  const [discoveries, setDiscoveries] = useState<MathematicalWork[]>([]);

  const connect = useCallback(() => {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const newSocket = new WebSocket(wsUrl);

      newSocket.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
      };

      newSocket.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt to reconnect after 3 seconds
        setTimeout(() => {
          if (!socket || socket.readyState === WebSocket.CLOSED) {
            connect();
          }
        }, 3000);
      };

      newSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      newSocket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      setSocket(newSocket);
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  }, [socket]);

  const handleMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'initial_data':
        if (message.data.metrics) setMetrics(message.data.metrics);
        if (message.data.operations) setOperations(message.data.operations);
        if (message.data.blocks) setBlocks(message.data.blocks);
        break;

      case 'metrics_update':
        setMetrics(message.data);
        break;

      case 'mining_progress':
        setOperations(prev => {
          const updated = [...prev];
          const index = updated.findIndex(op => op.id === message.data.id);
          if (index >= 0) {
            updated[index] = message.data;
          } else {
            updated.unshift(message.data);
          }
          return updated.slice(0, 10); // Keep only latest 10
        });
        break;

      case 'block_mined':
        setBlocks(prev => [message.data.block, ...prev.slice(0, 9)]); // Keep latest 10
        if (message.data.mathematicalWork) {
          setDiscoveries(prev => [...message.data.mathematicalWork, ...prev.slice(0, 7)]);
        }
        break;

      case 'discovery_made':
        setDiscoveries(prev => [message.data, ...prev.slice(0, 9)]); // Keep latest 10
        break;

      default:
        console.log('Unknown message type:', message.type);
    }
  }, []);

  useEffect(() => {
    connect();

    // Memory cleanup interval to prevent buildup
    const cleanupInterval = setInterval(() => {
      setDiscoveries(prev => prev.slice(0, 20)); // Keep only 20 most recent
      setOperations(prev => prev.slice(0, 10)); // Keep only 10 most recent  
      setBlocks(prev => prev.slice(0, 15)); // Keep only 15 most recent
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => {
      if (socket) {
        socket.close();
      }
      clearInterval(cleanupInterval);
    };
  }, []);

  // Clean up old completed operations
  useEffect(() => {
    const interval = setInterval(() => {
      setOperations(prev => 
        prev.filter(op => op.status === 'active' || 
          (op.status === 'completed' && Date.now() - new Date(op.startTime).getTime() < 300000)
        )
      );
    }, 60000); // Clean every minute

    return () => clearInterval(interval);
  }, []);

  return {
    isConnected,
    metrics,
    operations,
    blocks,
    discoveries
  };
}
